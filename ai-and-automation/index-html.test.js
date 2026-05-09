import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("ai-and-automation index.html script loading", () => {
  it("loads tweaks stack only for localhost-style hosts", () => {
    const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

    expect(html).toContain('<script src="index.js"></script>');
    expect(html).toContain("loadLocalTweaksOnly");
    expect(html).toContain('host === "localhost"');
    expect(html).toContain('host === "127.0.0.1"');
    expect(html).toContain('host === "::1"');

    expect(html).toContain('loadScript("lib/react.development.js")');
    expect(html).toContain('loadScript("lib/react-dom.development.js")');
    expect(html).toContain('loadScript("lib/babel.min.js")');
    expect(html).toContain('loadScript("tweaks-panel.jsx", "text/babel")');
    expect(html).toContain('loadScript("index-editor.jsx", "text/babel")');

    expect(html).not.toContain('<script src="lib/react.development.js"></script>');
    expect(html).not.toContain('<script src="lib/react-dom.development.js"></script>');
    expect(html).not.toContain('<script src="lib/babel.min.js"></script>');
    expect(html).not.toContain('<script type="text/babel" src="tweaks-panel.jsx"></script>');
    expect(html).not.toContain('<script type="text/babel" src="index-editor.jsx"></script>');
  });
});

