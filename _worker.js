import { applyServerRenderedHtml } from "./worker/renderers/index.js";
import { buildSeoMeta, createRobotsTxtResponse, createSitemapResponse } from "./worker/seo.js";
import { getContentKeys } from "./worker/content-map.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostHeader = request.headers.get("host") || "";
    const host = hostHeader.split(":")[0].toLowerCase();
    const path = url.pathname;
    const method = request.method.toUpperCase();

    const southarmHosts = new Set(["southarm.ca", "www.southarm.ca"]);
    const veryboringHosts = new Set(["veryboring.ai", "www.veryboring.ai"]);
    const allowedRecaptchaHosts = new Set([
      "southarm.ca", "www.southarm.ca",
      "veryboring.ai", "www.veryboring.ai",
      "veryboring-23x.pages.dev",
    ]);

    if (path === "/robots.txt") {
      return createRobotsTxtResponse(url.origin);
    }

    if (path === "/sitemap.xml") {
      return createSitemapResponse(host, url.origin);
    }

    if (path === "/api/contact") {
      if (method === "OPTIONS") return new Response(null, { status: 204 });
      if (method !== "POST") return json({ message: "Method Not Allowed" }, 405);

      if (!env.RECAPTCHA_SECRET_KEY || !env.HUBSPOT_PORTAL_ID || !env.HUBSPOT_FORM_ID) {
        return json({ message: "Server is not configured." }, 500);
      }

      const contentType = request.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        return json({ message: "Invalid content type." }, 415);
      }

      try {
        const payload = await request.json();
        const token = typeof payload?.token === "string" ? payload.token.trim() : "";
        const fields = sanitizeFields(payload?.fields);
        const context = sanitizeContext(payload?.context, allowedRecaptchaHosts);

        if (!token) return json({ message: "Missing reCAPTCHA token." }, 400);
        if (!fields.length) return json({ message: "No valid form fields provided." }, 400);

        const recaptchaBody = new URLSearchParams({ secret: env.RECAPTCHA_SECRET_KEY, response: token });
        const ip = request.headers.get("CF-Connecting-IP");
        if (ip) recaptchaBody.set("remoteip", ip);

        const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: recaptchaBody.toString(),
        });

        if (!recaptchaRes.ok) return json({ message: "reCAPTCHA verification unavailable." }, 502);

        const recaptchaData = await recaptchaRes.json();
        const minScore = Number(env.RECAPTCHA_MIN_SCORE || "0.5");
        const requiredAction = env.RECAPTCHA_REQUIRED_ACTION || "contact_submit";
        const recaptchaHost = String(recaptchaData?.hostname || "").toLowerCase();

        const isRecaptchaValid =
          recaptchaData?.success === true &&
          recaptchaData?.action === requiredAction &&
          typeof recaptchaData?.score === "number" &&
          recaptchaData.score >= minScore &&
          allowedRecaptchaHosts.has(recaptchaHost);

        if (!isRecaptchaValid) return json({ message: "reCAPTCHA verification failed." }, 400);

        const hsRes = await fetch(
          `https://api.hsforms.com/submissions/v3/integration/submit/${env.HUBSPOT_PORTAL_ID}/${env.HUBSPOT_FORM_ID}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fields,
              context: {
                hutk: context.hutk || undefined,
                pageUri: context.pageUri || "",
                pageName: context.pageName || "Contact Form",
              },
            }),
          }
        );

        const result = await safeJson(hsRes);
        return json(result, hsRes.status);
      } catch {
        return json({ message: "Internal Server Error" }, 500);
      }
    }

    const isProjectFolder =
      path.startsWith("/it-services/") || path.startsWith("/ai-and-automation/");

    let siteFolder = null;

    if (southarmHosts.has(host)) {
      if (path === "/" || path === "") {
        return renderPage(env, url, "/it-services/", "it-services");
      }
      if (isProjectFolder) {
        return maybeRenderPage(env, request, url, path);
      }
      if (path.startsWith("/shared/")) {
        return env.ASSETS.fetch(request);
      }
      if (path.endsWith(".html")) {
        return renderPage(env, url, "/it-services/", "it-services", path.replace(/^\//, ""));
      }
      if (path.includes(".")) {
        url.pathname = `/it-services${path}`;
        return env.ASSETS.fetch(url);
      }
      siteFolder = "it-services";
    }

    if (veryboringHosts.has(host)) {
      if (path === "/" || path === "") {
        return renderPage(env, url, "/ai-and-automation/", "ai-and-automation");
      }
      if (isProjectFolder) {
        return maybeRenderPage(env, request, url, path);
      }
      if (path.startsWith("/shared/")) {
        return env.ASSETS.fetch(request);
      }
      if (path.endsWith(".html")) {
        return renderPage(env, url, "/ai-and-automation/", "ai-and-automation", path.replace(/^\//, ""));
      }
      if (path.includes(".")) {
        url.pathname = `/ai-and-automation${path}`;
        return env.ASSETS.fetch(url);
      }
      siteFolder = "ai-and-automation";
    }

    if (!siteFolder && isProjectFolder) {
      return maybeRenderPage(env, request, url, path);
    }

    return env.ASSETS.fetch(request);
  },
};

async function maybeRenderPage(env, request, url, path) {
  const isHtml = path.endsWith(".html") || path.endsWith("/") || !path.includes(".");
  if (!isHtml) {
    return env.ASSETS.fetch(request);
  }

  const parts = path.replace(/^\//, "").split("/");
  const folder = parts[0];
  const file = parts.slice(1).join("/") || "index.html";

  return renderPage(env, url, `/${folder}/`, folder, file);
}

async function renderPage(env, url, basePath, folder, file = "index.html") {
  const htmlUrl = new URL(url);
  htmlUrl.pathname = `${basePath}${file}`;

  const contentKeys = getContentKeys(folder, file);
  const contentPaths = contentKeys.map((k) => `${basePath}content/${k}.json`);

  const [htmlRes, ...jsonResponses] = await Promise.all([
    env.ASSETS.fetch(htmlUrl),
    ...contentPaths.map((p) => {
      const u = new URL(url);
      u.pathname = p;
      return env.ASSETS.fetch(u);
    }),
  ]);

  if (!htmlRes.ok || !htmlRes.headers.get("content-type")?.includes("text/html")) {
    return htmlRes;
  }

  const contentEntries = await Promise.all(
    jsonResponses.map(async (res, i) => {
      if (!res.ok) return null;
      try {
        const data = await res.json();
        return [contentKeys[i], data];
      } catch {
        return null;
      }
    })
  );

  const content = Object.fromEntries(contentEntries.filter(Boolean));

  const seoMeta = buildSeoMeta(folder, file, content, url);
  const contentScript = `<script>window.__CONTENT__ = ${serializeContentForScript(content)};</script>`;
  const injection = `${seoMeta}\n${contentScript}`;

  let html = await htmlRes.text();
  html = applyServerRenderedHtml(html, folder, file, content);

  if (html.includes("</head>")) {
    html = html.replace("</head>", `${injection}\n</head>`);
  } else {
    html = injection + html;
  }

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}

export function serializeContentForScript(content) {
  return JSON.stringify(content)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitizeFields(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const name = String(item.name || "").trim();
    const value = String(item.value || "").trim();
    if (!name || !value) continue;
    if (name.length > 128 || value.length > 5000) continue;
    out.push({ name, value });
    if (out.length >= 64) break;
  }
  return out;
}

function sanitizeContext(input, allowedHosts) {
  const raw = input && typeof input === "object" ? input : {};
  const hutk = String(raw.hutk || "").trim();
  const pageName = String(raw.pageName || "").trim();
  const pageUri = String(raw.pageUri || "").trim();

  let safePageUri = "";
  if (pageUri) {
    try {
      const parsed = new URL(pageUri);
      if (allowedHosts.has(parsed.hostname.toLowerCase())) {
        safePageUri = parsed.toString();
      }
    } catch {
      safePageUri = "";
    }
  }

  return {
    hutk: hutk.slice(0, 256),
    pageName: pageName.slice(0, 256),
    pageUri: safePageUri,
  };
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return { message: "HubSpot returned a non-JSON response." };
  }
}
