// calmo.jsx — Editorial Calmo design system: tokens, primitives, dropdown menu.
// Depends on icons.jsx + data.jsx (window.EXAMS, ICONS, StatusBar). Exports to window.
const CALMO = {
  bg:'#F1EBDE', card:'#FBF8F0', sunk:'#ECE4D4', scrim:'rgba(48,43,37,.34)',
  ink:'#3B362F', sub:'#857A6C', faint:'#B3A899',
  line:'#E4DACA', lineSoft:'#EFE8DA',
  laurel:'#7E9A77', laurelDk:'#566F50', laurelTint:'#E3EEDD',
  terra:'#C2664F', ochre:'#B08D4F', ochreTint:'#F6ECD6',
  display:"'Montserrat',sans-serif", body:"'Inter',sans-serif",
}
const K = CALMO

function scoreFor(ex) {
  const answered = ex.areas.reduce((s,a)=>s+a.total,0)
  const correct  = ex.areas.reduce((s,a)=>s+a.correct,0)
  const acc = Math.round(correct/answered*100)
  const level = acc>=65 ? 'Avanzado' : acc>=40 ? 'Intermedio' : 'Inicial'
  return { acc, answered, correct, level }
}

function Ring({ pct, color, size=58, sw=5, track=K.sunk }) {
  const r=(size-sw)/2, c=2*Math.PI*r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} style={{transition:'stroke-dashoffset .5s ease'}}/>
    </svg>
  )
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width:42, height:25, borderRadius:999, border:'none', cursor:'pointer',
      background: on ? K.laurel : K.sunk, position:'relative', transition:'background .2s', flexShrink:0 }}>
      <span style={{ position:'absolute', top:3, left: on?20:3, width:19, height:19, borderRadius:'50%', background:'#fff',
        boxShadow:'0 1px 3px rgba(0,0,0,.2)', transition:'left .2s' }}/>
    </button>
  )
}

const Eyebrow = ({children,color=K.faint}) => (
  <p style={{fontSize:10.5,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color}}>{children}</p>
)

function ExamRow({ ex, active, onClick }) {
  const Icon = ICONS[ex.id]
  return (
    <button onClick={onClick} style={{ width:'100%', textAlign:'left', cursor:'pointer',
      display:'flex', alignItems:'center', gap:12, padding:'11px 12px', borderRadius:14,
      background: active ? K.laurelTint : 'transparent', border:`1.5px solid ${active ? K.laurel : 'transparent'}`,
      transition:'background .15s' }}>
      <div style={{ width:38, height:38, borderRadius:11, background: active ? '#fff' : K.sunk,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={20} stroke={active ? K.laurelDk : K.sub} sw={1.6}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontFamily:K.display, fontSize:14.5, fontWeight:700, color: active ? K.laurelDk : K.ink, letterSpacing:'-.01em' }}>{ex.name}</p>
        <p style={{ fontSize:11, color:K.sub, marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ex.short}</p>
      </div>
      {active
        ? <span style={{ width:22, height:22, borderRadius:'50%', background:K.laurel, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><IconCheck size={13} stroke="#fff"/></span>
        : <span style={{ fontFamily:K.display, fontSize:13, fontWeight:700, color:K.faint }}>{ex.pct}%</span>}
    </button>
  )
}

function SettingRow({ icon, label, sub, right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px' }}>
      <div style={{ width:34, height:34, borderRadius:10, background:K.sunk, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:K.laurelDk }}>{icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:13, fontWeight:600, color:K.ink }}>{label}</p>
        {sub && <p style={{ fontSize:10.5, color:K.sub, marginTop:1 }}>{sub}</p>}
      </div>
      {right}
    </div>
  )
}

// Full dropdown panel — exam selector + per-exam score + settings
function DropdownMenu({ open, activeId, setActiveId, notif, setNotif, tutor, setTutor, goal, setGoal, onClose, top=118 }) {
  const ex = EXAMS.find(e => e.id === activeId)
  const sc = scoreFor(ex)
  return (
    <>
      {open && <div onClick={onClose} style={{ position:'absolute', inset:0, zIndex:20, background:K.scrim }}/>}
      <div style={{ position:'absolute', left:8, right:8, top, zIndex:25,
        transform: open?'translateY(0)':'translateY(-118%)', opacity: open?1:0,
        transition:'transform .32s cubic-bezier(.22,1,.36,1), opacity .22s', pointerEvents: open?'auto':'none' }}>
        <div style={{ background:K.card, borderRadius:22, border:`1px solid ${K.line}`,
          boxShadow:'0 24px 48px -24px rgba(48,43,37,.55)', overflow:'hidden', maxHeight:572, display:'flex', flexDirection:'column' }}>
          <div style={{ overflowY:'auto', padding:'16px 14px' }}>

            <div style={{ padding:'0 4px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <Eyebrow>Examen</Eyebrow><span style={{ fontSize:10.5, color:K.faint }}>3 disponibles</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {EXAMS.map(e => <ExamRow key={e.id} ex={e} active={e.id===activeId} onClick={()=>setActiveId(e.id)}/>)}
            </div>

            <div style={{ height:1, background:K.lineSoft, margin:'14px 4px' }}/>

            <div style={{ padding:'0 4px 10px', display:'flex', alignItems:'center', gap:8 }}>
              <Eyebrow>Mi puntuación</Eyebrow>
              <span style={{ fontSize:9.5, fontWeight:800, color:ex.color, background:ex.tint, padding:'2px 8px', borderRadius:999 }}>{ex.name}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'4px 6px 6px' }}>
              <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Ring pct={sc.acc} color={ex.color}/>
                <span style={{ position:'absolute', fontFamily:K.display, fontSize:15, fontWeight:800, color:ex.color }}>{sc.acc}<span style={{fontSize:9}}>%</span></span>
              </div>
              <div style={{ flex:1, display:'flex', gap:8 }}>
                {[{l:'Respondidas',v:sc.answered,c:K.ink},{l:'Correctas',v:sc.correct,c:ex.color},{l:'Nivel',v:sc.level,c:K.ochre,small:true}].map(s=>(
                  <div key={s.l} style={{ flex:1, background:K.bg, borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
                    <p style={{ fontFamily:K.display, fontSize:s.small?12:18, fontWeight:800, color:s.c, lineHeight:1.1 }}>{s.v}</p>
                    <p style={{ fontSize:9, color:K.sub, marginTop:3 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop:8, padding:'10px 12px', background:K.bg, borderRadius:13, display:'flex', flexDirection:'column', gap:9 }}>
              {ex.areas.map(a=>{
                const Icon = ICONS[a.id]
                return (
                  <div key={a.id} style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <Icon size={15} stroke={ex.color} sw={1.6}/>
                    <span style={{ flex:1, minWidth:0, fontSize:11, fontWeight:600, color:K.sub, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</span>
                    <div style={{ width:64, height:5, borderRadius:5, background:K.sunk, overflow:'hidden', flexShrink:0 }}>
                      <div style={{ height:'100%', width:`${a.pct}%`, background:ex.color, borderRadius:5 }}/>
                    </div>
                    <span style={{ fontFamily:K.display, fontSize:11, fontWeight:800, color:ex.color, width:30, textAlign:'right', flexShrink:0 }}>{a.pct}%</span>
                  </div>
                )
              })}
            </div>

            <div style={{ height:1, background:K.lineSoft, margin:'14px 4px' }}/>

            <div style={{ padding:'0 4px 4px' }}><Eyebrow>Ajustes</Eyebrow></div>
            <SettingRow icon={<IconTarget size={18} stroke={K.laurelDk} sw={1.6}/>} label="Meta diaria" sub={`${goal} preguntas al día`}
              right={<div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <button onClick={()=>setGoal(g=>Math.max(5,g-5))} style={{ width:26, height:26, borderRadius:8, border:`1px solid ${K.line}`, background:K.bg, color:K.sub, fontSize:16, fontWeight:700, cursor:'pointer', lineHeight:1 }}>–</button>
                <span style={{ fontFamily:K.display, fontSize:14, fontWeight:800, color:K.ink, width:22, textAlign:'center' }}>{goal}</span>
                <button onClick={()=>setGoal(g=>Math.min(60,g+5))} style={{ width:26, height:26, borderRadius:8, border:`1px solid ${K.line}`, background:K.bg, color:K.sub, fontSize:15, fontWeight:700, cursor:'pointer', lineHeight:1 }}>+</button>
              </div>}/>
            <SettingRow icon={<IconBell size={18} stroke={K.laurelDk} sw={1.6}/>} label="Recordatorios" sub="Aviso diario de estudio" right={<Toggle on={notif} onClick={()=>setNotif(v=>!v)}/>}/>
            <SettingRow icon={<IconSpark size={18} stroke={K.laurelDk} sw={1.6}/>} label="Tutor IA" sub="Explicaciones ampliadas" right={<Toggle on={tutor} onClick={()=>setTutor(v=>!v)}/>}/>
            <SettingRow icon={<IconSliders size={18} stroke={K.laurelDk} sw={1.6}/>} label="Preferencias" sub="Idioma, tema, cuenta" right={<span style={{ display:'flex', color:K.faint, transform:'rotate(-90deg)' }}><IconChevron size={18} stroke={K.faint}/></span>}/>

            <button style={{ width:'100%', marginTop:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              padding:'12px', borderRadius:13, background:'transparent', border:`1.5px solid ${K.line}`, color:K.terra,
              fontFamily:K.display, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              <IconLogout size={17} stroke={K.terra}/> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

Object.assign(window, { CALMO, scoreFor, Ring, Toggle, Eyebrow, ExamRow, SettingRow, DropdownMenu })
