// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createRecaptchaManager } from "./site-utils.js";

describe("createRecaptchaManager in node", () => {
  it("reports an unsupported DOM environment without throwing from init", async () => {
    const manager = createRecaptchaManager();

    await manager.init({ siteKey: "test-key", mode: "v3" });

    expect(manager.getState().initError).toBe("reCAPTCHA requires a browser DOM environment.");
  });
});
