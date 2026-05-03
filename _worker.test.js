import { describe, expect, it } from "vitest";
import { serializeContentForScript } from "./_worker.js";

describe("serializeContentForScript", () => {
  it("escapes characters that can break out of the content script", () => {
    const serialized = serializeContentForScript({
      hero: { headline: '</script><img src=x onerror="alert(1)">&' },
    });

    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<img");
    expect(serialized).toContain("\\u003C/script\\u003E");
    expect(JSON.parse(serialized).hero.headline).toBe('</script><img src=x onerror="alert(1)">&');
  });
});
