import React, { useState, useReducer } from 'react';

// ─────────────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────────────
const DART_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const NUM_PLAYERS  = 5;
const MAX_HITS     = 3;

const C = {
  bg:            '#0d0d0d',
  surface:       '#1a1201',
  surfaceAlt:    '#14100a',
  border:        '#8B6914',
  borderDim:     '#3a2a10',
  text:          '#f5f0e8',
  textMuted:     '#9e8b6e',
  brass:         '#b8972e',
  brassLight:    '#d4b84a',
  killerFrom:    '#5a0000',
  killerTo:      '#8B0000',
  killerBorder:  '#cc0000',
  outBg:         '#1a1010',
  outText:       '#5a3535',
  red:           '#c01010',
  green:         '#1a7a1a',
};

// ─────────────────────────────────────────────────────────────────────
//  DARTBOARD SVG
// ─────────────────────────────────────────────────────────────────────
function DartboardSVG({ size = 280 }) {
  const cx = size / 2;
  const cy = size / 2;
  const R  = size / 2 - 3;

  const rBull   = R * 0.042;
  const r25     = R * 0.096;
  const rTriIn  = R * 0.447;
  const rTriOut = R * 0.480;
  const rDblIn  = R * 0.724;
  const rDblOut = R * 0.771;
  const rNum    = R * 0.874;
  const rBoard  = R * 0.784;

  const p2c = (a, r) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];

  const sector = (r1, r2, a1, a2) => {
    const [x1, y1] = p2c(a1, r1);
    const [x2, y2] = p2c(a2, r1);
    const [x3, y3] = p2c(a2, r2);
    const [x4, y4] = p2c(a1, r2);
    const lg = (a2 - a1 > Math.PI) ? 1 : 0;
    return `M${x1},${y1} A${r1},${r1} 0 ${lg},1 ${x2},${y2} L${x3},${y3} A${r2},${r2} 0 ${lg},0 ${x4},${y4}Z`;
  };

  const HALF = Math.PI / 20;

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.95))' }}
      aria-label="Dartboard"
    >
      <defs>
        <radialGradient id="dgWood" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#3d2010" />
          <stop offset="55%"  stopColor="#1a0e04" />
          <stop offset="100%" stopColor="#080400" />
        </radialGradient>
        <radialGradient id="dgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="50%"  stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(184,151,46,0.10)" />
        </radialGradient>
        <radialGradient id="dgBull" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#e03030" />
          <stop offset="100%" stopColor="#800000" />
        </radialGradient>
        <radialGradient id="dgBull25" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#2ea82e" />
          <stop offset="100%" stopColor="#0a5a0a" />
        </radialGradient>
      </defs>

      {/* Wood surround */}
      <circle cx={cx} cy={cy} r={size / 2} fill="url(#dgWood)" />

      {/* Board base */}
      <circle
        cx={cx} cy={cy} r={rBoard + R * 0.04}
        fill="#111107"
        stroke={C.border}
        strokeWidth={R * 0.016}
      />

      {/* Segments */}
      {DART_NUMBERS.map((num, i) => {
        const ca = -Math.PI / 2 + i * (2 * Math.PI / 20);
        const a1 = ca - HALF;
        const a2 = ca + HALF;
        const even  = i % 2 === 0;
        const sFill = even ? '#1d1d1a' : '#ede0b0';
        const rFill = even ? '#c01010' : '#1a7a1a';
        const [tx, ty] = p2c(ca, rNum);
        const fSize = R * 0.108;

        return (
          <g key={num}>
            {/* Inner single */}
            <path d={sector(r25,    rTriIn,  a1, a2)} fill={sFill} stroke="#9a7a1e" strokeWidth="0.7" />
            {/* Treble ring */}
            <path d={sector(rTriIn, rTriOut, a1, a2)} fill={rFill} stroke="#9a7a1e" strokeWidth="0.7" />
            {/* Outer single */}
            <path d={sector(rTriOut,rDblIn,  a1, a2)} fill={sFill} stroke="#9a7a1e" strokeWidth="0.7" />
            {/* Double ring */}
            <path d={sector(rDblIn, rDblOut, a1, a2)} fill={rFill} stroke="#9a7a1e" strokeWidth="0.7" />
            {/* Segment number */}
            <text
              x={tx} y={ty}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fSize}
              fontWeight="bold"
              fill="#f2ede0"
              fontFamily="Georgia,'Times New Roman',serif"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >{num}</text>
          </g>
        );
      })}

      {/* Wire ring lines */}
      {[r25, rTriIn, rTriOut, rDblIn, rDblOut].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#b8972e" strokeWidth="1.4" />
      ))}

      {/* Outer bull (25) */}
      <circle cx={cx} cy={cy} r={r25}   fill="url(#dgBull25)" stroke="#b8972e" strokeWidth="1.4" />
      {/* Inner bull */}
      <circle cx={cx} cy={cy} r={rBull} fill="url(#dgBull)"   stroke="#b8972e" strokeWidth="1.2" />

      {/* Centre dot */}
      <circle cx={cx} cy={cy} r={R * 0.012} fill="#f0d080" />

      {/* Subtle glow overlay */}
      <circle cx={cx} cy={cy} r={size / 2} fill="url(#dgGlow)" pointerEvents="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  HEART SVG
// ─────────────────────────────────────────────────────────────────────
function Heart({ filled, size = 22 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#c01010' : 'none'}
      stroke={filled ? '#e04040' : '#4a2828'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  TROPHY SVG
// ─────────────────────────────────────────────────────────────────────
function Trophy({ size = 80 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.brass}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────────────────
const makePlayer = (livesCount) => ({
  name:         '',
  number:       null,
  hits:         0,
  currentLives: livesCount,
  eliminated:   false,
});

const makeInitial = (livesCount = 3) => ({
  screen:     'names',
  livesCount,
  players:    Array.from({ length: NUM_PLAYERS }, () => makePlayer(livesCount)),
  history:    [],
  winner:     null,
});

const snap = (s) => ({
  screen:     s.screen,
  livesCount: s.livesCount,
  players:    s.players.map(p => ({ ...p })),
  winner:     s.winner,
});

const getWinner = (players) => {
  const alive = players.filter(p => !p.eliminated);
  return alive.length === 1 ? alive[0].name : null;
};

function reducer(state, action) {
  switch (action.type) {

    case 'SET_NAME': {
      const players = state.players.map((p, i) =>
        i === action.index ? { ...p, name: action.name } : p
      );
      return { ...state, players };
    }

    case 'SET_LIVES': {
      const { livesCount } = action;
      const players = state.players.map(p => ({ ...p, currentLives: livesCount }));
      return { ...state, livesCount, players };
    }

    case 'GO_TO_NUMBERS':
      return { ...state, screen: 'numbers' };

    case 'ASSIGN_NUMBER': {
      const players = state.players.map((p, i) =>
        i === action.index ? { ...p, number: action.number } : p
      );
      return { ...state, players };
    }

    case 'UNASSIGN_NUMBER': {
      const players = state.players.map((p, i) =>
        i === action.index ? { ...p, number: null } : p
      );
      return { ...state, players };
    }

    case 'GO_TO_GAME': {
      const players = state.players.map(p => ({
        ...p,
        hits:         0,
        currentLives: state.livesCount,
        eliminated:   false,
      }));
      return { ...state, screen: 'game', players, history: [], winner: null };
    }

    case 'HIT_PLUS': {
      const prev = snap(state);
      const players = state.players.map((p, i) => {
        if (i !== action.index) return p;
        return { ...p, hits: Math.min(p.hits + 1, MAX_HITS) };
      });
      return { ...state, players, history: [...state.history, prev] };
    }

    case 'HIT_MINUS': {
      const prev = snap(state);
      const players = state.players.map((p, i) => {
        if (i !== action.index) return p;
        return { ...p, hits: Math.max(p.hits - 1, 0) };
      });
      return { ...state, players, history: [...state.history, prev] };
    }

    case 'LIFE_MINUS': {
      const prev = snap(state);
      const players = state.players.map((p, i) => {
        if (i !== action.index) return p;
        const currentLives = Math.max(p.currentLives - 1, 0);
        return { ...p, currentLives, eliminated: currentLives === 0 };
      });
      const winner = getWinner(players);
      return {
        ...state,
        players,
        history:  [...state.history, prev],
        screen:   winner ? 'winner' : state.screen,
        winner,
      };
    }

    case 'LIFE_PLUS': {
      const prev = snap(state);
      const players = state.players.map((p, i) => {
        if (i !== action.index) return p;
        const currentLives = Math.min(p.currentLives + 1, state.livesCount);
        return { ...p, currentLives, eliminated: false };
      });
      return { ...state, players, history: [...state.history, prev] };
    }

    case 'UNDO': {
      if (!state.history.length) return state;
      const prev    = state.history[state.history.length - 1];
      const history = state.history.slice(0, -1);
      return { ...prev, history };
    }

    case 'RESET':
      return makeInitial(3);

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────
//  SHARED BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────
function Btn({ onClick, disabled, style: extra = {}, children }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      style={{
        cursor:     disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'opacity 0.15s, background 0.15s',
        opacity:    disabled ? 0.35 : 1,
        ...extra,
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  NAMES SCREEN
// ─────────────────────────────────────────────────────────────────────
function NamesScreen({ state, dispatch }) {
  const { players, livesCount } = state;
  const allFilled = players.every(p => p.name.trim().length > 0);

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

      {/* Dartboard hero */}
      <div style={{
        background: 'linear-gradient(145deg,#2d1a08,#1a0e04,#2d1a08)',
        borderRadius: 20,
        padding: 18,
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 6px 28px rgba(0,0,0,0.7)',
        border: `1px solid ${C.borderDim}`,
      }}>
        <DartboardSVG size={260} />
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <div style={{
          fontFamily: "Georgia,'Times New Roman',serif",
          fontSize: 52,
          fontWeight: 900,
          color: C.brass,
          letterSpacing: 14,
          textShadow: `0 2px 16px rgba(184,151,46,0.45)`,
        }}>KILLER</div>
        <div style={{ fontSize: 13, color: C.textMuted, letterSpacing: 10, textTransform: 'uppercase', marginTop: 4 }}>Darts</div>
      </div>

      {/* Name inputs */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {players.map((p, i) => (
          <div key={i} style={{
            display:    'flex',
            alignItems: 'center',
            gap:        12,
            background: C.surface,
            border:     `1px solid ${C.borderDim}`,
            borderRadius: 10,
            padding:    '11px 14px',
          }}>
            <span style={{
              fontFamily: "Georgia,serif",
              color:      C.brass,
              fontWeight: 700,
              fontSize:   13,
              minWidth:   68,
              letterSpacing: 1,
            }}>Player {i + 1}</span>
            <input
              type="text"
              value={p.name}
              onChange={e => dispatch({ type: 'SET_NAME', index: i, name: e.target.value })}
              placeholder="Name…"
              maxLength={18}
              style={{
                flex:       1,
                background: 'transparent',
                border:     'none',
                borderBottom: `1px solid ${p.name ? C.brass : '#3a2a10'}`,
                color:      C.text,
                fontSize:   17,
                fontWeight: 700,
                fontFamily: "Georgia,serif",
                padding:    '3px 0',
                outline:    'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
        ))}
      </div>

      {/* Lives selector */}
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', color: C.textMuted, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 10 }}>
          Lives per player
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <Btn
              key={n}
              onClick={() => dispatch({ type: 'SET_LIVES', livesCount: n })}
              style={{
                width:        52,
                height:       52,
                borderRadius: 10,
                border:       `2px solid ${livesCount === n ? C.brass : '#2a1e08'}`,
                background:   livesCount === n ? '#2d1f06' : C.surface,
                color:        livesCount === n ? C.brass : '#4a3820',
                fontSize:     20,
                fontWeight:   900,
                fontFamily:   'monospace',
              }}
            >{n}</Btn>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Btn
        onClick={() => allFilled && dispatch({ type: 'GO_TO_NUMBERS' })}
        disabled={!allFilled}
        style={{
          width:        '100%',
          padding:      '17px 0',
          borderRadius: 12,
          border:       'none',
          background:   allFilled
            ? `linear-gradient(135deg,${C.border},${C.brass})`
            : '#1c1608',
          color:        allFilled ? '#0d0d0d' : '#3a2e18',
          fontSize:     17,
          fontWeight:   900,
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontFamily:   "Georgia,serif",
        }}
      >
        Next →
      </Btn>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  NUMBERS SCREEN
// ─────────────────────────────────────────────────────────────────────
function NumbersScreen({ state, dispatch }) {
  const { players } = state;
  const assigned      = players.filter(p => p.number !== null).map(p => p.number);
  const nextIdx       = players.findIndex(p => p.number === null);
  const allAssigned   = players.every(p => p.number !== null);

  const tapNumber = (num) => {
    if (assigned.includes(num) || nextIdx === -1) return;
    dispatch({ type: 'ASSIGN_NUMBER', index: nextIdx, number: num });
  };

  const tapUnassign = (i) => {
    dispatch({ type: 'UNASSIGN_NUMBER', index: i });
  };

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

      {/* Compact dartboard */}
      <div style={{
        background: 'linear-gradient(145deg,#2d1a08,#1a0e04)',
        borderRadius: 16,
        padding:    12,
        boxShadow:  'inset 0 0 24px rgba(0,0,0,0.8)',
        border:     `1px solid ${C.borderDim}`,
      }}>
        <DartboardSVG size={190} />
      </div>

      <div style={{ textAlign: 'center', color: C.textMuted, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', lineHeight: 1.5 }}>
        Each player throws <span style={{ color: C.brass }}>left-handed</span><br />then tap their number below
      </div>

      {/* Player row */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {players.map((p, i) => {
          const isCurrent = i === nextIdx;
          const hasNum    = p.number !== null;
          return (
            <div
              key={i}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '10px 14px',
                borderRadius:   10,
                background:     isCurrent ? '#281d06' : C.surface,
                border:         `1px solid ${isCurrent ? C.brass : hasNum ? '#2a3a18' : C.borderDim}`,
                boxShadow:      isCurrent ? `0 0 14px rgba(184,151,46,0.18)` : 'none',
                transition:     'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  color:      isCurrent ? C.text : hasNum ? C.textMuted : '#4a3828',
                  fontWeight: 800,
                  fontSize:   15,
                  fontFamily: "Georgia,serif",
                }}>
                  {p.name}
                </span>
                {isCurrent && (
                  <span style={{ fontSize: 10, color: C.brass, letterSpacing: 2, textTransform: 'uppercase' }}>← now</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  color:      hasNum ? C.brass : '#2e2210',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize:   22,
                  minWidth:   30,
                  textAlign:  'right',
                }}>
                  {hasNum ? p.number : '—'}
                </span>
                {hasNum && (
                  <Btn
                    onClick={() => tapUnassign(i)}
                    style={{
                      width:      24, height: 24,
                      borderRadius: 4,
                      border:     `1px solid #4a2a10`,
                      background: '#1a0e08',
                      color:      '#9e5030',
                      fontSize:   13,
                      display:    'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >✕</Btn>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Number pad — 4 cols × 5 rows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7, width: '100%' }}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => {
          const taken = assigned.includes(num);
          return (
            <Btn
              key={num}
              onClick={() => tapNumber(num)}
              disabled={taken}
              style={{
                height:       52,
                borderRadius: 9,
                border:       `1px solid ${taken ? '#1a1a0a' : '#4a3820'}`,
                background:   taken ? '#111109' : '#1e1508',
                color:        taken ? '#252515' : C.brassLight,
                fontSize:     17,
                fontWeight:   800,
                fontFamily:   'monospace',
              }}
            >{num}</Btn>
          );
        })}
      </div>

      {allAssigned && (
        <Btn
          onClick={() => dispatch({ type: 'GO_TO_GAME' })}
          style={{
            width:        '100%',
            padding:      '17px 0',
            borderRadius: 12,
            border:       'none',
            background:   `linear-gradient(135deg,${C.border},${C.brass})`,
            color:        '#0d0d0d',
            fontSize:     17,
            fontWeight:   900,
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontFamily:   "Georgia,serif",
          }}
        >
          Begin Game →
        </Btn>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  PLAYER TILE
// ─────────────────────────────────────────────────────────────────────
function PlayerTile({ player, index, livesCount, dispatch, killerPulse }) {
  const { name, number, hits, currentLives, eliminated } = player;
  const isKiller = hits >= MAX_HITS && !eliminated;

  const borderCol = eliminated
    ? '#2a1a1a'
    : isKiller
      ? C.killerBorder
      : C.borderDim;

  const bgStyle = eliminated
    ? C.outBg
    : isKiller
      ? `linear-gradient(135deg,${C.killerFrom},${C.killerTo})`
      : C.surface;

  const tileStyle = {
    borderRadius: 13,
    padding:      '14px 15px 13px',
    marginBottom: 10,
    border:       `2px solid ${borderCol}`,
    background:   bgStyle,
    boxShadow:    isKiller
      ? '0 0 22px rgba(204,0,0,0.38), inset 0 0 12px rgba(200,0,0,0.10)'
      : 'inset 0 1px 0 rgba(255,255,255,0.04)',
    opacity:      eliminated ? 0.55 : 1,
    transition:   'border-color 0.3s, opacity 0.3s',
    animation:    isKiller ? `${killerPulse} 2s ease-in-out infinite` : 'none',
  };

  const ctrlBtn = (label, action, disabled, accent) => (
    <Btn
      onClick={() => !disabled && dispatch({ type: action, index })}
      disabled={disabled}
      style={{
        width:        46,
        height:       46,
        borderRadius: 9,
        border:       `1px solid ${disabled ? '#1a1a10' : accent === 'red' ? '#4a1010' : accent === 'green' ? '#1a3a10' : '#3a2a10'}`,
        background:   disabled ? '#0e0e08' : accent === 'red' ? '#1e0808' : accent === 'green' ? '#081808' : '#1a1608',
        color:        disabled ? '#1e1e10' : accent === 'red' ? '#cc3333' : accent === 'green' ? '#3a9a3a' : C.textMuted,
        fontSize:     22,
        fontWeight:   900,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
      }}
    >{label}</Btn>
  );

  return (
    <div style={tileStyle}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{
            fontFamily: "Georgia,serif",
            fontSize:   20,
            fontWeight: 900,
            color:      eliminated ? C.outText : isKiller ? '#ff7070' : C.text,
            letterSpacing: 0.5,
            lineHeight: 1.1,
          }}>{name}</div>
          <div style={{
            fontFamily: 'monospace',
            fontSize:   12,
            color:      eliminated ? '#3a2020' : C.brass,
            letterSpacing: 3,
            marginTop:  2,
          }}>№ {number}</div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {eliminated ? (
            <span style={{ fontSize: 13, color: '#8B0000', fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase' }}>OUT</span>
          ) : isKiller ? (
            <span style={{ fontSize: 17, fontWeight: 900, color: '#ff4040', letterSpacing: 1 }}>KILLER ☠</span>
          ) : (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {Array.from({ length: MAX_HITS }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width:        14, height: 14,
                    borderRadius: '50%',
                    background:   i < hits ? C.brass : 'transparent',
                    border:       `2px solid ${i < hits ? C.brass : '#3a2a10'}`,
                    transition:   'all 0.2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lives row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: eliminated ? 0 : 12 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {Array.from({ length: livesCount }, (_, i) => (
            <Heart key={i} filled={i < currentLives} size={eliminated ? 18 : 22} />
          ))}
        </div>
        {!eliminated && (
          <span style={{ fontSize: 10, color: '#4a3820', letterSpacing: 2, textTransform: 'uppercase' }}>
            {currentLives}/{livesCount} lives
          </span>
        )}
      </div>

      {/* Controls */}
      {!eliminated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Hits */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {ctrlBtn('−', 'HIT_MINUS',  hits === 0,       'dim')}
            <span style={{ fontSize: 9, color: '#3a2a10', letterSpacing: 2, textAlign: 'center', minWidth: 26, textTransform: 'uppercase' }}>hits</span>
            {ctrlBtn('+', 'HIT_PLUS',   isKiller,          'green')}
          </div>

          <div style={{ flex: 1, height: 1, background: '#2a1a08', margin: '0 4px' }} />

          {/* Lives */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {ctrlBtn('−', 'LIFE_MINUS', false,            'red')}
            <span style={{ fontSize: 9, color: '#3a2a10', letterSpacing: 2, textAlign: 'center', minWidth: 28, textTransform: 'uppercase' }}>lives</span>
            {ctrlBtn('+', 'LIFE_PLUS',  currentLives >= livesCount, 'green')}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  GAME SCREEN
// ─────────────────────────────────────────────────────────────────────
function GameScreen({ state, dispatch }) {
  const { players, livesCount, history } = state;
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '8px 12px 90px' }}>
        {/* Mini header */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap:        10,
          padding:    '10px 0 14px',
        }}>
          <span style={{ fontFamily: "Georgia,serif", color: C.brass, fontSize: 20, fontWeight: 900, letterSpacing: 10 }}>KILLER</span>
          <span style={{ color: '#3a2a10', fontSize: 11, letterSpacing: 4 }}>DARTS</span>
        </div>

        {players.map((p, i) => (
          <PlayerTile
            key={i}
            player={p}
            index={i}
            livesCount={livesCount}
            dispatch={dispatch}
            killerPulse="killerPulse"
          />
        ))}
      </div>

      {/* Fixed bottom controls */}
      <div style={{
        position:   'fixed',
        bottom:     0, left: 0, right: 0,
        background: 'rgba(13,13,13,0.97)',
        backdropFilter: 'blur(8px)',
        borderTop:  `1px solid ${C.borderDim}`,
        padding:    '10px 16px 12px',
        display:    'flex',
        gap:        10,
        zIndex:     50,
      }}>
        <Btn
          onClick={() => dispatch({ type: 'UNDO' })}
          disabled={history.length === 0}
          style={{
            flex:         1,
            padding:      '13px 0',
            borderRadius: 9,
            border:       `1px solid ${history.length ? '#3a2a10' : '#1a1808'}`,
            background:   history.length ? '#1a1201' : '#0e0e08',
            color:        history.length ? C.textMuted : '#2a2010',
            fontSize:     14,
            fontWeight:   700,
            letterSpacing: 1,
          }}
        >↩ Undo Last</Btn>
        <Btn
          onClick={() => setShowReset(true)}
          style={{
            flex:         1,
            padding:      '13px 0',
            borderRadius: 9,
            border:       '1px solid #3a1010',
            background:   '#140606',
            color:        '#7a3030',
            fontSize:     14,
            fontWeight:   700,
            letterSpacing: 1,
          }}
        >⟳ Reset Game</Btn>
      </div>

      {/* Reset dialog */}
      {showReset && (
        <div style={{
          position:   'fixed',
          inset:      0,
          background: 'rgba(0,0,0,0.88)',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex:     100,
          padding:    20,
        }}>
          <div style={{
            background:   C.surface,
            border:       `1px solid ${C.border}`,
            borderRadius: 16,
            padding:      26,
            maxWidth:     320,
            width:        '100%',
            textAlign:    'center',
          }}>
            <div style={{ color: C.text, fontSize: 19, fontWeight: 700, marginBottom: 8, fontFamily: "Georgia,serif" }}>Reset Game?</div>
            <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 22 }}>All scores and progress will be lost.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn
                onClick={() => setShowReset(false)}
                style={{
                  flex: 1, padding: 13, borderRadius: 9,
                  border: `1px solid ${C.borderDim}`, background: '#111',
                  color: C.textMuted, fontSize: 15,
                }}
              >Cancel</Btn>
              <Btn
                onClick={() => { dispatch({ type: 'RESET' }); setShowReset(false); }}
                style={{
                  flex: 1, padding: 13, borderRadius: 9,
                  border: '1px solid #8B0000', background: '#4a0000',
                  color: '#ff8888', fontSize: 15, fontWeight: 700,
                }}
              >Reset</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  WINNER OVERLAY
// ─────────────────────────────────────────────────────────────────────
function WinnerOverlay({ state, dispatch }) {
  const { winner } = state;
  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      background:     'linear-gradient(to bottom,#0d0d0d 0%,#1a0e04 60%,#0d0d0d 100%)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            18,
      zIndex:         200,
      padding:        32,
      animation:      'fadeIn 0.5s ease',
    }}>
      <Trophy size={88} />
      <div style={{ fontFamily: "Georgia,serif", fontSize: 15, color: C.textMuted, letterSpacing: 8, textTransform: 'uppercase' }}>
        The Winner Is
      </div>
      <div style={{
        fontFamily:  "Georgia,serif",
        fontSize:    clamp(winner.length, 38, 50),
        fontWeight:  900,
        color:       C.brass,
        textAlign:   'center',
        textShadow:  `0 0 36px rgba(184,151,46,0.55)`,
        letterSpacing: 4,
        lineHeight:  1.1,
      }}>
        {winner}
      </div>
      <div style={{ fontSize: 40, marginTop: 4 }}>🎯</div>
      <Btn
        onClick={() => dispatch({ type: 'RESET' })}
        style={{
          marginTop:    16,
          padding:      '16px 52px',
          borderRadius: 12,
          border:       'none',
          background:   `linear-gradient(135deg,${C.border},${C.brass})`,
          color:        '#0d0d0d',
          fontSize:     17,
          fontWeight:   900,
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontFamily:   "Georgia,serif",
        }}
      >Play Again</Btn>
    </div>
  );
}

function clamp(len, small, large) {
  return len > 10 ? small : large;
}

// ─────────────────────────────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, makeInitial(3));

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', color: C.text }}>
      {state.screen === 'names'   && <NamesScreen   state={state} dispatch={dispatch} />}
      {state.screen === 'numbers' && <NumbersScreen state={state} dispatch={dispatch} />}
      {(state.screen === 'game' || state.screen === 'winner') && (
        <GameScreen state={state} dispatch={dispatch} />
      )}
      {state.screen === 'winner' && <WinnerOverlay state={state} dispatch={dispatch} />}
    </div>
  );
}
