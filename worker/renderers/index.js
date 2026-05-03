import { escHtml } from "../escape.js";
import { buildItServicesPage } from "./it-services.js";
import { buildAiAndAutomationPage } from "./ai-and-automation.js";

export function applyServerRenderedHtml(html, folder, file, content) {
  const page = buildServerRenderedPage(folder, file, content);
  if (!page) return html;

  let out = html;
  for (const [id, innerHtml] of Object.entries(page.htmlById || {})) {
    out = replaceElementInnerById(out, id, innerHtml);
  }
  for (const [id, textContent] of Object.entries(page.textById || {})) {
    out = replaceElementTextById(out, id, textContent);
  }
  return out;
}

function buildServerRenderedPage(folder, file, content) {
  if (folder === "it-services") {
    return buildItServicesPage(file, content);
  }

  if (folder === "ai-and-automation") {
    return buildAiAndAutomationPage(file, content);
  }

  return null;
}

function replaceElementInnerById(html, id, innerHtml) {
  const idPattern = escapeRegex(id);
  const rx = new RegExp(`(<([a-zA-Z0-9:-]+)[^>]*\\bid=["']${idPattern}["'][^>]*>)([\\s\\S]*?)(</\\2>)`, "i");
  return html.replace(rx, (match, p1, p2, p3, p4) => p1 + innerHtml + p4);
}

function replaceElementTextById(html, id, textValue) {
  return replaceElementInnerById(html, id, escHtml(textValue || ""));
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
