import { describe, it, expect } from "vitest";
import { getContentKeys } from "./content-map.js";

describe("getContentKeys – it-services", () => {
  it("returns full key set for index page", () => {
    const keys = getContentKeys("it-services", "index.html");
    expect(keys).toEqual([
      "navigation",
      "hero",
      "services",
      "why-us",
      "pricing",
      "testimonials",
      "contact",
      "footer",
    ]);
  });

  it("treats empty file string as index page", () => {
    expect(getContentKeys("it-services", "")).toEqual(
      getContentKeys("it-services", "index.html")
    );
  });

  it("returns correct keys for services.html", () => {
    expect(getContentKeys("it-services", "services.html")).toEqual([
      "navigation",
      "services_detailed",
      "contact",
      "footer",
    ]);
  });

  it("returns correct keys for pricing.html", () => {
    expect(getContentKeys("it-services", "pricing.html")).toEqual([
      "navigation",
      "pricing",
      "pricing_detailed",
      "footer",
    ]);
  });

  it("returns correct keys for why-us.html", () => {
    expect(getContentKeys("it-services", "why-us.html")).toEqual([
      "navigation",
      "why-us",
      "why_us_detailed",
      "contact",
      "footer",
    ]);
  });

  it("returns fallback keys for unknown pages", () => {
    expect(getContentKeys("it-services", "unknown.html")).toEqual([
      "navigation",
      "footer",
    ]);
  });
});

describe("getContentKeys – ai-and-automation", () => {
  it("returns empty key set for index page (static landing page)", () => {
    const keys = getContentKeys("ai-and-automation", "index.html");
    expect(keys).toEqual([]);
  });

  it("returns full key set for home page", () => {
    const keys = getContentKeys("ai-and-automation", "home.html");
    expect(keys).toEqual([
      "navigation",
      "hero",
      "services",
      "process",
      "launch-partner",
      "pricing",
      "metrics",
      "testimonials",
      "contact",
      "footer",
    ]);
  });

  it("returns correct keys for services.html", () => {
    expect(getContentKeys("ai-and-automation", "services.html")).toEqual([
      "navigation",
      "services_detailed",
      "contact",
      "footer",
    ]);
  });

  it("returns correct keys for pricing.html", () => {
    expect(getContentKeys("ai-and-automation", "pricing.html")).toEqual([
      "navigation",
      "pricing_detailed",
      "contact",
      "footer",
    ]);
  });
});

describe("getContentKeys – unknown folder", () => {
  it("returns empty array for unknown folder", () => {
    expect(getContentKeys("unknown-folder", "index.html")).toEqual([]);
  });
});
