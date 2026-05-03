export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostHeader = request.headers.get('host') || "";
    const host = hostHeader.split(":")[0].toLowerCase();
    const path = url.pathname;
    const method = request.method.toUpperCase();
    const southarmHosts = new Set(["southarm.ca", "www.southarm.ca"]);
    const veryboringHosts = new Set(["veryboring.ai", "www.veryboring.ai"]);
    const allowedRecaptchaHosts = new Set([
      "southarm.ca",
      "www.southarm.ca",
      "veryboring.ai",
      "www.veryboring.ai",
      "veryboring-23x.pages.dev",
    ]);

    if (path === "/api/contact") {
      if (method === "OPTIONS") {
        return new Response(null, { status: 204 });
      }

      if (method !== "POST") {
        return json({ message: "Method Not Allowed" }, 405);
      }

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

        if (!token) {
          return json({ message: "Missing reCAPTCHA token." }, 400);
        }
        if (!fields.length) {
          return json({ message: "No valid form fields provided." }, 400);
        }

        const recaptchaBody = new URLSearchParams({
          secret: env.RECAPTCHA_SECRET_KEY,
          response: token,
        });
        const ip = request.headers.get("CF-Connecting-IP");
        if (ip) {
          recaptchaBody.set("remoteip", ip);
        }

        const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: recaptchaBody.toString(),
        });

        if (!recaptchaRes.ok) {
          return json({ message: "reCAPTCHA verification unavailable." }, 502);
        }

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

        if (!isRecaptchaValid) {
          return json({ message: "reCAPTCHA verification failed." }, 400);
        }

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

    // Helper to check if the request is already pointing to a project folder
    const isProjectFolder = path.startsWith('/it-services/') || path.startsWith('/ai-and-automation/');

    // 1. Routing for southarm.ca
    if (southarmHosts.has(host)) {
      // If root, serve it-services index
      if (path === '/' || path === '') {
        url.pathname = '/it-services/index.html';
        return env.ASSETS.fetch(url);
      }
      
      // If the request is already directed at a project folder, serve it as-is
      if (isProjectFolder) {
        return env.ASSETS.fetch(request);
      }

      // If it's a file request (has an extension) not in a folder, prefix with it-services
      if (path.includes('.')) {
        url.pathname = `/it-services${path}`;
        return env.ASSETS.fetch(url);
      }
    }

    // 2. Routing for veryboring.ai
    if (veryboringHosts.has(host)) {
      // If root, serve ai-and-automation index
      if (path === '/' || path === '') {
        url.pathname = '/ai-and-automation/index.html';
        return env.ASSETS.fetch(url);
      }

      // If already directed at a project folder, serve as-is
      if (isProjectFolder) {
        return env.ASSETS.fetch(request);
      }

      // If it's a file request (has an extension) not in a folder, prefix with ai-and-automation
      if (path.includes('.')) {
        url.pathname = `/ai-and-automation${path}`;
        return env.ASSETS.fetch(url);
      }
    }

    // Default: serve as-is
    return env.ASSETS.fetch(request);
  }
};

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
