export function getContentKeys(folder, file) {
  if (folder === "it-services") {
    if (file === "index.html" || file === "") {
      return ["navigation", "hero", "services", "why-us", "pricing", "testimonials", "contact", "footer"];
    }
    if (file === "services.html") {
      return ["navigation", "services_detailed", "contact", "footer"];
    }
    if (file === "pricing.html") {
      return ["navigation", "pricing", "pricing_detailed", "footer"];
    }
    if (file === "why-us.html") {
      return ["navigation", "why-us", "why_us_detailed", "contact", "footer"];
    }
    return ["navigation", "footer"];
  }

  if (folder === "ai-and-automation") {
    return ["navigation", "hero", "services", "process", "launch-partner", "pricing", "metrics", "testimonials", "contact", "footer"];
  }

  return [];
}
