// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

function installBrowserStubs() {
  window.grecaptcha = { execute: vi.fn() };
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
  };
}

function setItPageDom() {
  document.body.innerHTML = `
    <div id="top-bar"></div>
    <div id="nav-content"></div>
    <section id="hero"></section>
    <section id="services"></section>
    <section id="why-us"></section>
    <section id="pricing"></section>
    <section id="testimonials"></section>
    <section id="contact"></section>
    <footer id="footer"></footer>
  `;
}

function setItContent(value) {
  window.__CONTENT__ = {
    navigation: { branches: [], home_href: "index.html", logo: value, links: [], cta: { href: "#contact", text: "Contact" } },
    hero: { slides: [{ headline: value, subheadline: value, ctas: [], visual_id: "security" }] },
    services: { section_title: value, section_description: value, items: [{ icon: value, title: value, description: value, link: "#service" }] },
    "why-us": { section_title: value, section_description: value, items: [{ title: value, description: value, link: "#why" }] },
    pricing: { section_title: value, section_description: value, column_labels: { type: value, rate: value }, tiers: [{ name: value, price: value }], footnote: value },
    testimonials: { section_title: value, items: [{ quote: value, author: value, title: value }] },
    contact: { section_title: value, section_description: value, ctas: [], form: { title: value, fields: [], submit_button: value }, worker_url: "", recaptcha: {} },
    footer: { brand: { name: value, description: value }, sections: [], legal_links: [], copyright: value },
  };
}

describe("it-services browser entry", () => {
  beforeEach(() => {
    vi.resetModules();
    setItPageDom();
    installBrowserStubs();
    delete window.__CONTENT__;
  });

  it("hydrates content without executing raw HTML and renders accessible hero dots", async () => {
    const dangerous = '<img src=x onerror="alert(1)">';
    setItContent(dangerous);

    await import("./scripts.js?it-entry-test");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.querySelector("img[onerror]")).toBeNull();
    expect(document.getElementById("hero").innerHTML).toContain("&lt;img");

    const dot = document.querySelector(".hero-dot");
    expect(dot.tagName).toBe("BUTTON");
    expect(dot.getAttribute("aria-label")).toBe("Show slide 1");
    expect(dot.getAttribute("aria-current")).toBe("true");
  });
});
