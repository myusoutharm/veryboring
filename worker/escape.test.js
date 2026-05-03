import { describe, it, expect } from "vitest";
import { escAttr, escHtml, escXml } from "./escape.js";

describe("escHtml", () => {
  it("escapes ampersand", () => {
    expect(escHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes less-than sign", () => {
    expect(escHtml("<div>")).toBe("&lt;div&gt;");
  });

  it("escapes greater-than sign", () => {
    expect(escHtml("a > b")).toBe("a &gt; b");
  });

  it("escapes multiple special characters", () => {
    expect(escHtml("<script>alert('XSS')</script>")).toBe(
      "&lt;script&gt;alert('XSS')&lt;/script&gt;"
    );
  });

  it("returns empty string for falsy input", () => {
    expect(escHtml("")).toBe("");
    expect(escHtml(null)).toBe("");
    expect(escHtml(undefined)).toBe("");
    // 0 is falsy so `0 || ""` evaluates to "" in the implementation
    expect(escHtml(0)).toBe("");
  });

  it("leaves safe characters unchanged", () => {
    expect(escHtml("hello world 123")).toBe("hello world 123");
  });
});

describe("escAttr", () => {
  it("escapes double quotes in addition to html characters", () => {
    expect(escAttr('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("escapes all html characters plus quotes", () => {
    expect(escAttr('<a href="url">link</a>')).toBe(
      "&lt;a href=&quot;url&quot;&gt;link&lt;/a&gt;"
    );
  });

  it("returns empty string for falsy input", () => {
    expect(escAttr("")).toBe("");
    expect(escAttr(null)).toBe("");
  });
});

describe("escXml", () => {
  it("escapes single quotes (in addition to html chars and double quotes)", () => {
    expect(escXml("it's")).toBe("it&apos;s");
  });

  it("escapes double quotes", () => {
    expect(escXml('"quoted"')).toBe("&quot;quoted&quot;");
  });

  it("escapes all five XML special characters", () => {
    // Each of the five special characters in isolation
    expect(escXml("<>&\"'")).toBe("&lt;&gt;&amp;&quot;&apos;");
  });

  it("returns empty string for falsy input", () => {
    expect(escXml("")).toBe("");
    expect(escXml(null)).toBe("");
  });
});
