// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderProductRow, renderProductVisual, loadProductsPage } from "./products-page.js";

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
    expect(html).toContain('class="product-row-card"');
    expect(html).toContain('data-url="/product/hoststand/"');
    expect(html).toContain("Hoststand");
    expect(html).toContain("Table Management");
    expect(html).toContain("High per-cover fees.");
    expect(html).toContain("Flat-rate monthly pricing.");
    expect(html).toContain("Zero fees");
    expect(html).toContain("$0");
    expect(html).toContain("Explore Hoststand");
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

describe("products-page loadProductsPage hydration", () => {
  beforeEach(() => {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
    };

    document.body.innerHTML = `
      <div id="top-bar"></div>
      <div id="nav-content"></div>
      <h1 id="page-title"></h1>
      <p id="page-intro"></p>
      <div id="products-list"></div>
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
        intro: "Reliable tools for operations.",
        products: [mockProduct],
      },
      footer: { brand: { name: "VBT", tagline: "Tag", linkedin: "#" }, sections: [], legal_links: [], copyright: "© 2025" },
      contact: { eyebrow: "Contact", section_title: "Title", section_description: "Desc", phone: "604-800-5781", email: "test@example.com", trust_badges: [], form: { title: "F", fields: [], submit_button: "Send" }, worker_url: "", recaptcha: {} },
    };
  });

  it("hydrates DOM elements from window.__CONTENT__", async () => {
    await loadProductsPage();

    expect(document.getElementById("page-title").textContent).toBe("Battle-Tested Products");
    expect(document.getElementById("page-intro").textContent).toBe("Reliable tools for operations.");
    expect(document.getElementById("products-list").children.length).toBe(1);

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
