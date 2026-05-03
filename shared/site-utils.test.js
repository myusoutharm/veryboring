// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  normalizeRecaptchaConfig,
  createRecaptchaManager,
  loadAndRenderPage,
  showFormMessage,
  getHubspotCookie,
  getHubspotFields,
  submitContactForm,
} from "./site-utils.js";

const DEFAULT_KEY = "6LcOWfEqAAAAAMBlevn_BldjtPx9QGPg6pXWKIQI";

// ── normalizeRecaptchaConfig ──────────────────────────────────────────────────

describe("normalizeRecaptchaConfig", () => {
  it("returns defaults when called with no arguments", () => {
    const cfg = normalizeRecaptchaConfig();
    expect(cfg.siteKey).toBe(DEFAULT_KEY);
    expect(cfg.mode).toBe("v3");
  });

  it("returns defaults when called with an empty object", () => {
    const cfg = normalizeRecaptchaConfig({});
    expect(cfg.siteKey).toBe(DEFAULT_KEY);
    expect(cfg.mode).toBe("v3");
  });

  it("uses a custom site key when provided", () => {
    const cfg = normalizeRecaptchaConfig({ site_key: "my-custom-key" });
    expect(cfg.siteKey).toBe("my-custom-key");
  });

  it("normalizes mode to lowercase", () => {
    const cfg = normalizeRecaptchaConfig({ mode: "V3" });
    expect(cfg.mode).toBe("v3");
  });

  it("supports non-v3 modes (v2)", () => {
    const cfg = normalizeRecaptchaConfig({ mode: "v2" });
    expect(cfg.mode).toBe("v2");
  });

  it("trims whitespace from site_key", () => {
    const cfg = normalizeRecaptchaConfig({ site_key: "  trimmed-key  " });
    expect(cfg.siteKey).toBe("trimmed-key");
  });

  it("falls back to default key when site_key is empty string", () => {
    const cfg = normalizeRecaptchaConfig({ site_key: "" });
    expect(cfg.siteKey).toBe(DEFAULT_KEY);
  });
});

// ── createRecaptchaManager ────────────────────────────────────────────────────

describe("createRecaptchaManager", () => {
  it("returns an object with init, getToken, and getState methods", () => {
    const manager = createRecaptchaManager();
    expect(typeof manager.init).toBe("function");
    expect(typeof manager.getToken).toBe("function");
    expect(typeof manager.getState).toBe("function");
  });

  it("initial state uses the default site key and v3 mode", () => {
    const manager = createRecaptchaManager();
    const state = manager.getState();
    expect(state.siteKey).toBe(DEFAULT_KEY);
    expect(state.mode).toBe("v3");
    expect(state.initError).toBe("");
  });

  it("getToken throws for unsupported modes", async () => {
    vi.useFakeTimers();
    const manager = createRecaptchaManager();
    // init sets state.mode synchronously before hitting the first await (loadRecaptchaApi)
    const initPromise = manager.init({ mode: "v2", siteKey: "test-key" });
    // Advance all fake timers so loadRecaptchaApi's 10s timeout fires and rejects
    await vi.runAllTimersAsync();
    await initPromise.catch(() => {});
    vi.useRealTimers();

    await expect(manager.getToken()).rejects.toThrow("Unsupported reCAPTCHA mode: v2");
  });

  it("each call to createRecaptchaManager returns an independent manager", () => {
    const m1 = createRecaptchaManager();
    const m2 = createRecaptchaManager();
    // They should be independent objects
    expect(m1).not.toBe(m2);
    expect(m1.getState()).not.toBe(m2.getState());
  });
});

// ── showFormMessage ────────────────────────────────────────────────────────────

describe("showFormMessage", () => {
  beforeEach(() => {
    // jsdom does not implement scrollIntoView — stub it so tests don't throw
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("does nothing when element is null", () => {
    expect(() => showFormMessage(null, "success", "Done!")).not.toThrow();
  });

  it("sets the element text, class, and display", () => {
    const el = document.createElement("div");
    el.style.display = "none";
    showFormMessage(el, "success", "Form submitted!");
    expect(el.textContent).toBe("Form submitted!");
    expect(el.className).toBe("form-message form-message--success");
    expect(el.style.display).toBe("block");
  });

  it("supports error type", () => {
    const el = document.createElement("div");
    showFormMessage(el, "error", "Something went wrong.");
    expect(el.className).toContain("form-message--error");
    expect(el.textContent).toBe("Something went wrong.");
  });
});

// ── getHubspotCookie ──────────────────────────────────────────────────────────

describe("getHubspotCookie", () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  });

  it("returns undefined when hubspotutk cookie is absent", () => {
    expect(getHubspotCookie()).toBeUndefined();
  });

  it("returns the hubspotutk value when cookie is present", () => {
    document.cookie = "hubspotutk=abc123xyz";
    expect(getHubspotCookie()).toBe("abc123xyz");
  });

  it("returns only the hubspotutk value when multiple cookies are set", () => {
    document.cookie = "other=value; path=/";
    document.cookie = "hubspotutk=mytoken; path=/";
    expect(getHubspotCookie()).toBe("mytoken");
  });

  it("trims the hubspotutk value", () => {
    const cookieSpy = vi.spyOn(document, "cookie", "get")
      .mockReturnValue("hubspotutk=token-with-space ; other=value");

    expect(getHubspotCookie()).toBe("token-with-space");
    cookieSpy.mockRestore();
  });
});

// ── getHubspotFields ──────────────────────────────────────────────────────────

describe("getHubspotFields", () => {
  it("returns an empty array when no data-hs fields exist", () => {
    const form = document.createElement("form");
    expect(getHubspotFields(form)).toEqual([]);
  });

  it("extracts filled data-hs fields", () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <input data-hs="firstname" value="Jane">
      <input data-hs="email" value="jane@example.com">
    `;
    const fields = getHubspotFields(form);
    expect(fields).toHaveLength(2);
    expect(fields).toContainEqual({ name: "firstname", value: "Jane" });
    expect(fields).toContainEqual({ name: "email", value: "jane@example.com" });
  });

  it("excludes fields with empty or whitespace-only values", () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <input data-hs="firstname" value="">
      <input data-hs="email" value="   ">
      <input data-hs="phone" value="604-800-5781">
    `;
    const fields = getHubspotFields(form);
    expect(fields).toHaveLength(1);
    expect(fields[0].name).toBe("phone");
  });

  it("trims whitespace from field values", () => {
    const form = document.createElement("form");
    form.innerHTML = `<input data-hs="message" value="  hello  ">`;
    const fields = getHubspotFields(form);
    expect(fields[0].value).toBe("hello");
  });

  it("works with textarea elements", () => {
    const form = document.createElement("form");
    form.innerHTML = `<textarea data-hs="message">Hello there</textarea>`;
    const fields = getHubspotFields(form);
    expect(fields).toHaveLength(1);
    expect(fields[0]).toEqual({ name: "message", value: "Hello there" });
  });
});

// ── loadAndRenderPage ─────────────────────────────────────────────────────────

describe("loadAndRenderPage", () => {
  beforeEach(() => {
    // Clear window.__CONTENT__ before each test
    delete window.__CONTENT__;
  });

  it("calls each renderer with its corresponding content", async () => {
    window.__CONTENT__ = {
      hero: { headline: "Hello" },
      footer: { copyright: "© 2025" },
    };

    const heroRenderer = vi.fn();
    const footerRenderer = vi.fn();

    await loadAndRenderPage({
      contentFiles: { hero: "content/hero.json", footer: "content/footer.json" },
      renderers: { hero: heroRenderer, footer: footerRenderer },
    });

    expect(heroRenderer).toHaveBeenCalledWith({ headline: "Hello" });
    expect(footerRenderer).toHaveBeenCalledWith({ copyright: "© 2025" });
  });

  it("calls onAfterRender with the loaded content", async () => {
    window.__CONTENT__ = { nav: { links: [] } };
    const afterRender = vi.fn();

    await loadAndRenderPage({
      contentFiles: { nav: "content/navigation.json" },
      renderers: {},
      onAfterRender: afterRender,
    });

    expect(afterRender).toHaveBeenCalledWith({ nav: { links: [] } });
  });

  it("skips non-function renderers gracefully", async () => {
    window.__CONTENT__ = { hero: {} };
    // Should not throw even if renderer is undefined
    await expect(
      loadAndRenderPage({
        contentFiles: { hero: "content/hero.json" },
        renderers: { hero: undefined },
      })
    ).resolves.not.toThrow();
  });
});

// ── submitContactForm ────────────────────────────────────────────────────────

describe("submitContactForm", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="form-message" style="display:none"></div>
      <form id="contact-form" data-worker="https://worker.example/submit">
        <input type="text" name="b_phone" value="">
        <input data-hs="email" value="">
        <button id="form-submit" type="submit">Send Message</button>
      </form>
    `;
    document.querySelector("[data-hs]").value = " jane@example.com ";
    Element.prototype.scrollIntoView = vi.fn();
    globalThis.fetch = vi.fn();
  });

  it("shows an error when the reCAPTCHA provider is missing", async () => {
    const event = { preventDefault: vi.fn(), target: document.getElementById("contact-form") };

    await submitContactForm(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.getElementById("form-message").textContent).toContain("reCAPTCHA token provider missing");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows a security error when reCAPTCHA token retrieval fails", async () => {
    const event = { preventDefault: vi.fn(), target: document.getElementById("contact-form") };

    await submitContactForm(event, {
      getRecaptchaToken: vi.fn().mockRejectedValue(new Error("offline")),
    });

    expect(document.getElementById("form-message").textContent).toContain("Security check unavailable (offline)");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("handles a missing worker URL using the configured mode and message", async () => {
    const form = document.getElementById("contact-form");
    form.dataset.worker = "";
    const event = { preventDefault: vi.fn(), target: form };

    await submitContactForm(event, {
      getRecaptchaToken: vi.fn().mockResolvedValue("token"),
      missingWorkerMode: "success",
      missingWorkerMessage: "Queued locally.",
    });

    const msg = document.getElementById("form-message");
    expect(msg.className).toContain("form-message--success");
    expect(msg.textContent).toBe("Queued locally.");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows the server error message from a non-ok response", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: "Rejected by server." }),
    });
    const event = { preventDefault: vi.fn(), target: document.getElementById("contact-form") };

    await submitContactForm(event, {
      getRecaptchaToken: vi.fn().mockResolvedValue("token"),
    });

    expect(fetch).toHaveBeenCalledWith("https://worker.example/submit", expect.objectContaining({ method: "POST" }));
    expect(document.getElementById("form-message").textContent).toBe("Rejected by server.");
  });

  it("shows a network error when fetch rejects", async () => {
    fetch.mockRejectedValue(new Error("network down"));
    const event = { preventDefault: vi.fn(), target: document.getElementById("contact-form") };

    await submitContactForm(event, {
      getRecaptchaToken: vi.fn().mockResolvedValue("token"),
    });

    expect(document.getElementById("form-message").textContent).toContain("Network error");
  });

  it("posts HubSpot fields and resets the form on success", async () => {
    fetch.mockResolvedValue({ ok: true });
    const form = document.getElementById("contact-form");
    const event = { preventDefault: vi.fn(), target: form };

    await submitContactForm(event, {
      getRecaptchaToken: vi.fn().mockResolvedValue("token"),
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://worker.example/submit",
      expect.objectContaining({
        body: expect.stringContaining('"token":"token"'),
      })
    );
    expect(document.getElementById("form-message").className).toContain("form-message--success");
    expect(form.querySelector("[data-hs]").value).toBe("");
  });
});
