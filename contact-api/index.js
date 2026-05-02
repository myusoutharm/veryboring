export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const { token, fields, context } = await request.json();

      // 1. Verify reCAPTCHA with Google
      const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      });

      const recaptchaData = await recaptchaRes.json();
      if (!recaptchaData.success) {
        return new Response(JSON.stringify({ message: "reCAPTCHA verification failed." }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // 2. Forward data to HubSpot Submissions API v3
      const portalId = env.HUBSPOT_PORTAL_ID;
      const formId   = env.HUBSPOT_FORM_ID;

      const hsRes = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields,
            context: {
              ...context,
              // Overwrite or ensure these are present for better tracking
              pageUri: context.pageUri || "",
              pageName: context.pageName || "Contact Form"
            }
          }),
        }
      );

      const result = await hsRes.json();
      
      return new Response(JSON.stringify(result), {
        status: hsRes.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ message: "Internal Server Error", error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
