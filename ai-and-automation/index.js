// Each item: { label, icon (Font Awesome class, e.g. "fa-solid fa-file-invoice") }
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "loopSeconds": 10,
  "items": [
    {
      "label": "Status reports",
      "icon": "fa-solid fa-chart-line"
    },
    {
      "label": "Invoices",
      "icon": "fa-solid fa-file-invoice-dollar"
    },
    {
      "label": "Spreadsheets",
      "icon": "fa-solid fa-table-cells"
    },
    {
      "label": "Data entry",
      "icon": "fa-solid fa-keyboard"
    },
    {
      "label": "Approvals",
      "icon": "fa-solid fa-stamp"
    },
    {
      "label": "Reconciliations",
      "icon": "fa-solid fa-scale-balanced"
    },
    {
      "label": "Tickets",
      "icon": "fa-solid fa-ticket"
    },
    {
      "label": "Email triage",
      "icon": "fa-solid fa-envelope-open-text"
    },
    {
      "label": "Inventory",
      "icon": "fa-solid fa-boxes-stacked"
    },
    {
      "label": "Receipts",
      "icon": "fa-solid fa-receipt"
    }
  ]
}/*EDITMODE-END*/;

// Curated suggestions of "boring" things + matching FA icons.
const ICON_SUGGESTIONS = [
  { label: "Status reports", icon: "fa-solid fa-chart-line" },
  { label: "Invoices", icon: "fa-solid fa-file-invoice-dollar" },
  { label: "Spreadsheets", icon: "fa-solid fa-table-cells" },
  { label: "Data entry", icon: "fa-solid fa-keyboard" },
  { label: "Approvals", icon: "fa-solid fa-stamp" },
  { label: "Reconciliations", icon: "fa-solid fa-scale-balanced" },
  { label: "Tickets", icon: "fa-solid fa-ticket" },
  { label: "Email triage", icon: "fa-solid fa-envelope-open-text" },
  { label: "Meetings", icon: "fa-solid fa-calendar-days" },
  { label: "Timesheets", icon: "fa-solid fa-clock" },
  { label: "Compliance", icon: "fa-solid fa-shield-halved" },
  { label: "Receipts", icon: "fa-solid fa-receipt" },
  { label: "Forms", icon: "fa-solid fa-clipboard-list" },
  { label: "Payroll", icon: "fa-solid fa-money-check-dollar" },
  { label: "Contracts", icon: "fa-solid fa-file-signature" },
  { label: "Inventory", icon: "fa-solid fa-boxes-stacked" },
  { label: "Onboarding", icon: "fa-solid fa-user-plus" },
  { label: "Notes", icon: "fa-solid fa-note-sticky" },
  { label: "Filing", icon: "fa-solid fa-folder-open" },
  { label: "Audit logs", icon: "fa-solid fa-magnifying-glass-chart" }
];

// Heuristic: best-guess icon from a label string.
const ICON_GUESS = [
  [/report|chart|dashboard|metric|kpi/i, "fa-solid fa-chart-line"],
  [/invoice|bill/i, "fa-solid fa-file-invoice-dollar"],
  [/spreadsheet|excel|sheet|table/i, "fa-solid fa-table-cells"],
  [/data\s*entry|typing|input/i, "fa-solid fa-keyboard"],
  [/approv|sign[- ]?off|stamp/i, "fa-solid fa-stamp"],
  [/reconcil|balanc|ledger/i, "fa-solid fa-scale-balanced"],
  [/ticket|jira|issue/i, "fa-solid fa-ticket"],
  [/email|inbox|triage|mail/i, "fa-solid fa-envelope-open-text"],
  [/meeting|calendar|schedul/i, "fa-solid fa-calendar-days"],
  [/time\s*sheet|hours|clock/i, "fa-solid fa-clock"],
  [/complian|audit|polic|securit/i, "fa-solid fa-shield-halved"],
  [/receipt|expense/i, "fa-solid fa-receipt"],
  [/form|survey|questionnaire/i, "fa-solid fa-clipboard-list"],
  [/payroll|salary|pay/i, "fa-solid fa-money-check-dollar"],
  [/contract|agreement|legal|sign/i, "fa-solid fa-file-signature"],
  [/inventory|stock|warehouse/i, "fa-solid fa-boxes-stacked"],
  [/onboard|hire|hr|hr[- ]?ops/i, "fa-solid fa-user-plus"],
  [/note|memo/i, "fa-solid fa-note-sticky"],
  [/file|filing|folder|archive/i, "fa-solid fa-folder-open"],
  [/log|monitor|track/i, "fa-solid fa-magnifying-glass-chart"],
  [/budget|financ|account/i, "fa-solid fa-coins"],
  [/order|purchase|po\b/i, "fa-solid fa-cart-shopping"],
  [/database|sql|query/i, "fa-solid fa-database"],
  [/crm|customer|client/i, "fa-solid fa-address-book"],
  [/lead|sales|pipeline/i, "fa-solid fa-funnel-dollar"],
  [/copy[- ]?paste|copy/i, "fa-solid fa-copy"],
  [/sync|integration|etl/i, "fa-solid fa-arrows-rotate"],
  [/upload|import/i, "fa-solid fa-file-arrow-up"],
  [/download|export/i, "fa-solid fa-file-arrow-down"],
  [/print/i, "fa-solid fa-print"]
];
function guessIcon(label) {
  for (const [re, icon] of ICON_GUESS) if (re.test(label)) return icon;
  return "fa-solid fa-circle-dot";
}

// ── Conveyor renderer ────────────────────────────────────────────────────
const SHADES = [
  "#e1e3ed", "#d5d8e4", "#c9cddc", "#bdc2d3",
  "#e1e3ed", "#d5d8e4", "#c9cddc", "#bdc2d3",
  "#e1e3ed", "#d5d8e4", "#c9cddc", "#bdc2d3"
];

function renderItems(items, loopSeconds) {
  const root = document.getElementById('items');
  if (!root) return;
  root.style.display = '';
  const stage = document.documentElement;
  stage.style.setProperty('--loop', loopSeconds + 's');
  root.innerHTML = '';
  const n = Math.max(items.length, 1);
  const step = loopSeconds / n;
  items.forEach((it, i) => {
    const el = document.createElement('div');
    el.className = 'item';
    el.style.animationDelay = `-${(step * i).toFixed(3)}s`;
    el.style.color = SHADES[i % SHADES.length];
    el.innerHTML = `
      <div class="icon"><i class="${it.icon || 'fa-solid fa-circle-dot'}"></i></div>
      <div class="label">${escapeHtml(it.label || '')}</div>
    `;
    root.appendChild(el);
  });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

window.AIAutomation = {
  TWEAK_DEFAULTS,
  ICON_SUGGESTIONS,
  guessIcon,
  renderItems
};

// Initial paint uses defaults. Local edit-mode can re-render via window.AIAutomation.renderItems.
renderItems(TWEAK_DEFAULTS.items, TWEAK_DEFAULTS.loopSeconds);
