import { useState, useEffect, useCallback } from 'react'
import { T } from './constants/theme'
import { EXAMS } from './constants/exams'
import { QUESTIONS } from './data/questions'

const FREE_LIMIT = 3

// ── Storage helpers ──────────────────────────────────────────────────────────
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }
function today() { return new Date().toISOString().split('T')[0] }

// ── Global CSS injected once ─────────────────────────────────────────────────
const G = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: ${T.bg}; font-family: ${T.fontBody}; color: ${T.text}; -webkit-font-smoothing: antialiased; }
  #root { display: flex; justify-content: center; min-height: 100vh; }
  button { cursor: pointer; font-family: inherit; }
  input { font-family: inherit; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${T.borderDk}; border-radius: 4px; }
`

// ── Reusable primitives ──────────────────────────────────────────────────────
function Shell({ children, style }) {
  return (
    <div style={{
      width: '100%', maxWidth: 480, minHeight: '100vh',
      background: T.bg, display: 'flex', flexDirection: 'column',
      overflowX: 'hidden', ...style,
    }}>
      {children}
    </div>
  )
}

function Btn({ children, onClick, variant = 'primary', disabled, style }) {
  const base = {
    padding: '14px 20px', borderRadius: 14, border: 'none',
    fontWeight: 700, fontSize: 15, transition: 'opacity .15s, transform .1s',
    opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
    letterSpacing: '.01em',
  }
  const v = {
    primary:   { background: T.olive,   color: '#fff' },
    secondary: { background: T.bgMuted, color: T.text },
    ghost:     { background: 'transparent', color: T.textSub, border: `1.5px solid ${T.border}` },
  }
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...v[variant], ...style }}>{children}</button>
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${T.border}`,
          background: T.bgCard, fontSize: 15, color: T.text, outline: 'none',
          transition: 'border-color .2s',
        }}
        onFocus={e => e.target.style.borderColor = T.olive}
        onBlur={e => e.target.style.borderColor = T.border}
      />
    </label>
  )
}

function Bar({ value, max, color = T.olive }) {
  return (
    <div style={{ height: 8, borderRadius: 8, background: T.bgMuted, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 8, background: color,
        width: `${Math.min(100, (value / Math.max(1, max)) * 100)}%`,
        transition: 'width .35s ease',
      }} />
    </div>
  )
}

function StreakBadge({ n }) {
  return (
    <div style={{
      background: T.streakBg, borderRadius: 20, padding: '5px 11px',
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <span style={{ fontSize: 15 }}>🔥</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: T.streak }}>{n}</span>
    </div>
  )
}

// ── Screen: Login ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onReg }) {
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [err, setErr]     = useState('')

  function submit() {
    const users = load('cp_users', {})
    if (!users[email])           { setErr('Usuario no encontrado.'); return }
    if (users[email].pw !== pass) { setErr('Contraseña incorrecta.'); return }
    onLogin({ email, name: users[email].name })
  }

  return (
    <Shell>
      <div style={{ padding: '56px 24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, lineHeight: 1.1, color: T.olive, letterSpacing: '-0.5px' }}>Certus</h1>
          <p style={{ color: T.textSub, marginTop: 6, fontSize: 15, fontStyle: 'italic' }}>Prepárate con confianza</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Correo" value={email} onChange={setEmail} type="email" placeholder="correo@ejemplo.com" />
          <Field label="Contraseña" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
          {err && <p style={{ color: T.wrong, fontSize: 13 }}>{err}</p>}
          <Btn onClick={submit} style={{ width: '100%', marginTop: 4 }}>Iniciar sesión</Btn>
        </div>
        <p style={{ textAlign: 'center', color: T.textSub, fontSize: 14 }}>
          ¿Sin cuenta?{' '}
          <span onClick={onReg} style={{ color: T.olive, fontWeight: 700, cursor: 'pointer' }}>Regístrate gratis</span>
        </p>
      </div>
    </Shell>
  )
}

// ── Screen: Register ─────────────────────────────────────────────────────────
function RegisterScreen({ onReg, onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [err, setErr]     = useState('')

  function submit() {
    if (!name.trim() || !email.trim() || !pass.trim()) { setErr('Completa todos los campos.'); return }
    if (pass.length < 6) { setErr('Mínimo 6 caracteres en contraseña.'); return }
    const users = load('cp_users', {})
    if (users[email]) { setErr('Ese correo ya está registrado.'); return }
    users[email] = { name: name.trim(), pw: pass }
    save('cp_users', users)
    onReg({ email, name: name.trim() })
  }

  return (
    <Shell>
      <div style={{ padding: '56px 24px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: 26 }}>Crear cuenta</h1>
          <p style={{ color: T.textSub, marginTop: 8, fontSize: 15 }}>Empieza a prepararte hoy</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Nombre" value={name} onChange={setName} placeholder="Tu nombre" />
          <Field label="Correo" value={email} onChange={setEmail} type="email" placeholder="correo@ejemplo.com" />
          <Field label="Contraseña" value={pass} onChange={setPass} type="password" placeholder="Mín. 6 caracteres" />
          {err && <p style={{ color: T.wrong, fontSize: 13 }}>{err}</p>}
          <Btn onClick={submit} style={{ width: '100%', marginTop: 4 }}>Crear cuenta</Btn>
        </div>
        <p style={{ textAlign: 'center', color: T.textSub, fontSize: 14 }}>
          ¿Ya tienes cuenta?{' '}
          <span onClick={onLogin} style={{ color: T.olive, fontWeight: 700, cursor: 'pointer' }}>Inicia sesión</span>
        </p>
      </div>
    </Shell>
  )
}

// ── Screen: Home ─────────────────────────────────────────────────────────────
function HomeScreen({ user, streak, progress, onExam, onProgress, onLogout }) {
  const totalAnswered = Object.values(progress).reduce((s, v) => s + (v.answered || 0), 0)

  return (
    <Shell>
      {/* Header */}
      <div style={{ padding: '24px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, color: T.textSub }}>Hola,</p>
          <h2 style={{ fontSize: 22, fontFamily: T.fontDisplay }}>{user.name} 👋</h2>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 4 }}>
          <StreakBadge n={streak} />
          <span onClick={onLogout} style={{ fontSize: 13, color: T.textMuted, cursor: 'pointer' }}>Salir</span>
        </div>
      </div>

      {/* Mini stat */}
      {totalAnswered > 0 && (
        <div style={{ margin: '0 20px 16px', padding: '10px 14px', background: T.oliveLt, borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: T.oliveDk, fontWeight: 600 }}>
            {totalAnswered} preguntas respondidas en total 🎯
          </p>
        </div>
      )}

      <p style={{ padding: '0 20px 16px', fontSize: 14, color: T.textSub }}>
        Selecciona tu examen
      </p>

      {/* Exam cards */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {EXAMS.map(exam => {
          const examProgress = exam.areas.reduce((s, a) => s + (progress[a.id]?.answered || 0), 0)
          const examTotal    = exam.areas.reduce((s, a) => s + (QUESTIONS[a.id]?.length || 0), 0)
          const pct = examTotal > 0 ? Math.round((examProgress / examTotal) * 100) : 0
          return (
            <div
              key={exam.id} onClick={() => onExam(exam)}
              style={{
                background: T.bgCard, border: `1.5px solid ${T.border}`,
                borderRadius: 18, padding: 18, cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 14, flexShrink: 0,
                  background: exam.colorLight, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 26,
                }}>
                  {exam.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700 }}>{exam.name}</h3>
                    <span style={{ fontSize: 13, fontWeight: 700, color: exam.color }}>{pct}%</span>
                  </div>
                  <p style={{ fontSize: 12, color: T.textSub, marginTop: 3, lineHeight: 1.5 }}>{exam.description}</p>
                  <div style={{ marginTop: 10 }}>
                    <Bar value={examProgress} max={examTotal} color={exam.color} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: 16, marginTop: 4 }}>
        <Btn onClick={onProgress} variant="ghost" style={{ width: '100%' }}>
          📊 Ver mi progreso
        </Btn>
      </div>
    </Shell>
  )
}

// ── Screen: Exam Detail ──────────────────────────────────────────────────────
function ExamDetailScreen({ exam, progress, freeUsed, isPremium, onArea, onBack }) {
  return (
    <Shell>
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{
          background: T.bgMuted, border: 'none', borderRadius: 10,
          width: 36, height: 36, fontSize: 18, color: T.textSub, cursor: 'pointer',
        }}>←</button>
        <div>
          <h2 style={{ fontSize: 20, fontFamily: T.fontDisplay }}>{exam.name}</h2>
          <p style={{ fontSize: 12, color: T.textSub }}>{exam.fullName}</p>
        </div>
      </div>

      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {exam.areas.map(area => {
          const ap      = progress[area.id]  || { answered: 0, correct: 0 }
          const used    = freeUsed[area.id]  || 0
          const total   = QUESTIONS[area.id]?.length || 0
          const locked  = used >= FREE_LIMIT && !isPremium
          const pct     = total > 0 ? Math.round((ap.answered / total) * 100) : 0

          return (
            <div
              key={area.id} onClick={() => onArea(area)}
              style={{
                background: T.bgCard, border: `1.5px solid ${locked ? T.borderDk : T.border}`,
                borderRadius: 14, padding: '16px 16px', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 24 }}>{area.emoji}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{area.name}</p>
                    <p style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>
                      {ap.correct}/{total} correctas
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {locked
                    ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: T.streakBg, color: T.streak, fontWeight: 700 }}>🔒 Premium</span>
                    : <span style={{ fontSize: 13, fontWeight: 700, color: exam.color }}>{pct}%</span>
                  }
                </div>
              </div>
              <Bar value={ap.answered} max={total} color={locked ? T.textMuted : exam.color} />
              {!locked && used < FREE_LIMIT && (
                <p style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>
                  {FREE_LIMIT - used} preguntas gratis restantes
                </p>
              )}
            </div>
          )
        })}
      </div>
    </Shell>
  )
}

// ── Screen: Question ─────────────────────────────────────────────────────────
function QuestionScreen({ area, exam, qIndex, questions, streak, aiKey, onAnswer, onNext, onQuit }) {
  const [sel, setSel]         = useState(null)
  const [answered, setAnswered] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiText, setAiText]   = useState(null)

  const q = questions[qIndex]
  if (!q) return null
  const isCorrect = answered && sel === q.ans
  const isWrong   = answered && sel !== q.ans

  function choose(idx) {
    if (answered) return
    setSel(idx)
    setAnswered(true)
    onAnswer(idx === q.ans)
  }

  async function callTutor() {
    setAiLoading(true)
    setAiText(null)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          ...(aiKey && { 'x-api-key': aiKey }),
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 280,
          messages: [{
            role: 'user',
            content: `Explica en 3-4 oraciones claras en español por qué la respuesta correcta es "${q.opts[q.ans]}" para esta pregunta de examen CENEVAL.\n\nPregunta: ${q.q}\nOpciones: ${q.opts.map((o, i) => `${i + 1}. ${o}`).join(', ')}\nContexto: ${q.exp}`,
          }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data))
      setAiText(data.content?.[0]?.text || 'Sin respuesta del tutor.')
    } catch(e) {
      setAiText('Error: ' + (e.message || 'conexión con el Tutor IA.'))
    }
    setAiLoading(false)
  }

  function advance() {
    setSel(null)
    setAnswered(false)
    setAiText(null)
    onNext()
  }

  function optStyle(idx) {
    let bg = T.bgCard, bd = T.border, col = T.text
    if (answered) {
      if (idx === q.ans)               { bg = T.correctBg; bd = T.correctBd; col = T.correct }
      else if (idx === sel)            { bg = T.wrongBg;   bd = T.wrongBd;   col = T.wrong   }
    } else if (sel === idx) {
      bg = T.oliveLt; bd = T.olive
    }
    return {
      width: '100%', background: bg, border: `2px solid ${bd}`, color: col,
      borderRadius: 12, padding: '13px 15px', cursor: answered ? 'default' : 'pointer',
      fontSize: 14, fontWeight: 500, lineHeight: 1.5, textAlign: 'left',
      transition: 'all .2s', display: 'flex', gap: 8, alignItems: 'flex-start',
    }
  }

  return (
    <Shell>
      {/* Top bar */}
      <div style={{ padding: '16px 18px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onQuit} style={{
          background: 'none', border: 'none', fontSize: 20,
          color: T.textMuted, cursor: 'pointer', padding: 0,
        }}>✕</button>
        <div style={{ flex: 1 }}>
          <Bar value={qIndex + (answered ? 1 : 0)} max={questions.length} color={exam.color} />
        </div>
        <StreakBadge n={streak} />
      </div>

      {/* Area pill */}
      <p style={{ padding: '4px 20px 16px', fontSize: 13, fontWeight: 700, color: exam.color }}>
        {area.emoji} {area.name} · {qIndex + 1}/{questions.length}
      </p>

      {/* Question body */}
      <div style={{ padding: '0 18px', flex: 1, overflowY: 'auto' }}>
        <p style={{
          fontSize: 16, lineHeight: 1.75, fontFamily: T.fontDisplay,
          whiteSpace: 'pre-wrap', color: T.text, marginBottom: 20,
        }}>
          {q.q}
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((opt, idx) => (
            <button key={idx} onClick={() => choose(idx)} style={optStyle(idx)}>
              <span style={{
                fontWeight: 800, fontSize: 13, flexShrink: 0,
                color: answered && idx === q.ans ? T.correct : answered && idx === sel && idx !== q.ans ? T.wrong : T.textMuted,
              }}>
                {['A', 'B', 'C', 'D'][idx]}.
              </span>
              {opt}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {answered && (
          <div style={{
            marginTop: 16, padding: '14px 15px', borderRadius: 14,
            background: isCorrect ? T.correctBg : T.wrongBg,
            border: `1.5px solid ${isCorrect ? T.correctBd : T.wrongBd}`,
          }}>
            <p style={{ fontWeight: 800, fontSize: 15, color: isCorrect ? T.correct : T.wrong }}>
              {isCorrect ? '✓ ¡Correcto!' : '✗ Incorrecto'}
            </p>
            <p style={{ fontSize: 13, color: T.textSub, marginTop: 5, lineHeight: 1.6 }}>{q.exp}</p>

            <button
              onClick={callTutor}
              disabled={aiLoading}
              style={{
                marginTop: 10, background: T.bgCard, border: `1px solid ${T.borderDk}`,
                borderRadius: 8, padding: '8px 13px', fontSize: 12, color: T.textSub,
                cursor: aiLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {aiLoading ? '⏳ Consultando tutor…' : '🤖 Tutor IA — explicar más'}
            </button>

            {aiText && (
              <div style={{
                marginTop: 10, padding: '10px 12px', borderRadius: 10,
                background: T.bgMuted, fontSize: 13, color: T.text, lineHeight: 1.65,
              }}>
                <strong style={{ color: T.olive }}>Tutor IA:</strong> {aiText}
              </div>
            )}
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>

      {/* Next button */}
      {answered && (
        <div style={{ padding: '8px 18px 24px' }}>
          <Btn onClick={advance} style={{ width: '100%' }}>
            {qIndex + 1 >= questions.length ? 'Ver resultados →' : 'Siguiente →'}
          </Btn>
        </div>
      )}
    </Shell>
  )
}

// ── Screen: Result ───────────────────────────────────────────────────────────
function ResultScreen({ area, exam, answers, total, onRetry, onHome }) {
  const correct = answers.filter(Boolean).length
  const pct     = Math.round((correct / Math.max(1, total)) * 100)
  const passed  = pct >= 70

  return (
    <Shell>
      <div style={{ padding: '48px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ fontSize: 60 }}>{passed ? '🎉' : '📚'}</div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26 }}>
            {passed ? '¡Excelente trabajo!' : 'Sigue practicando'}
          </h2>
          <p style={{ color: T.textSub, marginTop: 6, fontSize: 15 }}>{area.name}</p>
        </div>

        {/* Score ring */}
        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          border: `8px solid ${passed ? T.correctBd : T.wrongBd}`,
          background: passed ? T.correctBg : T.wrongBg,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 34, fontWeight: 900, color: passed ? T.correct : T.wrong }}>{pct}%</span>
          <span style={{ fontSize: 12, color: T.textSub }}>{correct}/{total}</span>
        </div>

        {/* Stats row */}
        <div style={{ width: '100%', display: 'flex', gap: 10 }}>
          {[
            { label: 'Correctas',   val: correct,          bg: T.correctBg, col: T.correct },
            { label: 'Incorrectas', val: total - correct,  bg: T.wrongBg,   col: T.wrong   },
            { label: 'Total',       val: total,            bg: T.oliveLt,   col: T.olive   },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: s.bg, borderRadius: 12, padding: '14px 8px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: s.col }}>{s.val}</p>
              <p style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn onClick={onRetry} style={{ width: '100%' }}>Practicar de nuevo</Btn>
          <Btn onClick={onHome} variant="ghost" style={{ width: '100%' }}>Ir al inicio</Btn>
        </div>
      </div>
    </Shell>
  )
}

// ── Screen: Paywall ──────────────────────────────────────────────────────────
const PLANS = [
  { id: 'annual',    label: 'Anual',      price: '$99',  tag: '🏆 Más popular', savings: 'Ahorras 50%' },
  { id: 'quarterly', label: 'Trimestral', price: '$149', tag: null,             savings: 'Ahorras 25%' },
  { id: 'monthly',   label: 'Mensual',    price: '$199', tag: null,             savings: null           },
]

function PaywallScreen({ onUnlock, onBack }) {
  const [sel, setSel] = useState('annual')

  return (
    <Shell>
      <div style={{ padding: '36px 20px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🔓</div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24 }}>Acceso ilimitado</h2>
          <p style={{ color: T.textSub, marginTop: 8, fontSize: 14, lineHeight: 1.65, maxWidth: 320, margin: '8px auto 0' }}>
            Agotaste tus {FREE_LIMIT} preguntas gratuitas en esta área. Desbloquea acceso completo.
          </p>
        </div>

        {/* Benefits */}
        <div style={{ background: T.oliveLt, borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            '✅ Preguntas ilimitadas en todas las áreas',
            '✅ Tutor IA sin restricciones',
            '✅ Historial completo de progreso',
            '✅ Acceso a los 3 exámenes CENEVAL',
          ].map(b => <p key={b} style={{ fontSize: 14, color: T.oliveDk, fontWeight: 500 }}>{b}</p>)}
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PLANS.map(plan => (
            <div
              key={plan.id} onClick={() => setSel(plan.id)}
              style={{
                border: `2px solid ${sel === plan.id ? T.olive : T.border}`,
                background: sel === plan.id ? T.oliveLt : T.bgCard,
                borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all .2s',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{plan.label}</span>
                  {plan.tag && (
                    <span style={{
                      fontSize: 11, background: T.olive, color: '#fff',
                      padding: '2px 8px', borderRadius: 20, fontWeight: 700,
                    }}>{plan.tag}</span>
                  )}
                </div>
                {plan.savings && <p style={{ fontSize: 12, color: T.olive, marginTop: 2, fontWeight: 600 }}>{plan.savings}</p>}
              </div>
              <div>
                <span style={{ fontSize: 24, fontWeight: 900, color: sel === plan.id ? T.olive : T.text }}>{plan.price}</span>
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

// ── Screen: Progress ─────────────────────────────────────────────────────────
function ProgressScreen({ progress, streak, onBack }) {
  const allAreas = EXAMS.flatMap(e => e.areas.map(a => ({ ...a, examColor: e.color, examName: e.name })))
  const totAns  = Object.values(progress).reduce((s, v) => s + (v.answered || 0), 0)
  const totOk   = Object.values(progress).reduce((s, v) => s + (v.correct  || 0), 0)
  const pct     = totAns > 0 ? Math.round((totOk / totAns) * 100) : 0

  return (
    <Shell>
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{
          background: T.bgMuted, border: 'none', borderRadius: 10,
          width: 36, height: 36, fontSize: 18, color: T.textSub, cursor: 'pointer',
        }}>←</button>
        <h2 style={{ fontSize: 20, fontFamily: T.fontDisplay }}>Mi progreso</h2>
      </div>

      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Summary row */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Respondidas', val: totAns,   color: T.olive },
            { label: 'Correctas',   val: totOk,    color: T.correct },
            { label: 'Precisión',   val: `${pct}%`,color: T.streak },
            { label: 'Racha',       val: `🔥${streak}`, color: T.streak },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: T.bgCard, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: '12px 6px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 17, fontWeight: 900, color: s.color }}>{s.val}</p>
              <p style={{ fontSize: 10, color: T.textMuted, marginTop: 2, lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Per area */}
        <h3 style={{ fontSize: 14, fontWeight: 800, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Por área
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allAreas.map(area => {
            const ap    = progress[area.id] || { answered: 0, correct: 0 }
            const total = QUESTIONS[area.id]?.length || 1
            const apct  = total > 0 ? Math.round((ap.answered / total) * 100) : 0
            return (
              <div key={area.id} style={{
                background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{area.emoji} {area.name}</p>
                    <p style={{ fontSize: 11, color: T.textSub }}>{area.examName} · {ap.correct}/{total} correctas</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: area.examColor }}>{apct}%</span>
                </div>
                <Bar value={ap.answered} max={total} color={area.examColor} />
              </div>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}

// ── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,   setScreen]   = useState(() => load('cp_user', null) ? 'home' : 'login')
  const [user,     setUser]     = useState(() => load('cp_user', null))
  const [exam,     setExam]     = useState(null)
  const [area,     setArea]     = useState(null)
  const [qIdx,     setQIdx]     = useState(0)
  const [answers,  setAnswers]  = useState([])
  const [progress, setProgress] = useState(() => load('cp_progress', {}))
  const [freeUsed, setFreeUsed] = useState(() => load('cp_free', {}))
  const [isPremium,setIsPremium]= useState(() => load('cp_premium', false))
  const [streak,   setStreak]   = useState(() => {
    const s = load('cp_streak', { count: 0, date: '' })
    return s.count
  })

  const aiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  const bumpStreak = useCallback(() => {
    const t = today()
    const s = load('cp_streak', { count: 0, date: '' })
    if (s.date === t) return
    const prev = new Date(); prev.setDate(prev.getDate() - 1)
    const newCount = s.date === prev.toISOString().split('T')[0] ? s.count + 1 : 1
    save('cp_streak', { count: newCount, date: t })
    setStreak(newCount)
  }, [])

  // Auth
  function login(u)   { setUser(u); save('cp_user', u); setScreen('home') }
  function logout()   { setUser(null); save('cp_user', null); setScreen('login') }

  // Navigation
  function selectExam(e) { setExam(e); setScreen('examDetail') }

  function selectArea(a) {
    const used = freeUsed[a.id] || 0
    if (used >= FREE_LIMIT && !isPremium) { setArea(a); setScreen('paywall'); return }
    const qs = QUESTIONS[a.id] || []
    if (!qs.length) return
    setArea(a); setQIdx(0); setAnswers([]); bumpStreak(); setScreen('question')
  }

  function recordAnswer(isOk) {
    setAnswers(prev => [...prev, isOk])
    // free counter
    const nf = { ...freeUsed, [area.id]: (freeUsed[area.id] || 0) + 1 }
    setFreeUsed(nf); save('cp_free', nf)
    // progress
    const prev = progress[area.id] || { answered: 0, correct: 0 }
    const np = { ...progress, [area.id]: { answered: prev.answered + 1, correct: prev.correct + (isOk ? 1 : 0) } }
    setProgress(np); save('cp_progress', np)
  }

  function nextQuestion() {
    const qs   = QUESTIONS[area.id] || []
    const next = qIdx + 1
    const used = (freeUsed[area.id] || 0)

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: G }} />

      {screen === 'login'      && <LoginScreen  onLogin={login} onReg={() => setScreen('register')} />}
      {screen === 'register'   && <RegisterScreen onReg={login} onLogin={() => setScreen('login')} />}

      {screen === 'home'       && user && (
        <HomeScreen
          user={user} streak={streak} progress={progress}
          onExam={selectExam} onProgress={() => setScreen('progress')} onLogout={logout}
        />
      )}

      {screen === 'examDetail' && exam && (
        <ExamDetailScreen
          exam={exam} progress={progress} freeUsed={freeUsed} isPremium={isPremium}
          onArea={selectArea} onBack={() => setScreen('home')}
        />
      )}

      {screen === 'question'   && area && qs.length > 0 && (
        <QuestionScreen
          area={area} exam={exam} qIndex={qIdx} questions={qs}
          streak={streak} aiKey={aiKey}
          onAnswer={recordAnswer} onNext={nextQuestion}
          onQuit={() => setScreen('examDetail')}
        />
      )}

      {screen === 'result'     && area && (
        <ResultScreen
          area={area} exam={exam} answers={answers} total={qs.length}
          onRetry={() => selectArea(area)} onHome={() => setScreen('home')}
        />
      )}

      {screen === 'paywall'    && (
        <PaywallScreen onUnlock={unlock} onBack={() => setScreen('examDetail')} />
      )}

      {screen === 'progress'   && (
        <ProgressScreen progress={progress} streak={streak} onBack={() => setScreen('home')} />
      )}
    </>
  )
}
