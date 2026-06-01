// directionC.jsx — "Cálido Contemporáneo": tile system, bold color blocks.
// Screens: Home, Exam, Question, Result. Exported as window.DirC
const C = {
  bg: '#E9E2D1', card: '#F7F2E7', sunk: '#DED4C0', cream: '#FBF7EE',
  ink: '#36302A', sub: '#7C7163', faint: '#A89D8C',
  line: '#E1D7C3',
  laurel: '#7E9A77', laurelDk: '#4F6A49',
  terra: '#C2664F', ochre: '#B08D4F',
  display: "'Montserrat', sans-serif", body: "'Inter', sans-serif",
}

function PhoneC({ children }) {
  return (
    <div style={{ width: 320, height: 694, background: C.bg, borderRadius: 30, overflow: 'hidden',
      fontFamily: C.body, color: C.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar color={C.ink} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}

// squircle icon tile
const Squircle = ({ children, bg, size = 46 }) => (
  <div style={{ width: size, height: size, background: bg, borderRadius: size * 0.32, display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</div>
)

function HomeC() {
  return (
    <PhoneC>
      <div style={{ padding: '14px 20px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="assets/certus-logo.svg" alt="Certus" style={{ height: 25 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 13, background: C.ochre }}>
          <IconFlame size={15} stroke="#fff" fill="rgba(255,255,255,.3)" sw={1.6} />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>12</span>
        </div>
      </div>

      <div style={{ padding: '14px 20px 16px' }}>
        <h1 style={{ fontFamily: C.display, fontSize: 30, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.05 }}>Hola, Mariana</h1>
        {/* hero stat row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {[
            { v: '148', l: 'Respondidas', c: C.laurelDk },
            { v: '71%', l: 'Aciertos', c: C.terra },
            { v: '12', l: 'Días racha', c: C.ochre },
          ].map(s => (
            <div key={s.l} style={{ flex: 1, background: C.cream, borderRadius: 16, padding: '13px 6px', textAlign: 'center', border: `1px solid ${C.line}` }}>
              <p style={{ fontFamily: C.display, fontSize: 21, fontWeight: 800, color: s.c, letterSpacing: '-.02em' }}>{s.v}</p>
              <p style={{ fontSize: 9.5, color: C.sub, marginTop: 2, fontWeight: 500 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <p style={{ fontFamily: C.display, fontSize: 15, fontWeight: 800, letterSpacing: '-.01em' }}>Tus exámenes</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {EXAMS.map(ex => {
          const Icon = ICONS[ex.id]
          return (
            <div key={ex.id} style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 26px -18px rgba(54,48,42,.5)' }}>
              {/* colored header block */}
              <div style={{ background: ex.color, padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Squircle bg="rgba(255,255,255,.2)" size={44}>
                  <Icon size={23} stroke="#fff" sw={1.7} />
                </Squircle>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: C.display, fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-.01em' }}>{ex.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.85)', marginTop: 1 }}>{ex.short}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{ex.pct}<span style={{ fontSize: 11 }}>%</span></p>
                </div>
              </div>
              {/* cream body */}
              <div style={{ background: C.cream, padding: '12px 16px 14px' }}>
                <div style={{ height: 8, borderRadius: 8, background: C.sunk, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${ex.pct}%`, background: ex.color, borderRadius: 8 }} />
                </div>
                <p style={{ fontSize: 11, color: C.sub, marginTop: 9 }}>{ex.areas.length} áreas · continúa donde quedaste</p>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '8px 16px 18px' }}>
        <button style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: C.ink, color: C.cream,
          fontFamily: C.display, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <IconChart size={17} stroke={C.cream} sw={1.7} /> Ver progreso completo
        </button>
      </div>
    </PhoneC>
  )
}

function ExamC() {
  const ex = EXAMS[2]
  return (
    <PhoneC>
      {/* full color header */}
      <div style={{ background: ex.color, padding: '14px 20px 22px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button style={{ width: 38, height: 38, borderRadius: 12, border: 'none', background: 'rgba(255,255,255,.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconArrowLeft size={18} stroke="#fff" />
          </button>
          <span style={{ fontFamily: C.display, fontSize: 12, fontWeight: 700, letterSpacing: '.1em', opacity: .85 }}>CERTUS</span>
          <div style={{ width: 38 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <Squircle bg="rgba(255,255,255,.2)" size={52}><IconColumns size={27} stroke="#fff" sw={1.7} /></Squircle>
          <div>
            <h1 style={{ fontFamily: C.display, fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1 }}>{ex.name}</h1>
            <p style={{ fontSize: 11.5, opacity: .85, marginTop: 4 }}>{ex.short}</p>
          </div>
        </div>
        <div style={{ marginTop: 16, height: 7, borderRadius: 7, background: 'rgba(255,255,255,.25)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${ex.pct}%`, background: '#fff', borderRadius: 7 }} />
        </div>
        <p style={{ fontSize: 11, opacity: .85, marginTop: 7 }}>{ex.pct}% completado</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {ex.areas.map(a => {
          const Icon = ICONS[a.id]
          return (
            <div key={a.id} style={{ background: C.cream, border: `1px solid ${C.line}`, borderRadius: 17, padding: '14px 15px', display: 'flex', alignItems: 'center', gap: 13 }}>
              <Squircle bg={a.locked ? C.sunk : ex.tint} size={44}>
                {a.locked ? <IconLock size={20} stroke={C.faint} fill="#E8DFCD" sw={1.6} /> : <Icon size={22} stroke={ex.color} sw={1.7} />}
              </Squircle>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700 }}>{a.name}</p>
                <div style={{ marginTop: 8, height: 6, borderRadius: 6, background: C.sunk, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${a.pct}%`, background: a.locked ? C.faint : ex.color, borderRadius: 6 }} />
                </div>
              </div>
              {a.locked
                ? <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: C.ochre, padding: '4px 8px', borderRadius: 8 }}>PRO</span>
                : <span style={{ fontFamily: C.display, fontSize: 15, fontWeight: 800, color: ex.color }}>{a.pct}%</span>}
            </div>
          )
        })}
      </div>
    </PhoneC>
  )
}

function QuestionC() {
  const q = SAMPLE_Q
  const ex = EXAMS[0]
  return (
    <PhoneC>
      <div style={{ padding: '12px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', color: C.faint, display: 'flex' }}><IconX size={20} stroke={C.faint} /></button>
        <div style={{ flex: 1, height: 8, borderRadius: 8, background: C.sunk, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '25%', background: ex.color, borderRadius: 8 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 11, background: C.ochre }}>
          <IconFlame size={13} stroke="#fff" sw={1.6} /><span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>12</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 15, background: ex.tint, marginBottom: 18 }}>
          <Squircle bg={ex.color} size={36}><IconCompass size={19} stroke="#fff" sw={1.7} /></Squircle>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: ex.color }}>{q.area}</p>
            <p style={{ fontSize: 10.5, color: C.sub }}>Pregunta {q.n} de {q.of}</p>
          </div>
        </div>

        <p style={{ fontFamily: C.display, fontSize: 19, fontWeight: 700, lineHeight: 1.42, letterSpacing: '-.015em' }}>{q.q}</p>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((o, i) => {
            const correct = i === q.ans
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px', borderRadius: 16,
                background: correct ? C.laurel : C.cream, border: `2px solid ${correct ? C.laurel : C.line}` }}>
                <span style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: correct ? 'rgba(255,255,255,.25)' : C.sunk, color: correct ? '#fff' : C.sub, fontSize: 12.5, fontWeight: 800 }}>
                  {correct ? <IconCheck size={16} stroke="#fff" /> : ['A','B','C','D'][i]}
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: correct ? '#fff' : C.ink }}>{o}</span>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 16, padding: '15px', borderRadius: 16, background: C.cream, border: `2px solid ${C.laurel}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: C.display, fontSize: 14, fontWeight: 800, color: C.laurelDk }}>
            <Squircle bg={C.laurel} size={24}><IconCheck size={15} stroke="#fff" /></Squircle> ¡Correcto!
          </div>
          <p style={{ fontSize: 12.5, color: C.sub, marginTop: 8, lineHeight: 1.6 }}>{q.exp}</p>
          <button style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 12,
            background: ex.tint, border: 'none', fontSize: 12, fontWeight: 700, color: ex.color }}>
            <IconSpark size={15} stroke={ex.color} sw={1.6} /> Tutor IA — explícame más
          </button>
        </div>
      </div>

      <div style={{ padding: '8px 20px 18px' }}>
        <button style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: ex.color, color: '#fff',
          fontFamily: C.display, fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Siguiente <IconArrowRight size={18} stroke="#fff" />
        </button>
      </div>
    </PhoneC>
  )
}

function ResultC() {
  return (
    <PhoneC>
      <div style={{ background: C.laurel, padding: '30px 24px 28px', textAlign: 'center', color: '#fff' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .85 }}>Pensamiento Analítico</p>
        <p style={{ fontFamily: C.display, fontSize: 64, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1, marginTop: 12 }}>73<span style={{ fontSize: 30 }}>%</span></p>
        <h1 style={{ fontFamily: C.display, fontSize: 21, fontWeight: 800, marginTop: 10 }}>¡Excelente trabajo!</h1>
        <p style={{ fontSize: 12.5, opacity: .85, marginTop: 4 }}>22 de 30 correctas</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { l: 'Correctas', v: 22, c: C.laurelDk, icon: <IconCheck size={16} stroke={C.laurelDk} /> },
            { l: 'Incorrectas', v: 8, c: C.terra, icon: <IconX size={16} stroke={C.terra} /> },
            { l: 'Mejor racha', v: 12, c: C.ochre, icon: <IconFlame size={16} stroke={C.ochre} sw={1.6} /> },
            { l: 'Precisión', v: '73%', c: C.ink, icon: <IconTarget size={16} stroke={C.ink} sw={1.6} /> },
          ].map(s => (
            <div key={s.l} style={{ background: C.cream, border: `1px solid ${C.line}`, borderRadius: 16, padding: '15px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontFamily: C.display, fontSize: 26, fontWeight: 800, color: s.c, letterSpacing: '-.02em' }}>{s.v}</p>
                {s.icon}
              </div>
              <p style={{ fontSize: 11, color: C.sub, marginTop: 4, fontWeight: 500 }}>{s.l}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '15px 16px', borderRadius: 16, background: EXAMS[0].tint, display: 'flex', gap: 12, alignItems: 'center' }}>
          <Squircle bg={C.laurel} size={40}><IconSpark size={20} stroke="#fff" sw={1.6} /></Squircle>
          <p style={{ fontSize: 12.5, color: C.laurelDk, lineHeight: 1.5, fontWeight: 500 }}>Vas <strong>+6%</strong> sobre tu marca anterior. ¡Sigue así!</p>
        </div>
      </div>

      <div style={{ padding: '10px 16px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: C.laurel, color: '#fff', fontFamily: C.display, fontWeight: 800, fontSize: 15 }}>Practicar de nuevo</button>
        <button style={{ width: '100%', padding: '14px', borderRadius: 16, border: `2px solid ${C.line}`, background: 'transparent', color: C.sub, fontFamily: C.display, fontWeight: 700, fontSize: 13.5 }}>Ir al inicio</button>
      </div>
    </PhoneC>
  )
}

window.DirC = { Home: HomeC, Exam: ExamC, Question: QuestionC, Result: ResultC }
