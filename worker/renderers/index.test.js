import { describe, it, expect } from "vitest";
import { applyServerRenderedHtml } from "./index.js";

// ── applyServerRenderedHtml ───────────────────────────────────────────────────

const baseHtml = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <div id="top-bar" class="top-bar"></div>
  <div id="nav-content"></div>
  <section id="hero"></section>
  <section id="services"></section>
  <section id="why-us"></section>
  <section id="pricing"></section>
  <section id="testimonials"></section>
  <section id="contact"></section>
  <footer id="footer"></footer>
  <div id="page-title">Loading...</div>
  <div id="page-intro"></div>
</body>
</html>`;

const servicesPageHtml = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <div id="top-bar" class="top-bar"></div>
  <div id="nav-content"></div>
  <h1 id="page-title">Loading...</h1>
  <p id="page-intro"></p>
  <main id="services-detailed"></main>
  <section id="contact"></section>
  <footer id="footer"></footer>
</body>
</html>`;

const minimalContent = {
  navigation: {
    home_href: "/",
    logo: "VBT",
    branches: [{ href: "/it-services/", name: "IT Services", active: true }],
    links: [{ href: "#services", text: "Services" }],
    cta: { href: "#contact", text: "Get Started" },
  },
  footer: {
    brand: { name: "Very Boring Technologies", tagline: "Boring is reliable." },
    sections: [],
    copyright: "© 2025 VBT",
    legal_links: [],
  },
};

describe("applyServerRenderedHtml – it-services home", () => {
  const content = {
    ...minimalContent,
    hero: {
      slides: [
        {
          headline: "Managed IT",
          subheadline: "Security-first",
          visual_id: "security",
          ctas: [{ href: "#contact", text: "Get Started", variant: "primary" }],
        },
      ],
    },
    services: { section_title: "Services", section_description: "Desc", items: [] },
    "why-us": { section_title: "Why Us", section_description: "Desc", items: [] },
    pricing: {
      section_title: "Pricing",
      section_description: "Flat rate",
      column_labels: { type: "Type", rate: "Rate" },
      tiers: [],
      footnote: "No surprises.",
    },
    testimonials: { section_title: "Testimonials", items: [] },
    contact: {
      eyebrow: "Contact",
      section_title: "READY?",
      section_description: "Reach out",
      phone: "604-800-5781",
      email: "hello@vbt.ca",
      form: { title: "Contact Us", fields: [], submit_button: "Send" },
      ctas: [],
      trust_badges: [],
      recaptcha: {},
    },
  };

  it("injects hero content into the hero element", () => {
    const out = applyServerRenderedHtml(baseHtml, "it-services", "home.html", content);
    expect(out).toContain("Managed IT");
  });

  it("injects navigation into nav-content", () => {
    const out = applyServerRenderedHtml(baseHtml, "it-services", "home.html", content);
    expect(out).toContain("#services");
  });

  it("injects footer content", () => {
    const out = applyServerRenderedHtml(baseHtml, "it-services", "home.html", content);
    expect(out).toContain("Very Boring Technologies");
  });

  it("returns the original HTML unchanged for an unknown folder", () => {
    const out = applyServerRenderedHtml(baseHtml, "unknown-folder", "home.html", content);
    expect(out).toBe(baseHtml);
  });
});

describe("applyServerRenderedHtml – it-services services page", () => {
  const content = {
    ...minimalContent,
    services_detailed: {
      page_title: "Our IT Services",
      intro: "We handle it all.",
      services: [
        {
          id: "security",
          title: "Security",
          full_description: "Zero-trust architecture.",
          features: ["Firewall", "Zero-trust"],
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      section_title: "READY?",
      section_description: "Reach out",
      phone: "604-800-5781",
      email: "hello@vbt.ca",
      form: { title: "Contact Us", fields: [], submit_button: "Send" },
      ctas: [],
      trust_badges: [],
      recaptcha: {},
    },
  };

  it("injects page title via textById", () => {
    const out = applyServerRenderedHtml(baseHtml, "it-services", "services.html", content);
    expect(out).toContain("Our IT Services");
  });

  it("injects services detailed content", () => {
    const out = applyServerRenderedHtml(servicesPageHtml, "it-services", "services.html", content);
    expect(out).toContain("Zero-trust architecture.");
  });
});

describe("applyServerRenderedHtml – HTML injection safety", () => {
  it("escapes text content via textById to prevent XSS", () => {
    const content = {
      ...minimalContent,
      services_detailed: {
        page_title: "<script>alert('xss')</script>",
        intro: "Safe intro.",
        services: [],
      },
      contact: {
        eyebrow: "Contact",
        section_title: "Ready?",
        section_description: "Reach out",
        phone: "604-800-5781",
        email: "hello@vbt.ca",
        form: { title: "Contact Us", fields: [], submit_button: "Send" },
        ctas: [],
        trust_badges: [],
        recaptcha: {},
      },
    };
    const out = applyServerRenderedHtml(baseHtml, "it-services", "services.html", content);
    expect(out).not.toContain("<script>alert('xss')</script>");
    expect(out).toContain("&lt;script&gt;");
  });
});
