// directionB.jsx — "Botánico Laurel": brand-forward, organic, tinted bands.
// Screens: Home, Exam, Question, Result. Exported as window.DirB
const B = {
  bg: '#ECE5D4', card: '#F7F2E6', sunk: '#E2D9C6',
  ink: '#3D3730', sub: '#7E7263', faint: '#ABA08F',
  line: '#E0D6C2',
  laurel: '#7E9A77', laurelDk: '#4F6A49', laurelTint: '#E2EEDC',
  terra: '#C2664F', ochre: '#B08D4F', ochreTint: '#F3E7CC',
  display: "'Montserrat', sans-serif", body: "'Inter', sans-serif",
}

// little laurel sprig — brand motif
function Sprig({ size = 26, color = B.laurel, flip = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path d="M12 21V5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {[7,10,13,16].map((y,i) => (
        <g key={i}>
          <path d={`M12 ${y}c-2.3-.3-3.8-1.6-4.2-3.4 1.9-.4 3.6.6 4.2 3.4Z`} fill={color} opacity=".9" />
          <path d={`M12 ${y-1.5}c2.3-.3 3.8-1.6 4.2-3.4-1.9-.4-3.6.6-4.2 3.4Z`} fill={color} opacity=".7" />
        </g>
      ))}
      <circle cx="12" cy="4.2" r="1.4" fill={color} />
    </svg>
  )
}

function PhoneB({ children }) {
  return (
    <div style={{ width: 320, height: 694, background: B.bg, borderRadius: 30, overflow: 'hidden',
      fontFamily: B.body, color: B.ink, display: 'flex', flexDirection: 'column' }}>
      <StatusBar color={B.ink} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}

function HomeB() {
  return (
    <PhoneB>
      {/* warm header band */}
      <div style={{ background: B.laurelTint, padding: '16px 22px 20px', borderBottomLeftRadius: 26, borderBottomRightRadius: 26, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -10, top: 6, opacity: .35 }}><Sprig size={92} color={B.laurel} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="assets/certus-logo.svg" alt="Certus" style={{ height: 26 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 999, background: '#fff' }}>
            <IconFlame size={15} stroke={B.ochre} fill="#F0DDB0" sw={1.5} />
            <span style={{ fontSize: 13, fontWeight: 800, color: B.ochre }}>12</span>
          </div>
        </div>
        <h1 style={{ fontFamily: B.display, fontSize: 23, fontWeight: 800, letterSpacing: '-.02em', marginTop: 18, color: B.laurelDk }}>Hola, Mariana 🌿</h1>
        <p style={{ fontSize: 12.5, color: B.laurelDk, opacity: .82, marginTop: 5 }}>Tu jardín de estudio crece: <strong>148 preguntas</strong>.</p>
      </div>

      <div style={{ padding: '18px 22px 12px' }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: B.faint }}>Selecciona tu examen</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        {EXAMS.map(ex => {
          const Icon = ICONS[ex.id]
          return (
            <div key={ex.id} style={{ background: B.card, borderRadius: 20, overflow: 'hidden', border: `1px solid ${B.line}`,
              boxShadow: '0 10px 24px -18px rgba(61,55,48,.4)' }}>
              <div style={{ background: ex.tint, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} stroke={ex.color} fill={ex.tint} sw={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: B.display, fontSize: 16, fontWeight: 800, color: ex.color, letterSpacing: '-.01em' }}>{ex.name}</p>
                  <p style={{ fontSize: 11, color: ex.color, opacity: .8, marginTop: 1 }}>{ex.short}</p>
                </div>
                <span style={{ fontFamily: B.display, fontSize: 17, fontWeight: 800, color: ex.color }}>{ex.pct}%</span>
              </div>
              <div style={{ padding: '12px 16px 14px' }}>
                <p style={{ fontSize: 11.5, color: B.sub, lineHeight: 1.5 }}>{ex.desc}</p>
                <div style={{ marginTop: 11, height: 7, borderRadius: 7, background: B.sunk, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${ex.pct}%`, background: ex.color, borderRadius: 7 }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '8px 16px 18px' }}>
        <button style={{ width: '100%', padding: '14px', borderRadius: 16, border: `1.5px solid ${B.laurel}`, background: 'transparent', color: B.laurelDk,
          fontFamily: B.display, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <IconChart size={17} stroke={B.laurelDk} sw={1.7} /> Ver mi progreso
        </button>
      </div>
    </PhoneB>
  )
}

function ExamB() {
  const ex = EXAMS[1]
  return (
    <PhoneB>
      <div style={{ background: ex.tint, padding: '14px 22px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -16, bottom: -16, opacity: .3 }}><Sprig size={100} color={ex.color} flip /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button style={{ width: 38, height: 38, borderRadius: 12, border: 'none', background: '#fff', color: ex.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconArrowLeft size={18} stroke={ex.color} />
          </button>
          <img src="assets/certus-logo-mini.svg" alt="Certus" style={{ height: 20, opacity: .9 }} />
          <div style={{ width: 38 }} />
        </div>
        <h1 style={{ fontFamily: B.display, fontSize: 25, fontWeight: 800, color: ex.color, letterSpacing: '-.02em' }}>{ex.name}</h1>
        <p style={{ fontSize: 12, color: ex.color, opacity: .85, marginTop: 6, lineHeight: 1.45, maxWidth: 220 }}>{ex.full}</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {ex.areas.map(a => {
          const Icon = ICONS[a.id]
          return (
            <div key={a.id} style={{ background: B.card, border: `1px solid ${B.line}`, borderRadius: 17, padding: '14px 15px',
              opacity: a.locked ? .92 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: a.locked ? B.sunk : ex.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {a.locked ? <IconLock size={19} stroke={B.faint} fill="#EBE2D0" sw={1.6} /> : <Icon size={21} stroke={ex.color} fill={ex.tint} sw={1.6} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: B.ink }}>{a.name}</p>
                  <p style={{ fontSize: 11, color: B.sub, marginTop: 2 }}>{a.correct}/{a.total} correctas</p>
                </div>
                {a.locked
                  ? <span style={{ fontSize: 10.5, fontWeight: 700, color: B.ochre, background: B.ochreTint, padding: '4px 9px', borderRadius: 999 }}>Premium</span>
                  : <span style={{ fontFamily: B.display, fontSize: 14, fontWeight: 800, color: ex.color }}>{a.pct}%</span>}
              </div>
              <div style={{ marginTop: 11, height: 6, borderRadius: 6, background: B.sunk, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.pct}%`, background: a.locked ? B.faint : ex.color, borderRadius: 6 }} />
              </div>
            </div>
          )
        })}
      </div>
    </PhoneB>
  )
}

function QuestionB() {
  const q = SAMPLE_Q
  return (
    <PhoneB>
      <div style={{ padding: '12px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'none', border: 'none', color: B.faint, display: 'flex' }}><IconX size={20} stroke={B.faint} /></button>
        <div style={{ flex: 1, height: 7, borderRadius: 7, background: B.sunk, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '25%', background: B.laurel, borderRadius: 7 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: B.ochre }}>
          <IconFlame size={14} stroke={B.ochre} fill="#F0DDB0" sw={1.5} /><span style={{ fontSize: 12.5, fontWeight: 800 }}>12</span>
        </div>
      </div>

      <div style={{ margin: '10px 20px 0', padding: '7px 13px', borderRadius: 999, background: B.laurelTint, display: 'inline-flex', alignSelf: 'flex-start',
        alignItems: 'center', gap: 7, width: 'fit-content' }}>
        <IconCompass size={15} stroke={B.laurelDk} sw={1.7} />
        <span style={{ fontSize: 12, fontWeight: 700, color: B.laurelDk }}>{q.area} · {q.n}/{q.of}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px 16px' }}>
        <p style={{ fontFamily: B.display, fontSize: 18, fontWeight: 600, lineHeight: 1.5, letterSpacing: '-.01em' }}>{q.q}</p>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((o, i) => {
            const correct = i === q.ans
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px', borderRadius: 16,
                background: correct ? B.laurelTint : B.card, border: `2px solid ${correct ? B.laurel : B.line}` }}>
                <span style={{ width: 26, height: 26, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: correct ? B.laurel : '#fff', color: correct ? '#fff' : B.sub, fontSize: 12, fontWeight: 800, border: correct ? 'none' : `1px solid ${B.line}` }}>
                  {correct ? <IconCheck size={15} stroke="#fff" /> : ['A','B','C','D'][i]}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: correct ? B.laurelDk : B.ink }}>{o}</span>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 16, padding: '15px', borderRadius: 16, background: B.laurelTint, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -8, top: -8, opacity: .35 }}><Sprig size={56} color={B.laurel} /></div>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 800, color: B.laurelDk }}>
            <IconCheck size={15} stroke={B.laurelDk} /> ¡Correcto!
          </p>
          <p style={{ fontSize: 12.5, color: B.laurelDk, opacity: .85, marginTop: 6, lineHeight: 1.6, position: 'relative' }}>{q.exp}</p>
          <button style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 999,
            background: '#fff', border: 'none', fontSize: 12, fontWeight: 700, color: B.laurelDk }}>
            <IconSpark size={15} stroke={B.ochre} fill="#EAD9A8" sw={1.5} /> Tutor IA — explícame más
          </button>
        </div>
      </div>

      <div style={{ padding: '8px 20px 18px' }}>
        <button style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: B.laurel, color: '#fff',
          fontFamily: B.display, fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Siguiente <IconArrowRight size={17} stroke="#fff" />
        </button>
      </div>
    </PhoneB>
  )
}

function ResultB() {
  return (
    <PhoneB>
      <div style={{ background: B.laurelTint, padding: '26px 24px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -14, top: 10, opacity: .3 }}><Sprig size={80} color={B.laurel} /></div>
        <div style={{ position: 'absolute', right: -14, top: 10, opacity: .3 }}><Sprig size={80} color={B.laurel} flip /></div>
        <div style={{ width: 132, height: 132, margin: '0 auto', borderRadius: '50%', background: '#fff', border: `7px solid ${B.laurel}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: B.display, fontSize: 40, fontWeight: 800, color: B.laurelDk, letterSpacing: '-.02em', lineHeight: 1 }}>73%</span>
          <span style={{ fontSize: 12, color: B.sub, marginTop: 2 }}>22 de 30</span>
        </div>
        <h1 style={{ fontFamily: B.display, fontSize: 22, fontWeight: 800, color: B.laurelDk, marginTop: 16, letterSpacing: '-.01em' }}>¡Excelente trabajo!</h1>
        <p style={{ fontSize: 12.5, color: B.laurelDk, opacity: .8, marginTop: 4 }}>Pensamiento Analítico</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 16px' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { l: 'Correctas', v: 22, c: B.laurelDk, bg: B.laurelTint },
            { l: 'Incorrectas', v: 8, c: B.terra, bg: '#F4E3DD' },
            { l: 'Racha', v: '12', c: B.ochre, bg: B.ochreTint },
          ].map(s => (
            <div key={s.l} style={{ flex: 1, background: s.bg, borderRadius: 17, padding: '17px 8px', textAlign: 'center' }}>
              <p style={{ fontFamily: B.display, fontSize: 25, fontWeight: 800, color: s.c }}>{s.v}</p>
              <p style={{ fontSize: 10.5, color: B.sub, marginTop: 3 }}>{s.l}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: '15px 16px', borderRadius: 17, background: B.card, border: `1px solid ${B.line}`, display: 'flex', gap: 12, alignItems: 'center' }}>
          <Sprig size={34} color={B.laurel} />
          <p style={{ fontSize: 12.5, color: B.sub, lineHeight: 1.5 }}>Tu mejor área hasta ahora. Una racha de <strong style={{ color: B.ink }}>12 días</strong> 🌿</p>
        </div>
      </div>

      <div style={{ padding: '10px 16px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: B.laurel, color: '#fff', fontFamily: B.display, fontWeight: 700, fontSize: 14.5 }}>Practicar de nuevo</button>
        <button style={{ width: '100%', padding: '13px', borderRadius: 16, border: `1.5px solid ${B.laurel}`, background: 'transparent', color: B.laurelDk, fontFamily: B.display, fontWeight: 700, fontSize: 13.5 }}>Ir al inicio</button>
      </div>
    </PhoneB>
  )
}

window.DirB = { Home: HomeB, Exam: ExamB, Question: QuestionB, Result: ResultB }
