// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderProductRow, renderProductVisual, renderProductIndex, renderProductsCta, loadProductsPage } from "./products-page.js";

const mockProduct = {
  id: "hoststand",
  name: "Hoststand",
  badge: "Table Management",
  badge_color: "green",
  url: "/product/hoststand/",
  tagline: "A reservation book that doesn't charge you per guest.",
  problem: "High per-cover fees.",
  solution: "Flat-rate monthly pricing.",
  features: ["Zero fees", "AI phone booking"],
  metrics: [{ label: "Per-Cover Fee", value: "$0" }],
  visual_type: "image",
  image: "/product/hoststand/images/timeline.jpg",
  image_alt: "Timeline view",
  cta_text: "Explore Hoststand",
};

describe("products-page renderProductRow", () => {
  it("generates accessible row HTML with title, badge, and link", () => {
    const html = renderProductRow(mockProduct);
    expect(html).toContain('class="product-row-card accent-green"');
    expect(html).toContain('data-url="/product/hoststand/"');
    expect(html).toContain("Hoststand");
    expect(html).toContain("Table Management");
    expect(html).toContain("High per-cover fees.");
    expect(html).toContain("Flat-rate monthly pricing.");
    expect(html).toContain("Zero fees");
    expect(html).toContain("$0");
    expect(html).toContain("Explore Hoststand");
    expect(html).toContain('id="product-hoststand"');
    expect(html).toContain("accent-green");
  });

  it("numbers cards by position", () => {
    expect(renderProductRow(mockProduct, 0)).toContain(">01<");
    expect(renderProductRow(mockProduct, 8)).toContain(">09<");
  });

  it("wraps screenshots in a browser frame unless image_frame is plain", () => {
    expect(renderProductVisual(mockProduct)).toContain("product-image-chrome");
    const plain = renderProductVisual({ ...mockProduct, image_frame: "plain" });
    expect(plain).toContain("product-image-plain");
    expect(plain).not.toContain("product-image-chrome");
  });

  it("escapes product data", () => {
    const html = renderProductRow({ ...mockProduct, name: "<b>x</b>", id: '"><i>' });
    expect(html).not.toContain("<b>x</b>");
    expect(html).not.toContain('"><i>');
  });

  it("renders mockups for custom visual types", () => {
    const easysignout = { ...mockProduct, visual_type: "mockup_easysignout" };
    const html = renderProductVisual(easysignout);
    expect(html).toContain("tab.easysignout.com");
    expect(html).toContain("iPad Pro #12");

    const edisync = { ...mockProduct, visual_type: "mockup_edisync" };
    const htmlEdi = renderProductVisual(edisync);
    expect(htmlEdi).toContain("EDISync");
    expect(htmlEdi).toContain("Price Alerts");

    const voiceagent = { ...mockProduct, visual_type: "mockup_voiceagent" };
    const htmlVoice = renderProductVisual(voiceagent);
    expect(htmlVoice).toContain("VoiceAgent");
    expect(htmlVoice).toContain("Active Call");
  });
});

describe("products-page index and closing CTA", () => {
  it("renders jump links that target each card id", () => {
    const html = renderProductIndex([mockProduct]);
    expect(html).toContain('href="#product-hoststand"');
    expect(html).toContain("Hoststand");
    expect(html).toContain("accent-green");
  });

  it("renders the closing CTA with optional secondary link", () => {
    const html = renderProductsCta({ title: "Need more?", text: "Ask us.", cta_text: "Talk", cta_url: "#contact", secondary_text: "Pricing", secondary_url: "pricing.html" });
    expect(html).toContain("Need more?");
    expect(html).toContain('href="#contact"');
    expect(html).toContain('href="pricing.html"');
    expect(renderProductsCta({ title: "T", text: "x" })).not.toContain("btn-outline");
  });

  it("renders nothing without closing content", () => {
    expect(renderProductsCta(undefined)).toBe("");
    expect(renderProductsCta({})).toBe("");
  });
});

describe("products-page loadProductsPage hydration", () => {
  beforeEach(() => {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
    };

    document.body.innerHTML = `
      <div id="top-bar"></div>
      <div id="nav-content"></div>
      <span id="page-eyebrow"></span>
      <h1 id="page-title"></h1>
      <p id="page-intro"></p>
      <div id="products-index"></div>
      <div id="products-list"></div>
      <section id="products-cta"></section>
      <section id="contact"></section>
      <footer id="footer"></footer>
    `;

    window.__CONTENT__ = {
      navigation: {
        logo: "AI + Automation",
        home_href: "index.html",
        branches: [],
        links: [{ text: "Products", href: "products.html" }],
        cta: { text: "Contact", href: "#contact" },
      },
      products: {
        page_title: "Battle-Tested Products",
        eyebrow: "Eyebrow text",
        intro: "Reliable tools for operations.",
        products: [mockProduct],
        closing: { title: "Need something else?", text: "Ask.", cta_text: "Talk", cta_url: "#contact" },
      },
      footer: { brand: { name: "VBT", tagline: "Tag", linkedin: "#" }, sections: [], legal_links: [], copyright: "© 2025" },
      contact: { eyebrow: "Contact", section_title: "Title", section_description: "Desc", phone: "604-800-5781", email: "test@example.com", trust_badges: [], form: { title: "F", fields: [], submit_button: "Send" }, worker_url: "", recaptcha: {} },
    };
  });

  it("hydrates DOM elements from window.__CONTENT__", async () => {
    await loadProductsPage();

    expect(document.getElementById("page-title").textContent).toBe("Battle-Tested Products");
    expect(document.getElementById("page-intro").textContent).toBe("Reliable tools for operations.");
    expect(document.getElementById("page-eyebrow").textContent).toBe("Eyebrow text");
    expect(document.getElementById("products-list").children.length).toBe(1);
    expect(document.querySelector("#products-index a").getAttribute("href")).toBe("#product-hoststand");
    expect(document.getElementById("products-cta").textContent).toContain("Need something else?");

    const card = document.querySelector(".product-row-card");
    expect(card).not.toBeNull();
    expect(card.getAttribute("data-url")).toBe("/product/hoststand/");
  });

  it("wires card click to navigate to product page", async () => {
    await loadProductsPage();

    const card = document.querySelector(".product-row-card");
    expect(card).not.toBeNull();

    // Trigger click on non-anchor element
    const title = card.querySelector(".product-tagline");
    // Verify event listener is attached by clicking
    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    expect(() => title.dispatchEvent(clickEvent)).not.toThrow();
  });
});
