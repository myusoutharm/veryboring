// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ai-and-automation landing runtime", () => {
  beforeEach(() => {
    vi.resetModules();
    document.documentElement.style.removeProperty("--loop");
    document.body.innerHTML = `<div class="items" id="items" aria-hidden="true"></div>`;
    delete window.AIAutomation;
  });

  it("renders default items and exposes runtime helpers", async () => {
    await import("./index.js?landing-runtime-test");

    expect(window.AIAutomation).toBeTruthy();
    expect(window.AIAutomation.TWEAK_DEFAULTS.items.length).toBeGreaterThan(0);

    const root = document.getElementById("items");
    expect(root).toBeTruthy();
    expect(root.children.length).toBe(window.AIAutomation.TWEAK_DEFAULTS.items.length);
    expect(document.documentElement.style.getPropertyValue("--loop")).toBe("10s");
  });
});

