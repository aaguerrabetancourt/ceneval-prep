// directionA.jsx — "Editorial Calmo": refined, airy, magazine-like.
// Screens: Home, Exam detail, Question, Result. Exported as window.DirA
const A = {
  bg: '#F1EBDE', card: '#FBF8F0', sunk: '#ECE4D4',
  ink: '#3B362F', sub: '#857A6C', faint: '#B3A899',
  line: '#E4DACA', lineSoft: '#EFE8DA',
  laurel: '#7E9A77', laurelDk: '#566F50',
  terra: '#C2664F', ochre: '#B08D4F',
  display: "'Montserrat', sans-serif", body: "'Inter', sans-serif",
}

function Ring({ pct, color, size = 46, sw = 3.5, track = '#E4DACA' }) {
  const r = (size - sw) / 2, c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)} />
    </svg>
  )
}

function PhoneA({ children, pad = true }) {
  return (
    <div style={{ width: 320, height: 694, background: A.bg, borderRadius: 30, overflow: 'hidden',
      fontFamily: A.body, color: A.ink, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StatusBar color={A.ink} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', ...(pad ? {} : {}) }}>
        {children}
      </div>
    </div>
  )
}

const Eyebrow = ({ children, color = A.ochre }) => (
  <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color }}>{children}</p>
)

function HomeA() {
  return (
    <PhoneA>
      <div style={{ padding: '14px 22px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="assets/certus-logo.svg" alt="Certus" style={{ height: 26 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 999, background: '#F6ECD6', border: `1px solid ${A.line}` }}>
          <span style={{ color: A.ochre, display: 'flex' }}><IconFlame size={15} stroke={A.ochre} fill="#F2DFB4" sw={1.5} /></span>
          <span style={{ fontSize: 13, fontWeight: 800, color: A.ochre }}>12</span>
        </div>
      </div>

      <div style={{ padding: '12px 22px 18px' }}>
        <Eyebrow>Lunes · sigue así</Eyebrow>
        <h1 style={{ fontFamily: A.display, fontSize: 27, fontWeight: 800, letterSpacing: '-.02em', marginTop: 7, lineHeight: 1.08 }}>
          Buen día,<br/>Mariana.
        </h1>
        <p style={{ fontSize: 13, color: A.sub, marginTop: 9, lineHeight: 1.5 }}>
          Llevas <strong style={{ color: A.ink }}>148 preguntas</strong> · 71% de aciertos esta semana.
        </p>
      </div>

      <div style={{ padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Eyebrow color={A.faint}>Tus exámenes</Eyebrow>
        <span style={{ fontSize: 11, color: A.sub }}>3 activos</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {EXAMS.map(ex => {
          const Icon = ICONS[ex.id]
          return (
            <div key={ex.id} style={{ background: A.card, border: `1px solid ${A.line}`, borderRadius: 18,
              padding: '16px 16px', display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 1px 2px rgba(74,67,62,.04), 0 8px 22px -16px rgba(74,67,62,.22)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: ex.tint, color: ex.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={23} stroke={ex.color} sw={1.6} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: A.display, fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>{ex.name}</p>
                <p style={{ fontSize: 11.5, color: A.sub, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.short}</p>
              </div>
              <div style={{ position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ring pct={ex.pct} color={ex.color} />
                <span style={{ position: 'absolute', fontSize: 12, fontWeight: 800, color: ex.color }}>{ex.pct}<span style={{ fontSize: 8 }}>%</span></span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '8px 16px 18px', borderTop: `1px solid ${A.lineSoft}` }}>
        <button style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: A.laurel, color: '#fff',
          fontFamily: A.display, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <IconChart size={17} stroke="#fff" sw={1.7} /> Ver mi progreso
        </button>
      </div>
    </PhoneA>
  )
}

function ExamA() {
  const ex = EXAMS[0]
  return (
    <PhoneA>
      <div style={{ padding: '12px 22px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button style={{ width: 38, height: 38, borderRadius: 12, border: `1px solid ${A.line}`, background: A.card, color: A.sub, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconArrowLeft size={18} stroke={A.sub} />
          </button>
          <img src="assets/certus-logo-mini.svg" alt="Certus" style={{ height: 20, opacity: .85 }} />
          <div style={{ width: 38 }} />
        </div>
        <Eyebrow color={ex.color}>{ex.short}</Eyebrow>
        <h1 style={{ fontFamily: A.display, fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', marginTop: 7 }}>{ex.name}</h1>
        <p style={{ fontSize: 12.5, color: A.sub, marginTop: 7, lineHeight: 1.5 }}>{ex.full}</p>
        <div style={{ marginTop: 16, height: 6, borderRadius: 6, background: A.sunk, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${ex.pct}%`, background: ex.color, borderRadius: 6 }} />
        </div>
        <p style={{ fontSize: 11, color: A.sub, marginTop: 7 }}>{ex.pct}% completado · 4 áreas</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {ex.areas.map(a => {
          const Icon = ICONS[a.id]
          return (
            <div key={a.id} style={{ background: A.card, border: `1px solid ${a.free ? A.line : A.line}`, borderRadius: 15, padding: '14px 15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: ex.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} stroke={ex.color} sw={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: A.ink }}>{a.name}</p>
                  <p style={{ fontSize: 11, color: A.sub, marginTop: 2 }}>{a.correct}/{a.total} correctas</p>
                </div>
                <span style={{ fontFamily: A.display, fontSize: 14, fontWeight: 800, color: ex.color }}>{a.pct}%</span>
              </div>
              <div style={{ marginTop: 11, height: 5, borderRadius: 5, background: A.sunk, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.pct}%`, background: ex.color, borderRadius: 5 }} />
              </div>
              {a.free && <p style={{ fontSize: 10.5, color: A.ochre, marginTop: 8, fontWeight: 600 }}>3 preguntas gratis restantes</p>}
            </div>
          )
        })}
      </div>
    </PhoneA>
  )
}

function QuestionA() {
  const q = SAMPLE_Q
  return (
    <PhoneA>
      <div style={{ padding: '12px 20px 6px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', color: A.faint, display: 'flex' }}><IconX size={20} stroke={A.faint} /></button>
        <div style={{ flex: 1, height: 6, borderRadius: 6, background: A.sunk, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '25%', background: A.laurel, borderRadius: 6 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: A.ochre }}>
          <IconFlame size={14} stroke={A.ochre} fill="#F2DFB4" sw={1.5} /><span style={{ fontSize: 12.5, fontWeight: 800 }}>12</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
          <IconCompass size={15} stroke={A.laurelDk} sw={1.7} />
          <Eyebrow color={A.laurelDk}>{q.area} · {q.n}/{q.of}</Eyebrow>
        </div>
        <p style={{ fontFamily: A.display, fontSize: 18, fontWeight: 600, lineHeight: 1.5, letterSpacing: '-.01em', color: A.ink }}>{q.q}</p>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((o, i) => {
            const correct = i === q.ans
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px', borderRadius: 14,
                background: correct ? '#E3EEDD' : A.card, border: `1.5px solid ${correct ? A.laurel : A.line}` }}>
                <span style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: correct ? A.laurel : A.sunk, color: correct ? '#fff' : A.sub, fontSize: 11.5, fontWeight: 800 }}>
                  {correct ? <IconCheck size={14} stroke="#fff" /> : ['A','B','C','D'][i]}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: correct ? A.laurelDk : A.ink }}>{o}</span>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 16, padding: '14px 15px', borderRadius: 14, background: '#E3EEDD', border: `1px solid ${A.laurel}` }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 800, color: A.laurelDk }}>
            <IconCheck size={15} stroke={A.laurelDk} /> ¡Correcto!
          </p>
          <p style={{ fontSize: 12.5, color: A.sub, marginTop: 6, lineHeight: 1.6 }}>{q.exp}</p>
          <button style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 10,
            background: A.card, border: `1px solid ${A.line}`, fontSize: 12, fontWeight: 600, color: A.laurelDk }}>
            <IconSpark size={15} stroke={A.laurelDk} fill="#EAD9A8" sw={1.5} /> Pídele más al Tutor IA
          </button>
        </div>
      </div>

      <div style={{ padding: '8px 20px 18px', borderTop: `1px solid ${A.lineSoft}` }}>
        <button style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: A.laurel, color: '#fff',
          fontFamily: A.display, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Siguiente <IconArrowRight size={17} stroke="#fff" />
        </button>
      </div>
    </PhoneA>
  )
}

function ResultA() {
  return (
    <PhoneA>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Eyebrow color={A.ochre}>Resultado · Pensamiento Analítico</Eyebrow>
        <h1 style={{ fontFamily: A.display, fontSize: 25, fontWeight: 800, letterSpacing: '-.02em', marginTop: 12, textAlign: 'center', lineHeight: 1.12 }}>
          ¡Excelente<br/>trabajo!
        </h1>

        <div style={{ position: 'relative', margin: '26px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ring pct={73} color={A.laurel} size={150} sw={8} track="#E4DACA" />
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <p style={{ fontFamily: A.display, fontSize: 42, fontWeight: 800, color: A.laurelDk, letterSpacing: '-.02em', lineHeight: 1 }}>73%</p>
            <p style={{ fontSize: 12, color: A.sub, marginTop: 2 }}>22 de 30</p>
          </div>
        </div>

        <div style={{ width: '100%', display: 'flex', gap: 10, marginTop: 22 }}>
          {[
            { l: 'Correctas', v: 22, c: A.laurelDk, bg: '#E3EEDD' },
            { l: 'Incorrectas', v: 8, c: A.terra, bg: '#F4E3DD' },
            { l: 'Racha', v: '12', c: A.ochre, bg: '#F6ECD6' },
          ].map(s => (
            <div key={s.l} style={{ flex: 1, background: s.bg, borderRadius: 15, padding: '16px 8px', textAlign: 'center' }}>
              <p style={{ fontFamily: A.display, fontSize: 24, fontWeight: 800, color: s.c }}>{s.v}</p>
              <p style={{ fontSize: 10.5, color: A.sub, marginTop: 3 }}>{s.l}</p>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', marginTop: 16, padding: '14px 16px', borderRadius: 15, background: A.card, border: `1px solid ${A.line}`,
          display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: '#F6ECD6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconSpark size={19} stroke={A.ochre} fill="#EAD9A8" sw={1.5} />
          </div>
          <p style={{ fontSize: 12.5, color: A.sub, lineHeight: 1.5 }}>Superaste tu mejor marca en esta área por <strong style={{ color: A.ink }}>+6%</strong>.</p>
        </div>
      </div>

      <div style={{ padding: '10px 20px 18px', borderTop: `1px solid ${A.lineSoft}`, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: A.laurel, color: '#fff', fontFamily: A.display, fontWeight: 700, fontSize: 14 }}>Practicar de nuevo</button>
        <button style={{ width: '100%', padding: '13px', borderRadius: 14, border: `1.5px solid ${A.line}`, background: 'transparent', color: A.sub, fontFamily: A.display, fontWeight: 600, fontSize: 13.5 }}>Ir al inicio</button>
      </div>
    </PhoneA>
  )
}

window.DirA = { Home: HomeA, Exam: ExamA, Question: QuestionA, Result: ResultA }
