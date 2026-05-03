import { describe, it, expect } from "vitest";
import { buildAiAndAutomationPage } from "./ai-and-automation.js";

const mockNav = {
  home_href: "/ai-and-automation/",
  logo: "Very Boring Technologies",
  branches: [{ href: "/ai-and-automation/", name: "AI & Automation", active: true }],
  links: [{ href: "#services", text: "Services" }],
  cta: { href: "#contact", text: "Get Started" },
};

const mockFooter = {
  brand: { name: "Very Boring Technologies", tagline: "Reliable.", linkedin: "#" },
  sections: [],
  copyright: "© 2025 VBT",
  legal_links: [],
};

const mockContact = {
  eyebrow: "Contact",
  section_title: "Ready to automate?",
  section_description: "Reach out.",
  phone: "604-800-5781",
  email: "hello@vbt.ca",
  form: { title: "Contact", fields: [], submit_button: "Send" },
  ctas: [],
  trust_badges: [],
  recaptcha: {},
  worker_url: "",
};

describe("buildAiAndAutomationPage – index page", () => {
  const content = {
    navigation: mockNav,
    footer: mockFooter,
    contact: mockContact,
    hero: {
      eyebrow: "AI & Automation",
      headline_plain: "Make Work",
      headline_gradient: "Boring Again",
      subheadline: "Automate repetitive tasks.",
      ctas: [{ href: "#contact", text: "Book a Call", variant: "primary" }],
    },
    services: {
      eyebrow: "Services",
      section_title: "What We Build",
      section_description: "Desc",
      it_services_callout: { text: "Also:", link_href: "#", link_text: "IT Services" },
      items: [
        { id: "voice", icon: "mic", color: "purple", title: "Voice Agents", description: "AI-powered." },
      ],
    },
    process: {
      eyebrow: "Process",
      section_title: "How It Works",
      section_description: "Desc",
      steps: [{ number: "01", icon: "search", color: "green", title: "Discover", description: "We learn your workflow." }],
    },
    "launch-partner": {
      badge: "Limited Spots",
      section_title: "Launch Partner",
      headline: "Get a FREE proof of concept",
      what_you_get: { title: "What You Get", items: ["Free PoC"] },
      what_we_need: { title: "What We Need", items: ["Your time"] },
      looking_for: { title: "We Are Looking For", items: ["SMBs"] },
      cta_headline: "Apply today",
      ctas: [{ href: "#contact", text: "Apply", variant: "primary" }],
    },
    pricing: {
      eyebrow: "Pricing",
      section_title: "Simple Pricing",
      section_description: "Desc",
      it_services: { description: "IT services available too.", link_href: "#", link_text: "See IT pricing" },
      automation: {
        title: "AI & Automation",
        subtitle: "Project-based pricing",
        columns: ["Feature", "Launch Partner", "Standard"],
        rows: [{ feature: "PoC", launch_partner: true, standard: "$5k+" }],
      },
      cta_headline: "Ready to start?",
      ctas: [{ href: "#contact", text: "Book a Call", variant: "primary" }],
    },
    metrics: {
      items: [
        { value: "10+", label: "Projects Delivered" },
        { value: "100%", label: "Client Satisfaction" },
      ],
    },
    testimonials: {
      eyebrow: "Testimonials",
      section_title: "What Clients Say",
      items: [{ quote: "Great!", author: "Jane Doe", title: "CEO", initials: "JD" }],
    },
  };

  it("returns htmlById with all expected section IDs for index page", () => {
    const page = buildAiAndAutomationPage("index.html", content);
    expect(page).not.toBeNull();
    expect(page.htmlById).toHaveProperty("hero");
    expect(page.htmlById).toHaveProperty("services");
    expect(page.htmlById).toHaveProperty("process");
    expect(page.htmlById).toHaveProperty("launch-partner");
    expect(page.htmlById).toHaveProperty("pricing");
    expect(page.htmlById).toHaveProperty("metrics");
    expect(page.htmlById).toHaveProperty("testimonials");
    expect(page.htmlById).toHaveProperty("contact");
    expect(page.htmlById).toHaveProperty("footer");
    expect(page.htmlById).toHaveProperty("nav-content");
  });

  it("hero HTML contains the headline", () => {
    const page = buildAiAndAutomationPage("index.html", content);
    expect(page.htmlById.hero).toContain("Make Work");
    expect(page.htmlById.hero).toContain("Boring Again");
  });

  it("services HTML contains service items", () => {
    const page = buildAiAndAutomationPage("index.html", content);
    expect(page.htmlById.services).toContain("Voice Agents");
  });

  it("metrics HTML contains metric values", () => {
    const page = buildAiAndAutomationPage("index.html", content);
    expect(page.htmlById.metrics).toContain("10+");
    expect(page.htmlById.metrics).toContain("Projects Delivered");
  });

  it("escapes XSS in hero headline", () => {
    const xssContent = {
      ...content,
      hero: {
        eyebrow: "AI",
        headline_plain: '<img src=x onerror="alert(1)">',
        headline_gradient: "Boring",
        subheadline: "Safe",
        ctas: [],
      },
    };
    const page = buildAiAndAutomationPage("index.html", xssContent);
    // The raw <img tag must not appear — it should be escaped to &lt;img
    expect(page.htmlById.hero).not.toContain("<img");
    expect(page.htmlById.hero).toContain("&lt;img");
  });
});

describe("buildAiAndAutomationPage – services subpage", () => {
  const content = {
    navigation: mockNav,
    footer: mockFooter,
    contact: mockContact,
    services_detailed: {
      page_title: "Our AI Services",
      intro: "We build intelligent solutions.",
      services: [
        {
          id: "voice-agents",
          icon: "mic",
          title: "Voice Agents",
          full_description: "AI-powered phone agents.",
          features: ["24/7 availability", "Custom scripts"],
        },
      ],
    },
  };

  it("returns correct textById for the services page", () => {
    const page = buildAiAndAutomationPage("services.html", content);
    expect(page.textById["page-title"]).toBe("Our AI Services");
    expect(page.textById["page-intro"]).toBe("We build intelligent solutions.");
  });

  it("renders services_detailed HTML", () => {
    const page = buildAiAndAutomationPage("services.html", content);
    expect(page.htmlById["services-detailed"]).toContain("Voice Agents");
    expect(page.htmlById["services-detailed"]).toContain("AI-powered phone agents.");
  });
});

describe("buildAiAndAutomationPage – pricing subpage", () => {
  const content = {
    navigation: mockNav,
    footer: mockFooter,
    contact: mockContact,
    pricing_detailed: {
      page_title: "AI Pricing",
      intro: "Transparent project costs.",
      comparison: {
        title: "Compare Options",
        columns: ["Feature", "Launch Partner", "Standard"],
        rows: [{ feature: "PoC", launch_partner: "Free", standard: "$5k+" }],
        footnote: "All prices in CAD.",
      },
      faqs: [{ question: "How long does a project take?", answer: "Typically 4-8 weeks." }],
    },
  };

  it("returns correct textById for the pricing page", () => {
    const page = buildAiAndAutomationPage("pricing.html", content);
    expect(page.textById["page-title"]).toBe("AI Pricing");
  });

  it("renders FAQ content", () => {
    const page = buildAiAndAutomationPage("pricing.html", content);
    expect(page.htmlById["pricing-faq"]).toContain("How long does a project take?");
  });
});
