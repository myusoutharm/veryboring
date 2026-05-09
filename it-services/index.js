/* ─────────────────────────────────────────────────────────
   Pieces: a perfect 6×8 tile (48 cells = 12 tetrominoes).
   Variety of shapes — T, O, L, J, S, I — colored by NIST CSF
   function. Tiling fills every cell exactly once (no gaps).

   Final layout (row 0 = top, row 7 = bottom):
     0:  11 11 11 12 09 09
     1:  11 10 12 12 12 09
     2:  10 10 10 08 08 09
     3:  06 06 07 07 08 05
     4:  06 06 07 07 08 05
     5:  03 03 03 04 04 05
     6:  03 01 04 04 02 05
     7:  01 01 01 02 02 02

   cat: ID=Identify, PR=Protect, DE=Detect, RS=Respond, RC=Recover
   Order below = drop order (bottom-up, gravity-respecting).
   ───────────────────────────────────────────────────── */

const PIECES = [
  // P1 — T-piece, bottom-left
  {
    id: 'p01', cat: 'ID', row: 6, col: 0, w: 3, h: 2,
    cells: [[0, 1], [1, 0], [1, 1], [1, 2]],
    label: 'Asset Management'
  },
  // P2 — T-piece, bottom-right
  {
    id: 'p02', cat: 'ID', row: 6, col: 3, w: 3, h: 2,
    cells: [[0, 1], [1, 0], [1, 1], [1, 2]],
    label: 'Risk Assessment'
  },
  // P4 — S-piece (mid-bottom)
  {
    id: 'p04', cat: 'RC', row: 5, col: 2, w: 3, h: 2,
    cells: [[0, 1], [0, 2], [1, 0], [1, 1]],
    label: 'Cloud Backup'
  },
  // P3 — L-piece (left, row 5-6)
  {
    id: 'p03', cat: 'RC', row: 5, col: 0, w: 3, h: 2,
    cells: [[0, 0], [0, 1], [0, 2], [1, 0]],
    label: 'Endpoint Backup'
  },
  // P5 — I-piece vertical, far right
  {
    id: 'p05', cat: 'PR', row: 3, col: 5, w: 1, h: 4,
    cells: [[0, 0], [1, 0], [2, 0], [3, 0]],
    label: 'Firewall Management'
  },
  // P6 — O-piece, mid-left
  {
    id: 'p06', cat: 'DE', row: 3, col: 0, w: 2, h: 2,
    cells: [[0, 0], [0, 1], [1, 0], [1, 1]],
    label: '24×7 Monitoring'
  },
  // P7 — O-piece, mid-mid
  {
    id: 'p07', cat: 'DE', row: 3, col: 2, w: 2, h: 2,
    cells: [[0, 0], [0, 1], [1, 0], [1, 1]],
    label: 'Dark Web Monitoring'
  },
  // P8 — J-piece, mid-right
  {
    id: 'p08', cat: 'PR', row: 2, col: 3, w: 2, h: 3,
    cells: [[0, 0], [0, 1], [1, 1], [2, 1]],
    label: 'Multi-Factor Auth'
  },
  // P10 — T-piece, mid (pointing up)
  {
    id: 'p10', cat: 'PR', row: 1, col: 0, w: 3, h: 2,
    cells: [[0, 1], [1, 0], [1, 1], [1, 2]],
    label: 'Patch Management'
  },
  // P12 — T-piece, top-mid (pointing down)
  {
    id: 'p12', cat: 'RS', row: 0, col: 2, w: 3, h: 2,
    cells: [[0, 1], [1, 0], [1, 1], [1, 2]],
    label: 'Email Security'
  },
  // P9 — J-piece, top-right
  {
    id: 'p09', cat: 'RS', row: 0, col: 4, w: 2, h: 3,
    cells: [[0, 0], [0, 1], [1, 1], [2, 1]],
    label: 'EDR/MDR'
  },
  // P11 — L-piece, top-left
  {
    id: 'p11', cat: 'RS', row: 0, col: 0, w: 3, h: 2,
    cells: [[0, 0], [0, 1], [0, 2], [1, 0]],
    label: 'Incident Response'
  },
];

const CAT_COLOR = {
  ID: 'var(--nist-id)',
  PR: 'var(--nist-pr)',
  DE: 'var(--nist-de)',
  RS: 'var(--nist-rs)',
  RC: 'var(--nist-rc)',
};

/* ── Build the drop @keyframes per piece ─────────────────
   Each piece needs to fall, then rest at translateY(0) until
   the whole loop ends. Because each piece has a different
   --delay, we want the fall portion to occupy the same
   absolute time slot — i.e. percentages relative to total
   duration. Simpler: compute land% per piece and inject
   a unique keyframe per piece via --land-pct. */

const TOTAL = 16;            // seconds, must match --duration
const FALL = 0.7;            // seconds per piece
const STAGGER = 0.55;        // seconds between piece starts
const HOLD_AFTER_LAST = 4.5; // hold completed board this long
const RESET_TIME = 0.5;      // brief blank before loop restarts

// Recompute total to match piece schedule
const lastStart = STAGGER * (PIECES.length - 1);
const lastLand = lastStart + FALL;
const computedTotal = lastLand + HOLD_AFTER_LAST + RESET_TIME;
document.documentElement.style.setProperty('--duration', computedTotal + 's');

/* ── render board ───────────────────────────────────────── */
const board = document.getElementById('board');

PIECES.forEach((p, i) => {
  p.color = CAT_COLOR[p.cat];
  const start = STAGGER * i;
  const land = start + FALL;
  const startPct = (start / computedTotal) * 100;
  const landPct = (land / computedTotal) * 100;
  const resetStartPct = ((computedTotal - RESET_TIME) / computedTotal) * 100;

  // unique keyframe name per piece
  const kfName = 'drop_' + p.id;
  const kf = `
    @keyframes ${kfName} {
      0%, ${startPct.toFixed(2)}% {
        transform: translateY(calc(var(--cell) * -1 * (var(--row) + var(--h) + 1)));
        opacity: 0;
      }
      ${(startPct + 0.05).toFixed(2)}% { opacity: 1; }
      ${landPct.toFixed(2)}%, ${resetStartPct.toFixed(2)}% {
        transform: translateY(0);
        opacity: 1;
      }
      ${(resetStartPct + 0.1).toFixed(2)}%, 100% {
        transform: translateY(calc(var(--cell) * -1 * (var(--row) + var(--h) + 1)));
        opacity: 0;
      }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = kf;
  document.head.appendChild(styleEl);

  // build piece DOM
  const el = document.createElement('div');
  el.className = 'piece';
  el.style.cssText = `
    --row: ${p.row};
    --col: ${p.col};
    --w: ${p.w};
    --h: ${p.h};
    --color: ${p.color};
    animation-name: ${kfName};
  `;
  // empty cells for the bounding box, then fill the populated ones
  const grid = Array.from({ length: p.h }, () => Array.from({ length: p.w }, () => false));
  p.cells.forEach(([r, c]) => grid[r][c] = true);
  for (let r = 0; r < p.h; r++) {
    for (let c = 0; c < p.w; c++) {
      const cell = document.createElement('div');
      cell.style.gridArea = `${r + 1} / ${c + 1}`;
      if (grid[r][c]) {
        cell.className = 'cell';
      } else {
        cell.style.visibility = 'hidden';
      }
      el.appendChild(cell);
    }
  }
  board.appendChild(el);

  // label chip — appended to its NIST category bucket
  const chip = document.createElement('div');
  chip.className = 'label';
  // chip "lands" a beat after the brick has finished falling
  const chipStartPct = Math.min(landPct + 0.4, resetStartPct - 0.5);
  const chipKf = `
    @keyframes chip_${p.id} {
      0%, ${chipStartPct.toFixed(2)}% { opacity: 0; transform: translateY(-10px); }
      ${(chipStartPct + 0.6).toFixed(2)}% { opacity: 1; transform: translateY(0); }
      ${resetStartPct.toFixed(2)}% { opacity: 1; transform: translateY(0); }
      ${(resetStartPct + 0.2).toFixed(2)}%, 100% { opacity: 0; transform: translateY(-6px); }
    }
  `;
  const chipStyle = document.createElement('style');
  chipStyle.textContent = chipKf;
  document.head.appendChild(chipStyle);

  chip.style.cssText = `
    --color: ${p.color};
    animation: chip_${p.id} var(--duration) ease-out infinite;
  `;
  chip.innerHTML = `
    <div class="swatch"></div>
    <div class="text">${p.label}</div>
  `;
  const bucket = document.querySelector(`.cat-items[data-items="${p.cat}"]`);
  if (bucket) bucket.appendChild(chip);
});
