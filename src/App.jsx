import { useState, useCallback } from 'react'
import { useUser, useClerk, SignIn } from '@clerk/clerk-react'
import { T } from './constants/theme'
import { EXAMS } from './constants/exams'
import { QUESTIONS } from './data/questions'
import {
  IconFlame, IconChart, IconCheck, IconX, IconArrowRight, IconArrowLeft,
  IconSpark, IconLock, IconChevron, IconBell, IconSliders, IconLogout,
  IconTarget, ICONS,
} from './icons'

const FREE_LIMIT = 3

// ── Storage helpers ──────────────────────────────────────────────────────────
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }
function today() { return new Date().toISOString().split('T')[0] }

// ── Helpers de stats ─────────────────────────────────────────────────────────
function areaStats(areaId, progress) {
  const ap    = progress[areaId] || { answered: 0, correct: 0 }
  const total = QUESTIONS[areaId]?.length || 0
  const pct   = total > 0 ? Math.round((ap.answered / total) * 100) : 0
  return { answered: ap.answered, correct: ap.correct, total, pct }
}

function examScore(exam, progress) {
  const areas    = exam.areas.map(a => areaStats(a.id, progress))
  const answered = areas.reduce((s, a) => s + a.answered, 0)
  const correct  = areas.reduce((s, a) => s + a.correct,  0)
  const total    = areas.reduce((s, a) => s + a.total,    0)
  const acc      = answered > 0 ? Math.round((correct / answered) * 100) : 0
  const pct      = total    > 0 ? Math.round((answered / total)  * 100) : 0
  const level    = acc >= 65 ? 'Avanzado' : acc >= 40 ? 'Intermedio' : 'Inicial'
  return { acc, answered, correct, total, pct, level }
}

// ── Global CSS ───────────────────────────────────────────────────────────────
const G = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: ${T.bg}; font-family: ${T.fontBody}; color: ${T.text}; -webkit-font-smoothing: antialiased; }
  #root { display: flex; justify-content: center; min-height: 100vh; }
  button { cursor: pointer; font-family: inherit; }
  input  { font-family: inherit; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: ${T.borderDk}; border-radius: 4px; }
`

// ── Shell ────────────────────────────────────────────────────────────────────
function Shell({ children, style }) {
  return (
    <div style={{
      width: '100%', maxWidth: 480, minHeight: '100vh',
      background: T.bg, display: 'flex', flexDirection: 'column',
      overflowX: 'hidden', position: 'relative', ...style,
    }}>
      {children}
    </div>
  )
}

// ── Ring SVG ─────────────────────────────────────────────────────────────────
function Ring({ pct = 0, color, size = 58, sw = 5, track = T.bgMuted }) {
  const r = (size - sw) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeLinecap="round" strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(100, pct) / 100)}
        style={{ transition: 'stroke-dashoffset .5s ease' }}/>
    </svg>
  )
}

// ── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 42, height: 25, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: on ? T.olive : T.bgMuted, position: 'relative',
      transition: 'background .2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 20 : 3, width: 19, height: 19,
        borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .2s',
      }}/>
    </button>
  )
}

// ── Eyebrow ───────────────────────────────────────────────────────────────────
const Eyebrow = ({ children, color = T.textMuted }) => (
  <p style={{
    fontSize: 10.5, fontWeight: 700, letterSpacing: '.16em',
    textTransform: 'uppercase', color,
  }}>{children}</p>
)

// ── Bar ───────────────────────────────────────────────────────────────────────
function Bar({ value = 0, max = 1, color = T.olive, height = 5 }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100))
  return (
    <div style={{ height, borderRadius: 999, background: T.bgMuted, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 999, background: color,
        width: `${pct}%`, transition: 'width .35s ease',
      }}/>
    </div>
  )
}

// ── Btn ───────────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', disabled, style }) {
  const base = {
    padding: '14px 20px', borderRadius: 14, border: 'none',
    fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'opacity .15s', opacity: disabled ? 0.45 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
  const v = {
    primary:   { background: T.olive,   color: '#fff' },
    secondary: { background: T.bgMuted, color: T.text },
    ghost:     { background: 'transparent', color: T.textSub, border: `1.5px solid ${T.border}` },
  }
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...v[variant], ...style }}>
      {children}
    </button>
  )
}

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.08em' }}>
        {label}
      </span>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '12px 14px', borderRadius: 11, border: `1.5px solid ${T.border}`,
          background: T.bgCard, fontSize: 14, color: T.text, outline: 'none',
        }}
        onFocus={e  => e.target.style.borderColor = T.olive}
        onBlur={e   => e.target.style.borderColor = T.border}
      />
    </label>
  )
}

// ── LogoMini — inline SVG (usa Montserrat cargada en pagina) ─────────────────
function LogoMini({ height = 22, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 290"
      height={height} style={{ display: 'block', ...style }} aria-label="Certus">
      <path fill="#8FA88B" d="M212.41,205.32c.6,30.17-31.07,36.75-31.07,36.75.3-24.95,31.07-36.75,31.07-36.75Z"/>
      <path fill="#8FA88B" d="M236.06,182.58c11.42,27.94-15.76,45.47-15.76,45.47-8.7-23.38,15.76-45.47,15.76-45.47Z"/>
      <path fill="#8FA88B" d="M285,208c-21.69,35.63-56.36,24.5-56.36,24.5,18.68-28.99,56.36-24.5,56.36-24.5Z"/>
      <path fill="#8FA88B" d="M247.61,248.16c-32.97,25.55-61.39,2.78-61.39,2.78,27.79-20.42,61.39-2.78,61.39-2.78Z"/>
      <path fill="#8FA88B" d="M305.17,159.8c-8.91,40.75-45.31,41.51-45.31,41.51,8.22-33.49,45.31-41.51,45.31-41.51Z"/>
      <path fill="#8FA88B" d="M303.37,102.72c9.67,40.57-22.79,57.07-22.79,57.07-7.14-33.74,22.79-57.07,22.79-57.07Z"/>
      <path fill="#8FA88B" d="M280.33,57.62c21.41,34.75-.85,58.37-.85,58.37-17.03-29.13.85-58.37.85-58.37Z"/>
      <path fill="#8FA88B" d="M243.06,19.42c33.52,26.19,21.82,55.55,21.82,55.55-27.24-22.24-21.82-55.55-21.82-55.55Z"/>
      <path fill="#8FA88B" d="M190.39,13.48c42.37,3.74,48.53,34.73,48.53,34.73-34.95-3.84-48.53-34.73-48.53-34.73Z"/>
      <path fill="#8FA88B" d="M236.24,84.24c30.16,1.05,34.99,33.03,34.99,33.03-24.89-1.66-34.99-33.03-34.99-33.03Z"/>
      <path fill="#8FA88B" d="M210.77,55.35c29.21-8.27,43.97,22.1,43.97,22.1-24.35,6.04-43.97-22.1-43.97-22.1Z"/>
      <path fill="#8FA88B" d="M245.82,116.99c28.53,9.4,23.69,42.8,23.69,42.8-23.31-8.55-23.69-42.8-23.69-42.8Z"/>
      <path fill="#8FA88B" d="M248.2,149.81c22.37,20.06,4.53,48.71,4.53,48.71-17.92-17.19-4.53-48.71-4.53-48.71Z"/>
      <path fill="#8FA88B" d="M130.26,269.55s1.11-9.67,27.19-18.86,83.89-7.28,112.38-83.91c28.48-76.63-55.16-138.62-55.16-138.62,0,0,66.71,42.87,66.22,97.1-.49,54.22-27.98,116.37-116.26,129.96-23.6,7.77-20.61,12.85-25.69,19.72-5.08,6.87-8.66-5.38-8.66-5.38Z"/>
      <polygon fill="#4A433E" points="159.61 59.98 97.57 81.19 159.61 102.72 221.55 81.79 159.61 59.98"/>
      <path fill="#4A433E" d="M125.35,96.73l34.21,11.65,34.21-11.65v20.55c-14.04,2.19-26.59,11.27-34.21,15.9,0,0-13.59-12.25-34.21-17.19v-19.26Z"/>
      <path fill="#4A433E" d="M214.66,178.89c1.3.06,0-39.44,0-39.44h9.58v47.8c-30.47-6.7-64.68,15.83-64.68,15.83v-4.57s15.49-21.42,55.1-19.63Z"/>
      <path fill="#4A433E" d="M162.1,149.81c15.54-21.41,48.67-18.55,48.67-18.55v42.9s-32.84-.24-48.67,16.68v-41.03Z"/>
      <polygon fill="#4A433E" points="205.57 82.69 205.57 112.56 203.03 123.91 214.66 123.91 211.49 112.56 210.77 82.69 205.57 82.69"/>
      <circle fill="#4A433E" cx="208.63" cy="104.36" r="5.6"/>
      <path fill="#8FA88B" d="M107.9,204.82c-.59,30.17,30.5,36.75,30.5,36.75-.29-24.95-30.5-36.75-30.5-36.75Z"/>
      <path fill="#8FA88B" d="M84.69,182.08c-11.21,27.94,15.47,45.47,15.47,45.47,8.54-23.38-15.47-45.47-15.47-45.47Z"/>
      <path fill="#8FA88B" d="M36.65,207.5c21.29,35.63,55.32,24.5,55.32,24.5-18.33-28.99-55.32-24.5-55.32-24.5Z"/>
      <path fill="#8FA88B" d="M73.36,247.66c32.36,25.55,60.26,2.78,60.26,2.78-27.27-20.42-60.26-2.78-60.26-2.78Z"/>
      <path fill="#8FA88B" d="M16.86,159.3c8.74,40.75,44.48,41.51,44.48,41.51-8.07-33.49-44.48-41.51-44.48-41.51Z"/>
      <path fill="#8FA88B" d="M18.63,102.22c-9.49,40.57,22.37,57.07,22.37,57.07,7-33.74-22.37-57.07-22.37-57.07Z"/>
      <path fill="#8FA88B" d="M41.25,57.12c-21.01,34.75.83,58.37.83,58.37,16.71-29.13-.83-58.37-.83-58.37Z"/>
      <path fill="#8FA88B" d="M77.82,18.92c-32.9,26.19-21.42,55.55-21.42,55.55,26.73-22.24,21.42-55.55,21.42-55.55Z"/>
      <path fill="#8FA88B" d="M129.52,12.98c-41.59,3.74-47.63,34.73-47.63,34.73,34.31-3.84,47.63-34.73,47.63-34.73Z"/>
      <path fill="#8FA88B" d="M84.51,83.74c-29.6,1.05-34.34,33.03-34.34,33.03,24.43-1.66,34.34-33.03,34.34-33.03Z"/>
      <path fill="#8FA88B" d="M109.51,54.85c-28.67-8.27-43.15,22.1-43.15,22.1,23.9,6.04,43.15-22.1,43.15-22.1Z"/>
      <path fill="#8FA88B" d="M75.11,116.49c-28,9.4-23.25,42.8-23.25,42.8,22.88-8.55,23.25-42.8,23.25-42.8Z"/>
      <path fill="#8FA88B" d="M72.78,149.31c-21.95,20.06-4.45,48.71-4.45,48.71,17.59-17.19,4.45-48.71,4.45-48.71Z"/>
      <path fill="#8FA88B" d="M188.54,269.05s-1.09-9.67-26.68-18.86c-25.59-9.2-82.34-7.28-110.3-83.91C22.6,89.65,105.7,27.65,105.7,27.65c0,0-65.48,42.87-64.99,97.1.48,54.22,27.46,116.37,114.11,129.96,23.17,7.77,20.23,12.85,25.22,19.72,4.98,6.87,8.5-5.38,8.5-5.38Z"/>
      <path fill="#4A433E" d="M105.7,178.39c-1.27.06,0-39.44,0-39.44h-9.41v47.8c29.91-6.7,63.48,15.83,63.48,15.83v-4.57s-15.2-21.42-54.08-19.63Z"/>
      <path fill="#4A433E" d="M157.28,149.31c-15.25-21.41-47.77-18.55-47.77-18.55v42.9s32.23-.24,47.77,16.68v-41.03Z"/>
      <text fill="#4A433E" fontFamily="Montserrat, 'Helvetica Neue', Arial, sans-serif" fontSize="135" fontWeight="700" transform="translate(324.72 235.19)">
        <tspan x="0" y="0">CERTUS</tspan>
      </text>
    </svg>
  )
}

// ── Dropdown menu ─────────────────────────────────────────────────────────────
function DropdownMenu({
  open, onClose, activeId, setActiveId,
  streak, progress, dailyGoal, setDailyGoal,
  remindersOn, setRemindersOn, tutorOn, setTutorOn, onLogout,
}) {
  const activeExam = EXAMS.find(e => e.id === activeId)
  const sc = examScore(activeExam, progress)

  return (
    <>
      {/* Scrim */}
      {open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 20, background: T.scrim,
        }}/>
      )}
      {/* Panel */}
      <div style={{
        position: 'absolute', left: 8, right: 8, top: 68, zIndex: 25,
        transform: open ? 'translateY(0)' : 'translateY(-120%)',
        opacity: open ? 1 : 0,
        transition: 'transform .32s cubic-bezier(.22,1,.36,1), opacity .22s',
        pointerEvents: open ? 'auto' : 'none',
      }}>
        <div style={{
          background: T.bgCard, borderRadius: 22, border: `1px solid ${T.border}`,
          boxShadow: '0 24px 48px -24px rgba(48,43,37,.55)',
          overflow: 'hidden', maxHeight: 572, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ overflowY: 'auto', padding: '16px 14px' }}>

            {/* Seccion: EXAMEN */}
            <div style={{ padding: '0 4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Eyebrow>Examen</Eyebrow>
              <span style={{ fontSize: 10.5, color: T.textMuted }}>3 disponibles</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {EXAMS.map(ex => {
                const Icon   = ICONS[ex.id]
                const sc2    = examScore(ex, progress)
                const active = ex.id === activeId
                return (
                  <button key={ex.id} onClick={() => { setActiveId(ex.id); onClose() }}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 12px', borderRadius: 14,
                      background: active ? T.oliveLt : 'transparent',
                      border: `1.5px solid ${active ? T.olive : 'transparent'}`,
                    }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 11,
                      background: active ? '#fff' : T.bgMuted,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={20} stroke={active ? T.oliveDk : T.textSub} sw={1.6}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700, color: active ? T.oliveDk : T.text, letterSpacing: '-.01em' }}>{ex.name}</p>
                      <p style={{ fontSize: 11, color: T.textSub, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.short}</p>
                    </div>
                    {active
                      ? <span style={{ width: 22, height: 22, borderRadius: '50%', background: T.olive, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconCheck size={13} stroke="#fff"/>
                        </span>
                      : <span style={{ fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 700, color: T.textMuted }}>{sc2.pct}%</span>
                    }
                  </button>
                )
              })}
            </div>

            <div style={{ height: 1, background: T.borderSoft, margin: '14px 4px' }}/>

            {/* Seccion: PUNTUACION */}
            <div style={{ padding: '0 4px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Eyebrow>Mi puntuacion</Eyebrow>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: activeExam.color, background: activeExam.tint, padding: '2px 8px', borderRadius: 999 }}>{activeExam.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 6px 6px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ring pct={sc.acc} color={activeExam.color} size={58} sw={5}/>
                <span style={{ position: 'absolute', fontFamily: T.fontDisplay, fontSize: 15, fontWeight: 800, color: activeExam.color }}>
                  {sc.acc}<span style={{ fontSize: 9 }}>%</span>
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                {[
                  { l: 'Respondidas', v: sc.answered, c: T.text },
                  { l: 'Correctas',   v: sc.correct,  c: activeExam.color },
                  { l: 'Nivel',       v: sc.level,    c: T.accent, small: true },
                ].map(s => (
                  <div key={s.l} style={{ flex: 1, background: T.bg, borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
                    <p style={{ fontFamily: T.fontDisplay, fontSize: s.small ? 11 : 18, fontWeight: 800, color: s.c, lineHeight: 1.1 }}>{s.v}</p>
                    <p style={{ fontSize: 9, color: T.textSub, marginTop: 3 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Desglose por area */}
            <div style={{ marginTop: 8, padding: '10px 12px', background: T.bg, borderRadius: 13, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {activeExam.areas.map(a => {
                const Icon = ICONS[a.id]
                const st   = areaStats(a.id, progress)
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Icon size={15} stroke={activeExam.color} sw={1.6}/>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 11, fontWeight: 600, color: T.textSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
                    <div style={{ width: 64, height: 5, borderRadius: 5, background: T.bgMuted, overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ height: '100%', width: `${st.pct}%`, background: activeExam.color, borderRadius: 5 }}/>
                    </div>
                    <span style={{ fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 800, color: activeExam.color, width: 30, textAlign: 'right', flexShrink: 0 }}>{st.pct}%</span>
                  </div>
                )
              })}
            </div>

            <div style={{ height: 1, background: T.borderSoft, margin: '14px 4px' }}/>

            {/* Seccion: AJUSTES */}
            <div style={{ padding: '0 4px 4px' }}><Eyebrow>Ajustes</Eyebrow></div>
            {/* Meta diaria */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: T.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.oliveDk, flexShrink: 0 }}>
                <IconTarget size={18} stroke={T.oliveDk} sw={1.6}/>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Meta diaria</p>
                <p style={{ fontSize: 10.5, color: T.textSub, marginTop: 1 }}>{dailyGoal} preguntas al dia</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setDailyGoal(g => Math.max(5, g - 5))} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textSub, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>–</button>
                <span style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 800, color: T.text, width: 22, textAlign: 'center' }}>{dailyGoal}</span>
                <button onClick={() => setDailyGoal(g => Math.min(60, g + 5))} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textSub, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>+</button>
              </div>
            </div>
            {/* Recordatorios */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: T.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBell size={18} stroke={T.oliveDk} sw={1.6}/>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Recordatorios</p>
                <p style={{ fontSize: 10.5, color: T.textSub, marginTop: 1 }}>Aviso diario de estudio</p>
              </div>
              <Toggle on={remindersOn} onClick={() => setRemindersOn(v => !v)}/>
            </div>
            {/* Tutor IA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: T.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconSpark size={18} stroke={T.oliveDk} sw={1.6}/>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Tutor IA</p>
                <p style={{ fontSize: 10.5, color: T.textSub, marginTop: 1 }}>Explicaciones ampliadas</p>
              </div>
              <Toggle on={tutorOn} onClick={() => setTutorOn(v => !v)}/>
            </div>
            {/* Cerrar sesion */}
            <button onClick={onLogout} style={{
              width: '100%', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px', borderRadius: 13, background: 'transparent',
              border: `1.5px solid ${T.border}`, color: T.wrong,
              fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>
              <IconLogout size={17} stroke={T.wrong}/> Cerrar sesion
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Screen: Home (exam-driven) ────────────────────────────────────────────────
function HomeScreen({
  user, activeExamId, setActiveExamId, streak, progress,
  freeUsed, isPremium, onArea, onProgress, onLogout,
  dailyGoal, setDailyGoal, remindersOn, setRemindersOn, tutorOn, setTutorOn,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const activeExam  = EXAMS.find(e => e.id === activeExamId) || EXAMS[0]
  const ActiveIcon  = ICONS[activeExam.id]
  const sc          = examScore(activeExam, progress)

  // Area con menor pct (para "Continua donde quedaste")
  const areasWithStats = activeExam.areas.map(a => ({ ...a, ...areaStats(a.id, progress) }))
  const lowestArea     = areasWithStats.reduce((min, a) => a.pct < min.pct ? a : min, areasWithStats[0])
  const LowestIcon     = ICONS[lowestArea.id]

  // Saludo por hora
  const hour  = new Date().getHours()
  const greet = hour < 12 ? 'Buenos dias' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <Shell>
      <DropdownMenu
        open={menuOpen} onClose={() => setMenuOpen(false)}
        activeId={activeExamId} setActiveId={setActiveExamId}
        streak={streak} progress={progress}
        dailyGoal={dailyGoal} setDailyGoal={setDailyGoal}
        remindersOn={remindersOn} setRemindersOn={setRemindersOn}
        tutorOn={tutorOn} setTutorOn={setTutorOn}
        onLogout={onLogout}
      />

      {/* Header switcher */}
      <div style={{ padding: '12px 16px 0', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Boton switcher */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 15,
              background: T.bgCard, border: `1px solid ${T.border}`,
              boxShadow: '0 1px 2px rgba(74,67,62,.04)',
              cursor: 'pointer', minHeight: 44,
            }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: activeExam.tint,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ActiveIcon size={18} stroke={activeExam.color} sw={1.6}/>
            </div>
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <Eyebrow color={T.accent}>Estudiando</Eyebrow>
              <p style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: '-.01em', marginTop: 1 }}>{activeExam.name}</p>
            </div>
            <span style={{ color: T.textMuted, transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .25s', display: 'flex' }}>
              <IconChevron size={18} stroke={T.textMuted}/>
            </span>
          </button>
          {/* Racha */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px',
            borderRadius: 999, background: T.streakBg, border: `1px solid ${T.border}`, flexShrink: 0,
          }}>
            <IconFlame size={15} stroke={T.streak} fill="#F2DFB4" sw={1.5}/>
            <span style={{ fontSize: 13, fontWeight: 800, color: T.streak }}>{streak}</span>
          </div>
        </div>
      </div>

      {/* Contenido scrolleable (blur cuando menu abierto) */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '18px 18px 24px',
        filter: menuOpen ? 'blur(1.5px)' : 'none',
        transition: 'filter .25s', pointerEvents: menuOpen ? 'none' : 'auto',
      }}>
        {/* Saludo */}
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: T.accent }}>
          {greet}
        </p>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', marginTop: 6, lineHeight: 1.1 }}>
          {user.name}.
        </h1>
        <p style={{ fontSize: 13, color: T.textSub, marginTop: 8, lineHeight: 1.5 }}>
          Vas <strong style={{ color: activeExam.color }}>{sc.acc}% de aciertos</strong> en {activeExam.name}.
        </p>

        {/* Tarjeta "Continua donde quedaste" */}
        <div style={{ marginTop: 18, padding: '16px', borderRadius: 20, background: T.oliveLt, border: `1px solid ${T.correctBd}` }}>
          <Eyebrow color={T.oliveDk}>Continua donde quedaste</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13, background: activeExam.tint,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <LowestIcon size={22} stroke={activeExam.color} sw={1.6}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: '-.01em' }}>{lowestArea.name}</p>
              <p style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>
                {lowestArea.correct}/{lowestArea.total} correctas · {lowestArea.pct}%
              </p>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ring pct={lowestArea.pct} color={activeExam.color} size={50} sw={4} track={T.correctBg}/>
              <span style={{ position: 'absolute', fontFamily: T.fontDisplay, fontSize: 11, fontWeight: 800, color: activeExam.color }}>{lowestArea.pct}%</span>
            </div>
          </div>
          <button onClick={() => onArea(lowestArea)} style={{
            marginTop: 14, width: '100%', padding: '12px', borderRadius: 13,
            background: T.olive, color: '#fff', border: 'none',
            fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer',
          }}>
            Reanudar practica <IconArrowRight size={16} stroke="#fff"/>
          </button>
        </div>

        {/* Lista de areas */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Eyebrow color={T.textMuted}>Areas de {activeExam.name}</Eyebrow>
            <span style={{ fontSize: 10.5, color: T.textSub }}>{activeExam.areas.length} areas</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {activeExam.areas.map(a => {
              const Icon   = ICONS[a.id]
              const st     = areaStats(a.id, progress)
              const used   = freeUsed[a.id] || 0
              const locked = used >= FREE_LIMIT && !isPremium
              const free   = !locked && used < FREE_LIMIT
              return (
                <div key={a.id} onClick={() => onArea(a)}
                  style={{
                    background: T.bgCard, border: `1px solid ${T.border}`,
                    borderRadius: 15, padding: '14px 15px', cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(74,67,62,.04)',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 11, background: activeExam.tint,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={20} stroke={activeExam.color} sw={1.6}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>{a.name}</p>
                      <p style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{st.correct}/{st.total} correctas</p>
                    </div>
                    {locked
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '4px 10px', borderRadius: 999, background: T.streakBg, color: T.accent, fontWeight: 700, flexShrink: 0 }}>
                          <IconLock size={12} stroke={T.accent}/> Premium
                        </span>
                      : <span style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 800, color: activeExam.color, flexShrink: 0 }}>{st.pct}%</span>
                    }
                  </div>
                  <Bar value={st.answered} max={st.total} color={locked ? T.textMuted : activeExam.color}/>
                  {free && (
                    <p style={{ fontSize: 10.5, color: T.accent, marginTop: 7, fontWeight: 600 }}>
                      {FREE_LIMIT - used} preguntas gratis restantes
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Progreso completo */}
        <button onClick={onProgress} style={{
          marginTop: 16, width: '100%', padding: '14px', borderRadius: 14,
          background: 'transparent', border: `1.5px solid ${T.border}`,
          color: T.oliveDk, fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
        }}>
          <IconChart size={17} stroke={T.oliveDk} sw={1.7}/> Ver mi progreso completo
        </button>
      </div>
    </Shell>
  )
}

// ── Screen: Question ──────────────────────────────────────────────────────────
function QuestionScreen({ area, exam, qIndex, questions, streak, aiKey, onAnswer, onNext, onQuit }) {
  const [sel,       setSel]       = useState(null)
  const [answered,  setAnswered]  = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText,    setAiText]    = useState(null)

  const q = questions[qIndex]
  if (!q) return null
  const isCorrect = answered && sel === q.ans
  const AreaIcon  = ICONS[area.id]

  function choose(idx) {
    if (answered) return
    setSel(idx)
    setAnswered(true)
    onAnswer(idx === q.ans)
  }

  async function callTutor() {
    setAiLoading(true); setAiText(null)
    try {
      const res  = await fetch('/api/tutor', {
        method: 'POST',
        headers: { ...(aiKey && { 'x-api-key': aiKey }), 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 280,
          messages: [{ role: 'user', content: `Explica en 3-4 oraciones claras en espanol por que la respuesta correcta es "${q.opts[q.ans]}" para esta pregunta de examen CENEVAL.\n\nPregunta: ${q.q}\nOpciones: ${q.opts.map((o, i) => `${i + 1}. ${o}`).join(', ')}\nContexto: ${q.exp}` }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data))
      setAiText(data.content?.[0]?.text || 'Sin respuesta del tutor.')
    } catch(e) { setAiText('Error: ' + (e.message || 'conexion con el Tutor IA.')) }
    setAiLoading(false)
  }

  function advance() { setSel(null); setAnswered(false); setAiText(null); onNext() }

  return (
    <Shell>
      {/* Top bar */}
      <div style={{ padding: '14px 18px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onQuit} style={{ background: 'none', border: 'none', color: T.textMuted, display: 'flex', padding: 0, minHeight: 44, alignItems: 'center' }}>
          <IconX size={20} stroke={T.textMuted}/>
        </button>
        <div style={{ flex: 1, height: 6, borderRadius: 6, background: T.bgMuted, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((qIndex + (answered ? 1 : 0)) / questions.length) * 100}%`, background: exam.color, borderRadius: 6, transition: 'width .35s' }}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.streak }}>
          <IconFlame size={14} stroke={T.streak} fill="#F2DFB4" sw={1.5}/>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: T.streak }}>{streak}</span>
        </div>
      </div>

      {/* Area pill */}
      <div style={{ padding: '4px 18px 14px', display: 'flex', alignItems: 'center', gap: 7 }}>
        {AreaIcon && <AreaIcon size={15} stroke={T.oliveDk} sw={1.7}/>}
        <Eyebrow color={T.oliveDk}>{area.name} · {qIndex + 1}/{questions.length}</Eyebrow>
      </div>

      {/* Cuerpo */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 16px' }}>
        <p style={{ fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 600, lineHeight: 1.55, letterSpacing: '-.01em', color: T.text, marginBottom: 20 }}>
          {q.q}
        </p>

        {/* Opciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((opt, idx) => {
            const correct = answered && idx === q.ans
            const wrong   = answered && idx === sel && idx !== q.ans
            return (
              <button key={idx} onClick={() => choose(idx)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 15px', borderRadius: 14, cursor: answered ? 'default' : 'pointer',
                background: correct ? T.correctBg : wrong ? T.wrongBg : T.bgCard,
                border: `1.5px solid ${correct ? T.correctBd : wrong ? T.wrongBd : T.border}`,
                transition: 'all .2s',
              }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: correct ? T.olive : wrong ? T.wrong : T.bgMuted,
                  color: correct || wrong ? '#fff' : T.textSub,
                  fontSize: 11.5, fontWeight: 800,
                }}>
                  {correct ? <IconCheck size={14} stroke="#fff"/> : ['A','B','C','D'][idx]}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: correct ? T.oliveDk : wrong ? T.wrong : T.text, textAlign: 'left', lineHeight: 1.45 }}>{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div style={{
            marginTop: 16, padding: '14px 15px', borderRadius: 14,
            background: isCorrect ? T.correctBg : T.wrongBg,
            border: `1px solid ${isCorrect ? T.correctBd : T.wrongBd}`,
          }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 800, color: isCorrect ? T.oliveDk : T.wrong }}>
              {isCorrect ? <IconCheck size={15} stroke={T.oliveDk}/> : <IconX size={15} stroke={T.wrong}/>}
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </p>
            <p style={{ fontSize: 12.5, color: T.textSub, marginTop: 6, lineHeight: 1.6 }}>{q.exp}</p>
            <button onClick={callTutor} disabled={aiLoading} style={{
              marginTop: 11, display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 13px', borderRadius: 10, background: T.bgCard,
              border: `1px solid ${T.border}`, fontSize: 12, fontWeight: 600,
              color: T.oliveDk, cursor: aiLoading ? 'wait' : 'pointer',
            }}>
              <IconSpark size={15} stroke={T.oliveDk} fill="#EAD9A8" sw={1.5}/>
              {aiLoading ? 'Consultando tutor...' : 'Pidele mas al Tutor IA'}
            </button>
            {aiText && (
              <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: T.bgCard, fontSize: 12.5, color: T.text, lineHeight: 1.65 }}>
                <strong style={{ color: T.olive }}>Tutor IA: </strong>{aiText}
              </div>
            )}
          </div>
        )}
        <div style={{ height: 16 }}/>
      </div>

      {/* Siguiente */}
      {answered && (
        <div style={{ padding: '8px 18px 24px', borderTop: `1px solid ${T.borderSoft}` }}>
          <button onClick={advance} style={{
            width: '100%', padding: '14px', borderRadius: 14, border: 'none',
            background: T.olive, color: '#fff',
            fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          }}>
            {qIndex + 1 >= questions.length ? 'Ver resultados' : 'Siguiente'}
            <IconArrowRight size={17} stroke="#fff"/>
          </button>
        </div>
      )}
    </Shell>
  )
}

// ── Screen: Result ────────────────────────────────────────────────────────────
function ResultScreen({ area, exam, answers, total, streak, onRetry, onHome }) {
  const correct = answers.filter(Boolean).length
  const pct     = Math.round((correct / Math.max(1, total)) * 100)
  const passed  = pct >= 70

  return (
    <Shell>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Eyebrow color={T.accent}>Resultado · {area.name}</Eyebrow>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: 25, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12, textAlign: 'center', lineHeight: 1.12 }}>
          {passed ? '¡Excelente trabajo!' : 'Sigue practicando'}
        </h1>

        {/* Ring grande */}
        <div style={{ position: 'relative', margin: '26px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ring pct={pct} color={passed ? T.olive : T.wrong} size={150} sw={8} track={T.border}/>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <p style={{ fontFamily: T.fontDisplay, fontSize: 42, fontWeight: 800, color: passed ? T.oliveDk : T.wrong, letterSpacing: '-.02em', lineHeight: 1 }}>{pct}%</p>
            <p style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>{correct} de {total}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ width: '100%', display: 'flex', gap: 10, marginTop: 22 }}>
          {[
            { l: 'Correctas',   v: correct,         c: T.oliveDk, bg: T.correctBg },
            { l: 'Incorrectas', v: total - correct,  c: T.wrong,   bg: T.wrongBg   },
            { l: 'Racha',       v: streak,           c: T.accent,  bg: T.streakBg  },
          ].map(s => (
            <div key={s.l} style={{ flex: 1, background: s.bg, borderRadius: 15, padding: '16px 8px', textAlign: 'center' }}>
              <p style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 800, color: s.c }}>{s.v}</p>
              <p style={{ fontSize: 10.5, color: T.textSub, marginTop: 3 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Aliento */}
        <div style={{ width: '100%', marginTop: 16, padding: '14px 16px', borderRadius: 15, background: T.bgCard, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: T.streakBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconSpark size={19} stroke={T.accent} fill="#EAD9A8" sw={1.5}/>
          </div>
          <p style={{ fontSize: 12.5, color: T.textSub, lineHeight: 1.5 }}>
            {passed ? 'Superaste el 70%. ¡Excelente dominio del tema!' : 'Sigue practicando — cada pregunta te acerca mas al objetivo.'}
          </p>
        </div>
      </div>

      {/* Botones */}
      <div style={{ padding: '10px 20px 24px', borderTop: `1px solid ${T.borderSoft}`, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button onClick={onRetry} style={{
          width: '100%', padding: '14px', borderRadius: 14, border: 'none',
          background: T.olive, color: '#fff',
          fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}>Practicar de nuevo</button>
        <button onClick={onHome} style={{
          width: '100%', padding: '13px', borderRadius: 14,
          border: `1.5px solid ${T.border}`, background: 'transparent',
          color: T.textSub, fontFamily: T.fontDisplay, fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
        }}>Ir al inicio</button>
      </div>
    </Shell>
  )
}

// ── Screen: Paywall ───────────────────────────────────────────────────────────
const PLANS = [
  { id: 'annual',    label: 'Anual',      price: '$99',  tag: 'Mas popular', savings: 'Ahorras 50%' },
  { id: 'quarterly', label: 'Trimestral', price: '$149', tag: null,          savings: 'Ahorras 25%' },
  { id: 'monthly',   label: 'Mensual',    price: '$199', tag: null,          savings: null           },
]

function PaywallScreen({ onUnlock, onBack }) {
  const [sel, setSel] = useState('annual')
  return (
    <Shell>
      <div style={{ padding: '36px 20px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: T.streakBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <IconLock size={28} stroke={T.accent} fill={T.accentLt}/>
          </div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>Acceso ilimitado</h2>
          <p style={{ color: T.textSub, marginTop: 8, fontSize: 14, lineHeight: 1.65 }}>
            Agotaste tus {FREE_LIMIT} preguntas gratuitas. Desbloquea acceso completo.
          </p>
        </div>

        <div style={{ background: T.oliveLt, borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            'Preguntas ilimitadas en todas las areas',
            'Tutor IA sin restricciones',
            'Historial completo de progreso',
            'Acceso a los 3 examenes CENEVAL',
          ].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconCheck size={15} stroke={T.oliveDk}/>
              <p style={{ fontSize: 13.5, color: T.oliveDk, fontWeight: 500 }}>{b}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PLANS.map(plan => (
            <div key={plan.id} onClick={() => setSel(plan.id)} style={{
              border: `2px solid ${sel === plan.id ? T.olive : T.border}`,
              background: sel === plan.id ? T.oliveLt : T.bgCard,
              borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 15, color: T.text }}>{plan.label}</span>
                  {plan.tag && <span style={{ fontSize: 10.5, background: T.olive, color: '#fff', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>{plan.tag}</span>}
                </div>
                {plan.savings && <p style={{ fontSize: 12, color: T.olive, marginTop: 2, fontWeight: 600 }}>{plan.savings}</p>}
              </div>
              <div>
                <span style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 900, color: sel === plan.id ? T.olive : T.text }}>{plan.price}</span>
                <span style={{ fontSize: 12, color: T.textSub }}>/mes</span>
              </div>
            </div>
          ))}
        </div>

        <Btn onClick={() => onUnlock(sel)} style={{ width: '100%' }}>Suscribirme ahora</Btn>
        <Btn onClick={onBack} variant="ghost" style={{ width: '100%' }}>Volver</Btn>
      </div>
    </Shell>
  )
}

// ── Screen: Progress ──────────────────────────────────────────────────────────
function ProgressScreen({ progress, streak, onBack }) {
  const allAreas = EXAMS.flatMap(e => e.areas.map(a => ({ ...a, examColor: e.color, examName: e.name, examTint: e.tint })))
  const totAns   = Object.values(progress).reduce((s, v) => s + (v.answered || 0), 0)
  const totOk    = Object.values(progress).reduce((s, v) => s + (v.correct  || 0), 0)
  const pct      = totAns > 0 ? Math.round((totOk / totAns) * 100) : 0

  return (
    <Shell>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <button onClick={onBack} style={{
            width: 38, height: 38, borderRadius: 12, border: `1px solid ${T.border}`,
            background: T.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <IconArrowLeft size={18} stroke={T.textSub}/>
          </button>
          <LogoMini height={20} style={{ opacity: 0.85 }}/>
        </div>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Mi progreso</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
        {/* Summary */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { label: 'Respondidas', val: totAns,    color: T.text  },
            { label: 'Correctas',   val: totOk,     color: T.olive },
            { label: 'Precision',   val: `${pct}%`, color: T.accent },
            { label: 'Racha',       val: streak,    color: T.streak },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 13, padding: '12px 6px', textAlign: 'center' }}>
              <p style={{ fontFamily: T.fontDisplay, fontSize: 17, fontWeight: 900, color: s.color }}>{s.val}</p>
              <p style={{ fontSize: 9.5, color: T.textMuted, marginTop: 3, lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <Eyebrow color={T.textMuted} style={{ marginBottom: 10 }}>Por area</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {allAreas.map(area => {
            const Icon  = ICONS[area.id]
            const ap    = progress[area.id] || { answered: 0, correct: 0 }
            const total = QUESTIONS[area.id]?.length || 1
            const apct  = Math.round((ap.answered / total) * 100)
            return (
              <div key={area.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: area.examTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {Icon && <Icon size={18} stroke={area.examColor} sw={1.6}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{area.name}</p>
                    <p style={{ fontSize: 10.5, color: T.textSub }}>{area.examName} · {ap.correct}/{total} correctas</p>
                  </div>
                  <span style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 800, color: area.examColor }}>{apct}%</span>
                </div>
                <Bar value={ap.answered} max={total} color={area.examColor}/>
              </div>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const { isSignedIn, user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()

  const [screen,      setScreen]      = useState('home')
  const [activeExamId,setActiveExamId]= useState(() => load('cp_activeExam', EXAMS[0].id))
  const [exam,        setExam]        = useState(null)
  const [area,        setArea]        = useState(null)
  const [qIdx,        setQIdx]        = useState(0)
  const [answers,     setAnswers]     = useState([])
  const [progress,    setProgress]    = useState(() => load('cp_progress', {}))
  const [freeUsed,    setFreeUsed]    = useState(() => load('cp_free', {}))
  const [isPremium,   setIsPremium]   = useState(() => load('cp_premium', false))
  const [streak,      setStreak]      = useState(() => { const s = load('cp_streak', { count: 0, date: '' }); return s.count })
  const [dailyGoal,   setDailyGoal]   = useState(() => load('cp_goal', 10))
  const [remindersOn, setRemindersOn] = useState(() => load('cp_reminders', false))
  const [tutorOn,     setTutorOn]     = useState(() => load('cp_tutor', true))

  const aiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  const appUser = isSignedIn ? {
    name:  clerkUser?.firstName || clerkUser?.fullName?.split(' ')[0] || 'Usuario',
    email: clerkUser?.primaryEmailAddress?.emailAddress || '',
  } : null

  const bumpStreak = useCallback(() => {
    const t = today()
    const s = load('cp_streak', { count: 0, date: '' })
    if (s.date === t) return
    const prev = new Date(); prev.setDate(prev.getDate() - 1)
    const newCount = s.date === prev.toISOString().split('T')[0] ? s.count + 1 : 1
    save('cp_streak', { count: newCount, date: t })
    setStreak(newCount)
  }, [])

  function handleSetActiveExamId(id) { setActiveExamId(id); save('cp_activeExam', id) }
  function handleSetDailyGoal(fn)    { setDailyGoal(prev => { const n = typeof fn === 'function' ? fn(prev) : fn; save('cp_goal', n); return n }) }
  function handleSetReminders(fn)    { setRemindersOn(prev => { const n = typeof fn === 'function' ? fn(prev) : fn; save('cp_reminders', n); return n }) }
  function handleSetTutor(fn)        { setTutorOn(prev => { const n = typeof fn === 'function' ? fn(prev) : fn; save('cp_tutor', n); return n }) }

  function logout() { signOut() }

  function selectArea(a) {
    const ex   = EXAMS.find(e => e.areas.some(ar => ar.id === a.id)) || EXAMS[0]
    const used = freeUsed[a.id] || 0
    if (used >= FREE_LIMIT && !isPremium) { setArea(a); setExam(ex); setScreen('paywall'); return }
    const qs = QUESTIONS[a.id] || []
    if (!qs.length) return
    setArea(a); setExam(ex); setQIdx(0); setAnswers([]); bumpStreak(); setScreen('question')
  }

  function recordAnswer(isOk) {
    setAnswers(prev => [...prev, isOk])
    const nf = { ...freeUsed, [area.id]: (freeUsed[area.id] || 0) + 1 }
    setFreeUsed(nf); save('cp_free', nf)
    const prev = progress[area.id] || { answered: 0, correct: 0 }
    const np   = { ...progress, [area.id]: { answered: prev.answered + 1, correct: prev.correct + (isOk ? 1 : 0) } }
    setProgress(np); save('cp_progress', np)
  }

  function nextQuestion() {
    const qs   = QUESTIONS[area.id] || []
    const next = qIdx + 1
    const used = freeUsed[area.id] || 0
    if (used >= FREE_LIMIT && !isPremium) { setScreen('paywall'); return }
    if (next >= qs.length)                { setScreen('result');  return }
    setQIdx(next)
  }

  function unlock(planId) {
    save('cp_premium', true); setIsPremium(true)
    alert(`¡Gracias por suscribirte al plan ${planId}! (Demo: acceso desbloqueado)`)
    if (area) selectArea(area)
  }

  const qs = area ? (QUESTIONS[area.id] || []) : []

  // Cargando Clerk
  if (!isLoaded) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: G }} />
      <Shell>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: T.textSub, fontSize: 15 }}>Cargando...</p>
        </div>
      </Shell>
    </>
  )

  // Login con Google via Clerk
  if (!isSignedIn) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: G }} />
      <Shell>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 32 }}>
          <img src="/certus-logo.svg" alt="Certus" style={{ width: '85%', maxWidth: 300 }} />
          <SignIn routing="hash" appearance={{
            variables: {
              colorPrimary: T.olive, colorBackground: T.bgCard,
              colorText: T.text, colorTextSecondary: T.textSub,
              colorInputBackground: T.bg, colorInputText: T.text,
              colorNeutral: T.text, borderRadius: '12px',
              fontFamily: T.fontBody, fontSize: '15px',
            },
            elements: {
              card: { boxShadow: 'none', border: `1.5px solid ${T.border}`, borderRadius: '16px', padding: '24px', background: T.bgCard },
              headerTitle: { display: 'none' }, headerSubtitle: { display: 'none' },
              socialButtonsBlockButton: { border: `1.5px solid ${T.border}`, borderRadius: '10px', background: T.bg, color: T.text, fontWeight: '600' },
              footer: { display: 'none' },
              dividerLine: { background: T.border }, dividerText: { color: T.textMuted },
            },
          }}/>
        </div>
      </Shell>
    </>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: G }} />

      {screen === 'home' && appUser && (
        <HomeScreen
          user={appUser}
          activeExamId={activeExamId} setActiveExamId={handleSetActiveExamId}
          streak={streak} progress={progress} freeUsed={freeUsed} isPremium={isPremium}
          onArea={selectArea} onProgress={() => setScreen('progress')} onLogout={logout}
          dailyGoal={dailyGoal} setDailyGoal={handleSetDailyGoal}
          remindersOn={remindersOn} setRemindersOn={handleSetReminders}
          tutorOn={tutorOn} setTutorOn={handleSetTutor}
        />
      )}

      {screen === 'question' && area && qs.length > 0 && (
        <QuestionScreen
          area={area} exam={exam} qIndex={qIdx} questions={qs}
          streak={streak} aiKey={aiKey}
          onAnswer={recordAnswer} onNext={nextQuestion}
          onQuit={() => setScreen('home')}
        />
      )}

      {screen === 'result' && area && (
        <ResultScreen
          area={area} exam={exam} answers={answers} total={qs.length} streak={streak}
          onRetry={() => selectArea(area)} onHome={() => setScreen('home')}
        />
      )}

      {screen === 'paywall' && (
        <PaywallScreen onUnlock={unlock} onBack={() => setScreen('home')}/>
      )}

      {screen === 'progress' && (
        <ProgressScreen progress={progress} streak={streak} onBack={() => setScreen('home')}/>
      )}
    </>
  )
}
