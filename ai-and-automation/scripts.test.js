// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

function installBrowserStubs() {
  window.grecaptcha = { execute: vi.fn() };
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
  };
}

function setAiPageDom() {
  document.body.innerHTML = `
    <div id="top-bar"></div>
    <div id="nav-content"></div>
    <section id="hero"></section>
    <section id="services"></section>
    <section id="process"></section>
    <section id="launch-partner"></section>
    <section id="pricing"></section>
    <section id="metrics"></section>
    <section id="testimonials"></section>
    <section id="contact"></section>
    <footer id="footer"></footer>
  `;
}

function setAiContent(value) {
  window.__CONTENT__ = {
    navigation: { branches: [], home_href: "index.html", logo: value, links: [], cta: { href: "#contact", text: "Contact" } },
    hero: { eyebrow: value, headline_plain: value, headline_gradient: value, subheadline: value, ctas: [] },
    services: {
      eyebrow: value,
      section_title: value,
      section_description: value,
      items: [{ id: "voice", icon: "mic", color: "purple", title: value, description: value }],
      it_services_callout: { text: value, link_href: "/it-services/", link_text: value },
    },
    process: { eyebrow: value, section_title: value, section_description: value, steps: [{ number: "01", icon: "search", color: "green", title: value, description: value }] },
    "launch-partner": {
      badge: value,
      section_title: value,
      headline: value,
      what_you_get: { title: value, items: [value] },
      what_we_need: { title: value, items: [value] },
      looking_for: { title: value, items: [value] },
      cta_headline: value,
      ctas: [],
    },
    pricing: {
      eyebrow: value,
      section_title: value,
      section_description: value,
      automation: { title: value, subtitle: value, columns: ["Feature", "Launch"], rows: [{ feature: value, launch: value }] },
      it_services: { description: value, link_href: "/it-services/pricing.html", link_text: value },
      cta_headline: value,
      ctas: [],
    },
    metrics: { items: [{ value, label: value }] },
    testimonials: { eyebrow: value, section_title: value, items: [{ quote: value, initials: value, author: value, title: value }] },
    contact: {
      eyebrow: value,
      section_title: value,
      section_description: value,
      phone: "604-800-5781",
      email: "hello@example.com",
      trust_badges: [value],
      form: { title: value, fields: [], submit_button: value },
      worker_url: "",
      recaptcha: {},
    },
    footer: { brand: { name: value, tagline: value, linkedin: "#" }, sections: [], legal_links: [], copyright: value },
  };
}

describe("ai-and-automation browser entry", () => {
  beforeEach(() => {
    vi.resetModules();
    setAiPageDom();
    installBrowserStubs();
    delete window.__CONTENT__;
  });

  it("hydrates window.__CONTENT__ without turning content strings into markup", async () => {
    const dangerous = '<img src=x onerror="alert(1)">';
    setAiContent(dangerous);

    await import("./scripts.js?ai-entry-test");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.querySelector('img[src="x"][onerror]')).toBeNull();
    expect(document.getElementById("hero").innerHTML).toContain("&lt;img");
    expect(document.getElementById("services").innerHTML).toContain("&lt;img");
  });
});
