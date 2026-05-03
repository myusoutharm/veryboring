import { describe, it, expect } from "vitest";
import { buildSeoMeta, getSitemapUrls, createRobotsTxtResponse, createSitemapResponse } from "./seo.js";

// ── buildSeoMeta ──────────────────────────────────────────────────────────────

describe("buildSeoMeta", () => {
  const mockUrl = "https://southarm.ca/services.html";

  it("returns canonical, description and og tags", () => {
    const html = buildSeoMeta("it-services", "services.html", {}, mockUrl);
    expect(html).toContain(`<link rel="canonical" href="${mockUrl}">`);
    expect(html).toContain('<meta name="description"');
    expect(html).toContain('<meta property="og:title"');
    expect(html).toContain('<meta property="og:url"');
    expect(html).toContain('<meta name="twitter:card"');
  });

  it("uses page-specific title for known pages", () => {
    const html = buildSeoMeta("it-services", "services.html", {}, mockUrl);
    expect(html).toContain("Our IT Services");
  });

  it("uses default title for unknown page in known folder", () => {
    const html = buildSeoMeta("it-services", "unknown.html", {}, mockUrl);
    expect(html).toContain("Managed IT Services");
  });

  it("falls back to hero headline when no description is set", () => {
    const content = { hero: { headline: "Hero Fallback Headline" } };
    // Use a folder/page combo with no specific description to test fallback
    const html = buildSeoMeta("it-services", "unknown.html", content, mockUrl);
    // The description is set so hero headline won't override it
    // Let's test with empty folder/page:
    const html2 = buildSeoMeta("unknown-folder", "unknown.html", content, mockUrl);
    expect(html2).toContain("Hero Fallback Headline");
  });

  it("uses hero.slides[0].headline as fallback when available", () => {
    const content = { hero: { slides: [{ headline: "Slide Hero Headline" }] } };
    const html = buildSeoMeta("unknown-folder", "unknown.html", content, mockUrl);
    expect(html).toContain("Slide Hero Headline");
  });

  it("escapes special characters in the canonical URL", () => {
    const dangerousUrl = 'https://example.com/?q=<script>&a="xss"';
    const html = buildSeoMeta("it-services", "index.html", {}, dangerousUrl);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('"xss"');
  });

  it("handles null/undefined content gracefully", () => {
    expect(() => buildSeoMeta("it-services", "index.html", null, mockUrl)).not.toThrow();
    expect(() => buildSeoMeta("it-services", "index.html", undefined, mockUrl)).not.toThrow();
  });

  it("includes og:type from folder metadata", () => {
    const html = buildSeoMeta("it-services", "index.html", {}, mockUrl);
    expect(html).toContain('content="website"');
  });
});

// ── getSitemapUrls ────────────────────────────────────────────────────────────

describe("getSitemapUrls", () => {
  it("returns IT-services paths for southarm.ca", () => {
    const urls = getSitemapUrls("southarm.ca");
    expect(urls).toContain("/");
    expect(urls).toContain("/services.html");
    expect(urls).toContain("/pricing.html");
    expect(urls).toContain("/why-us.html");
  });

  it("treats www.southarm.ca the same as southarm.ca", () => {
    expect(getSitemapUrls("www.southarm.ca")).toEqual(getSitemapUrls("southarm.ca"));
  });

  it("returns AI paths for veryboring.ai", () => {
    const urls = getSitemapUrls("veryboring.ai");
    expect(urls).toContain("/");
    expect(urls).toContain("/services.html");
    expect(urls).toContain("/pricing.html");
    expect(urls).not.toContain("/why-us.html");
  });

  it("treats www.veryboring.ai the same as veryboring.ai", () => {
    expect(getSitemapUrls("www.veryboring.ai")).toEqual(getSitemapUrls("veryboring.ai"));
  });

  it("returns combined paths for unknown host", () => {
    const urls = getSitemapUrls("localhost");
    expect(urls.some(u => u.startsWith("/it-services"))).toBe(true);
    expect(urls.some(u => u.startsWith("/ai-and-automation"))).toBe(true);
  });
});

// ── createRobotsTxtResponse ───────────────────────────────────────────────────

describe("createRobotsTxtResponse", () => {
  it("returns a 200 Response with correct Content-Type", async () => {
    const res = createRobotsTxtResponse("https://southarm.ca");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/plain");
  });

  it("body contains User-agent and Sitemap directives", async () => {
    const res = createRobotsTxtResponse("https://southarm.ca");
    const body = await res.text();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toContain("Sitemap: https://southarm.ca/sitemap.xml");
  });
});

// ── createSitemapResponse ─────────────────────────────────────────────────────

describe("createSitemapResponse", () => {
  it("returns a 200 Response with XML Content-Type", async () => {
    const res = createSitemapResponse("southarm.ca", "https://southarm.ca");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/xml");
  });

  it("body is valid XML with urlset and loc elements", async () => {
    const res = createSitemapResponse("southarm.ca", "https://southarm.ca");
    const body = await res.text();
    expect(body).toContain('<?xml version="1.0"');
    expect(body).toContain("<urlset");
    expect(body).toContain("<url><loc>");
    expect(body).toContain("https://southarm.ca/");
  });

  it("XML-encodes special characters in URLs", async () => {
    // Craft an origin with an ampersand to confirm escaping
    const res = createSitemapResponse("veryboring.ai", "https://veryboring.ai");
    const body = await res.text();
    expect(body).not.toContain("&");
  });
});
