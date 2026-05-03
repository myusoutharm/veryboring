export default {
  async fetch(request, env) {
    const configuredOrigins = parseCsvList(env.ALLOWED_ORIGINS);
    const allowedOrigins = configuredOrigins.length
      ? configuredOrigins
      : [
          "https://southarm.ca",
          "https://www.southarm.ca",
          "https://veryboring.ai",
          "https://www.veryboring.ai",
        ];
    const allowedHosts = new Set(
      allowedOrigins
        .map((origin) => toHostname(origin))
        .filter(Boolean)
    );

    const requestOrigin = request.headers.get("Origin") || "";
    const corsHeaders = buildCorsHeaders(requestOrigin, allowedOrigins);

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      if (!corsHeaders) {
        return json(
          { message: "Origin not allowed." },
          403,
          { "Content-Type": "application/json" }
        );
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json(
        { message: "Method Not Allowed" },
        405,
        corsHeaders || { "Content-Type": "application/json" }
      );
    }

    if (!corsHeaders) {
      return json(
        { message: "Origin not allowed." },
        403,
        { "Content-Type": "application/json" }
      );
    }

    if (!env.RECAPTCHA_SECRET_KEY || !env.HUBSPOT_PORTAL_ID || !env.HUBSPOT_FORM_ID) {
      return json(
        { message: "Server is not configured." },
        500,
        withJson(corsHeaders)
      );
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json(
        { message: "Invalid content type." },
        415,
        withJson(corsHeaders)
      );
    }

    const contentLength = Number(request.headers.get("Content-Length") || "0");
    if (Number.isFinite(contentLength) && contentLength > 32_768) {
      return json(
        { message: "Payload too large." },
        413,
        withJson(corsHeaders)
      );
    }

    try {
      const payload = await request.json();
      const token = typeof payload?.token === "string" ? payload.token.trim() : "";
      const fields = sanitizeFields(payload?.fields);
      const context = sanitizeContext(payload?.context, allowedHosts);

      if (!token) {
        return json(
          { message: "Missing reCAPTCHA token." },
          400,
          withJson(corsHeaders)
        );
      }
      if (!fields.length) {
        return json(
          { message: "No valid form fields provided." },
          400,
          withJson(corsHeaders)
        );
      }

      // 1. Verify reCAPTCHA with Google
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
        return json(
          { message: "reCAPTCHA verification unavailable." },
          502,
          withJson(corsHeaders)
        );
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
        allowedHosts.has(recaptchaHost);

      if (!isRecaptchaValid) {
        return json(
          { message: "reCAPTCHA verification failed." },
          400,
          withJson(corsHeaders)
        );
      }

      // 2. Forward data to HubSpot Submissions API v3
      const portalId = env.HUBSPOT_PORTAL_ID;
      const formId = env.HUBSPOT_FORM_ID;

      const hsRes = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
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

      return new Response(JSON.stringify(result), {
        status: hsRes.status,
        headers: withJson(corsHeaders),
      });
    } catch (err) {
      return json(
        { message: "Internal Server Error" },
        500,
        withJson(corsHeaders)
      );
    }
  },
};

function parseCsvList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function toHostname(origin) {
  try {
    return new URL(origin).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function buildCorsHeaders(requestOrigin, allowedOrigins) {
  if (!requestOrigin) return null;
  if (!allowedOrigins.includes(requestOrigin)) return null;
  return {
    "Access-Control-Allow-Origin": requestOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function withJson(headers) {
  return {
    ...headers,
    "Content-Type": "application/json",
  };
}

function json(body, status = 200, headers = { "Content-Type": "application/json" }) {
  return new Response(JSON.stringify(body), { status, headers });
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
