import { escAttr, escXml } from "./escape.js";

const SEO_META = {
  "it-services": {
    default: {
      title: "Managed IT Services | Very Boring Technologies",
      description: "Security-first managed IT services for growing businesses. Flat-rate pricing, 24/7 support, and zero-trust architecture. Serving the Greater Vancouver area.",
      ogType: "website",
    },
    "index.html": {
      title: "Managed IT Services | Very Boring Technologies",
      description: "Security-first managed IT services for growing businesses. Flat-rate pricing, 24/7 support, and zero-trust architecture. Serving the Greater Vancouver area.",
    },
    "home.html": {
      title: "Managed IT Services | Very Boring Technologies",
      description: "Security-first managed IT services for growing businesses. Flat-rate pricing, 24/7 support, and zero-trust architecture. Serving the Greater Vancouver area.",
    },
    "services.html": {
      title: "Our IT Services | Very Boring Technologies",
      description: "Explore our full suite of managed IT services: security architecture, endpoint management, network management, backup & recovery, and unlimited support.",
    },
    "pricing.html": {
      title: "IT Services Pricing | Very Boring Technologies",
      description: "Simple, transparent flat-rate pricing for managed IT services. No surprise bills. Includes support, patching, and security monitoring.",
    },
    "why-us.html": {
      title: "Why Choose Us | Very Boring Technologies",
      description: "Learn why businesses choose Very Boring Technologies for their managed IT. Privacy-respecting, security-first, and straightforward.",
    },
  },
  "ai-and-automation": {
    default: {
      title: "AI & Automation | Very Boring Technologies",
      description: "AI-powered automation solutions for your business workflows. Build voice agents, automate repetitive processes, and integrate with your existing tools.",
      ogType: "website",
    },
    "home.html": {
      title: "AI & Automation Services | Very Boring Technologies",
      description: "AI-powered automation for your business. Voice agents, workflow automation, and custom AI integrations. Join our Launch Partner program.",
    },
    "services.html": {
      title: "Our AI Services | Very Boring Technologies",
      description: "Detailed look at our AI & Automation services: report automation, browser automation, voice agents, data chatbots, and predictive analytics.",
    },
    "pricing.html": {
      title: "AI Automation Pricing | Very Boring Technologies",
      description: "Transparent pricing for AI & Automation projects. Compare our Launch Partner program with our Standard development model.",
    },
  },
};

export function buildSeoMeta(folder, file, content, requestUrl) {
  const folderMeta = SEO_META[folder] || {};
  const pageMeta = { ...(folderMeta.default || {}), ...(folderMeta[file] || {}) };

  const title = pageMeta.title || "Very Boring Technologies";
  const description = pageMeta.description || "";
  const ogType = pageMeta.ogType || "website";

  const heroHeadline = content?.hero?.slides?.[0]?.headline || content?.hero?.headline || "";
  const finalDescription = description || heroHeadline;
  const canonicalUrl = requestUrl?.toString?.() || "";

  return `
  <!-- SEO: injected by edge worker -->
  <link rel="canonical" href="${escAttr(canonicalUrl)}">
  <meta name="description" content="${escAttr(finalDescription)}">
  <meta name="robots" content="index,follow">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(finalDescription)}">
  <meta property="og:url" content="${escAttr(canonicalUrl)}">
  <meta property="og:type" content="${escAttr(ogType)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(title)}">
  <meta name="twitter:description" content="${escAttr(finalDescription)}">`.trim();
}

export function getSitemapUrls(host) {
  if (host === "southarm.ca" || host === "www.southarm.ca") {
    return ["/", "/services.html", "/pricing.html", "/why-us.html"];
  }
  if (host === "veryboring.ai" || host === "www.veryboring.ai") {
    return ["/", "/services.html", "/pricing.html"];
  }
  return ["/it-services/", "/it-services/services.html", "/it-services/pricing.html", "/it-services/why-us.html", "/ai-and-automation/"];
}

export function createRobotsTxtResponse(origin) {
  const sitemapUrl = `${origin}/sitemap.xml`;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export function createSitemapResponse(host, origin) {
  const urls = getSitemapUrls(host);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((p) => `  <url><loc>${escXml(`${origin}${p}`)}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
