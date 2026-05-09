const { useEffect } = React;
const { TWEAK_DEFAULTS, ICON_SUGGESTIONS, guessIcon, renderItems } = window.AIAutomation;

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
            onChange({ label });
          }}
          onBlur={(e) => {
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

const mount = document.createElement('div');
document.body.appendChild(mount);
ReactDOM.createRoot(mount).render(<App />);
