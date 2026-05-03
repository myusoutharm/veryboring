import { describe, it, expect } from "vitest";
import { buildItServicesPage } from "./it-services.js";

const mockNav = {
  home_href: "/it-services/",
  logo: "Very Boring Technologies",
  branches: [{ href: "/it-services/", name: "IT Services", active: true }],
  links: [{ href: "#services", text: "Services" }],
  cta: { href: "#contact", text: "Get Started" },
};

const mockFooter = {
  brand: { name: "Very Boring Technologies", tagline: "Reliable." },
  sections: [],
  copyright: "© 2025 VBT",
  legal_links: [],
};

describe("buildItServicesPage – index page", () => {
  const content = {
    navigation: mockNav,
    footer: mockFooter,
    hero: {
      slides: [
        {
          headline: "Managed IT Services",
          subheadline: "Security-first",
          visual_id: "security",
          ctas: [{ href: "#contact", text: "Get Started", variant: "primary" }],
        },
      ],
    },
    services: {
      section_title: "Our Services",
      section_description: "Desc",
      items: [
        { title: "Security", description: "Zero-trust", link: "/services.html" },
      ],
    },
    "why-us": { section_title: "Why Us", section_description: "Desc", items: [] },
    pricing: {
      section_title: "Pricing",
      section_description: "Flat-rate",
      column_labels: { type: "Type", rate: "Rate" },
      tiers: [{ name: "Essential", price: "$500" }],
      footnote: "No hidden fees.",
    },
    testimonials: {
      section_title: "What Clients Say",
      items: [{ quote: "Great service!", author: "Jane Doe", title: "CEO", initials: "JD" }],
    },
    contact: {
      eyebrow: "Contact",
      section_title: "Ready to switch?",
      section_description: "Reach out.",
      phone: "604-800-5781",
      email: "hello@vbt.ca",
      form: {
        title: "Contact Form",
        fields: [{ type: "text", name: "name", label: "Name", placeholder: "Your name", required: true }],
        submit_button: "Send",
      },
      ctas: [],
      trust_badges: [],
      recaptcha: {},
    },
  };

  it("returns htmlById with all expected section IDs", () => {
    const page = buildItServicesPage("index.html", content);
    expect(page).not.toBeNull();
    expect(page.htmlById).toHaveProperty("hero");
    expect(page.htmlById).toHaveProperty("services");
    expect(page.htmlById).toHaveProperty("why-us");
    expect(page.htmlById).toHaveProperty("pricing");
    expect(page.htmlById).toHaveProperty("testimonials");
    expect(page.htmlById).toHaveProperty("contact");
    expect(page.htmlById).toHaveProperty("footer");
    expect(page.htmlById).toHaveProperty("nav-content");
    expect(page.htmlById).toHaveProperty("top-bar");
  });

  it("hero HTML contains the slide headline", () => {
    const page = buildItServicesPage("index.html", content);
    expect(page.htmlById.hero).toContain("Managed IT Services");
  });

  it("services HTML contains service title", () => {
    const page = buildItServicesPage("index.html", content);
    expect(page.htmlById.services).toContain("Our Services");
    expect(page.htmlById.services).toContain("Security");
  });

  it("nav HTML contains nav links", () => {
    const page = buildItServicesPage("index.html", content);
    expect(page.htmlById["nav-content"]).toContain("Services");
    expect(page.htmlById["nav-content"]).toContain("Get Started");
  });

  it("escapes special characters in hero headline", () => {
    const xssContent = {
      ...content,
      hero: {
        slides: [
          {
            headline: '<script>alert("XSS")</script>',
            subheadline: "",
            visual_id: "security",
            ctas: [],
          },
        ],
      },
    };
    const page = buildItServicesPage("index.html", xssContent);
    expect(page.htmlById.hero).not.toContain("<script>");
    expect(page.htmlById.hero).toContain("&lt;script&gt;");
  });
});

describe("buildItServicesPage – services subpage", () => {
  const content = {
    navigation: mockNav,
    footer: mockFooter,
    services_detailed: {
      page_title: "Our IT Services",
      intro: "We cover everything.",
      services: [
        {
          id: "security",
          title: "Security Hardening",
          full_description: "Enterprise-grade security.",
          features: ["Firewall", "MFA", "Zero-trust"],
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      section_title: "Ready?",
      section_description: "Reach out.",
      phone: "604-800-5781",
      email: "hello@vbt.ca",
      form: { title: "Contact", fields: [], submit_button: "Send" },
      ctas: [],
      trust_badges: [],
      recaptcha: {},
    },
  };

  it("returns textById with page-title and page-intro", () => {
    const page = buildItServicesPage("services.html", content);
    expect(page.textById["page-title"]).toBe("Our IT Services");
    expect(page.textById["page-intro"]).toBe("We cover everything.");
  });

  it("injects services_detailed HTML", () => {
    const page = buildItServicesPage("services.html", content);
    expect(page.htmlById["services-detailed"]).toContain("Security Hardening");
  });
});

describe("buildItServicesPage – pricing subpage", () => {
  const content = {
    navigation: mockNav,
    footer: mockFooter,
    pricing_detailed: {
      page_title: "Pricing Plans",
      intro: "Flat-rate pricing.",
      footnote: "Prices in CAD.",
      plans: [
        {
          name: "Essential",
          price: "$500",
          term: "/mo",
          description: "For small teams.",
          features: ["Support", "Monitoring"],
          best_for: "SMBs",
        },
      ],
      common_features: [{ title: "24/7 Support", desc: "Always available." }],
    },
  };

  it("returns correct textById for pricing page", () => {
    const page = buildItServicesPage("pricing.html", content);
    expect(page.textById["page-title"]).toBe("Pricing Plans");
    expect(page.textById["pricing-footnote"]).toBe("Prices in CAD.");
  });

  it("renders pricing plans HTML", () => {
    const page = buildItServicesPage("pricing.html", content);
    expect(page.htmlById["pricing-plans"]).toContain("Essential");
    expect(page.htmlById["pricing-plans"]).toContain("$500");
  });
});

describe("buildItServicesPage – unknown page", () => {
  it("returns null for an unknown file", () => {
    const page = buildItServicesPage("unknown.html", { navigation: mockNav, footer: mockFooter });
    expect(page).toBeNull();
  });
});
