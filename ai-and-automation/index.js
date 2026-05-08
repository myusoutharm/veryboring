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

// ── App / Tweaks ─────────────────────────────────────────────────────────
const { useEffect } = React;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    renderItems(t.items, t.loopSeconds);
  }, [t.items, t.loopSeconds]);

  const updateItem = (idx, patch) => {
    const next = t.items.map((it, i) => i === idx ? { ...it, ...patch } : it);
    setTweak('items', next);
  };
  const removeItem = (idx) => {
    const next = t.items.filter((_, i) => i !== idx);
    setTweak('items', next.length ? next : [{ label: 'New task', icon: 'fa-solid fa-circle-dot' }]);
  };
  const addItem = () => {
    const fresh = { label: 'New task', icon: 'fa-solid fa-circle-dot' };
    setTweak('items', [...t.items, fresh]);
  };
  const moveItem = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= t.items.length) return;
    const next = t.items.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    setTweak('items', next);
  };

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Animation" />
      <TweakSlider label="Loop length" value={t.loopSeconds}
        min={6} max={40} step={1} unit="s"
        onChange={(v) => setTweak('loopSeconds', v)} />

      <TweakSection label={`Boring tasks (${t.items.length})`} />
      {t.items.map((it, i) => (
        <ItemEditor
          key={i}
          item={it}
          index={i}
          total={t.items.length}
          onChange={(patch) => updateItem(i, patch)}
          onRemove={() => removeItem(i)}
          onMove={(dir) => moveItem(i, dir)}
        />
      ))}

      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <button className="twk-btn" style={{ flex: 1 }} onClick={addItem}>
          + Add task
        </button>
      </div>

      <TweakSection label="Quick add" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {ICON_SUGGESTIONS.filter(s => !t.items.some(it => it.label.toLowerCase() === s.label.toLowerCase())).slice(0, 12).map(s => (
          <button key={s.label}
            className="twk-btn secondary"
            style={{ fontSize: 10.5, height: 22, padding: '0 8px' }}
            onClick={() => setTweak('items', [...t.items, s])}>
            <i className={s.icon} style={{ marginRight: 4, opacity: 0.7 }}></i>
            {s.label}
          </button>
        ))}
      </div>
    </TweaksPanel>
  );
}

function ItemEditor({ item, index, total, onChange, onRemove, onMove }) {
  return (
    <div style={{
      padding: 8,
      borderRadius: 8,
      background: 'rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column', gap: 6
    }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#1a1a2e', color: '#ffd166', fontSize: 14, flex: '0 0 28px'
        }}>
          <i className={item.icon || 'fa-solid fa-circle-dot'}></i>
        </div>
        <input
          className="twk-field"
          value={item.label}
          onChange={(e) => {
            const label = e.target.value;
            // auto-suggest icon if user hasn't customized it from default-ish
            onChange({ label });
          }}
          onBlur={(e) => {
            // when user leaves the field, if icon is generic, guess from label
            if (!item.icon || item.icon === 'fa-solid fa-circle-dot') {
              onChange({ icon: guessIcon(e.target.value) });
            }
          }}
          placeholder="task name"
          style={{ flex: 1, minWidth: 0 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          className="twk-field"
          value={item.icon}
          onChange={(e) => onChange({ icon: e.target.value })}
          placeholder="fa-solid fa-..."
          style={{ flex: 1, minWidth: 0, fontFamily: 'ui-monospace, monospace', fontSize: 10.5 }}
        />
        <button className="twk-btn secondary"
          title="Auto-pick icon from label"
          onClick={() => onChange({ icon: guessIcon(item.label) })}
          style={{ height: 26, padding: '0 8px' }}>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </button>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="twk-btn secondary" onClick={() => onMove(-1)}
          disabled={index === 0}
          style={{ flex: 1, height: 22, padding: 0, opacity: index === 0 ? 0.4 : 1 }}>↑</button>
        <button className="twk-btn secondary" onClick={() => onMove(+1)}
          disabled={index === total - 1}
          style={{ flex: 1, height: 22, padding: 0, opacity: index === total - 1 ? 0.4 : 1 }}>↓</button>
        <button className="twk-btn secondary" onClick={onRemove}
          style={{ flex: 1, height: 22, padding: 0, color: '#b94a3a' }}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

// initial paint with defaults so the page is correct even before tweaks load
renderItems(TWEAK_DEFAULTS.items, TWEAK_DEFAULTS.loopSeconds);

// mount Tweaks (panel is hidden until host activates)
const mount = document.createElement('div');
document.body.appendChild(mount);
ReactDOM.createRoot(mount).render(<App />);
