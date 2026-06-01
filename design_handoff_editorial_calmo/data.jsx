// data.jsx — shared exam data + a sample question for the mockups
const EXAMS = [
  {
    id: 'exani2', name: 'EXANI-II', short: 'Ingreso a Licenciatura',
    full: 'Examen Nacional de Ingreso a la Licenciatura',
    color: '#6B7C45', tint: '#EBF0DC',
    desc: 'Habilidades de pensamiento y conocimientos de bachillerato.',
    pct: 64,
    areas: [
      { id: 'mat', name: 'Pensamiento Matemático', correct: 19, total: 30, pct: 63 },
      { id: 'ana', name: 'Pensamiento Analítico', correct: 22, total: 30, pct: 73 },
      { id: 'lec', name: 'Comprensión Lectora', correct: 14, total: 30, pct: 47 },
      { id: 'red', name: 'Redacción Indirecta', correct: 9, total: 30, pct: 30, free: true },
    ],
  },
  {
    id: 'exani3', name: 'EXANI-III', short: 'Ingreso a Posgrado',
    full: 'Examen Nacional de Ingreso al Posgrado',
    color: '#5B6FA0', tint: '#E8ECFA',
    desc: 'Habilidades intelectuales avanzadas para posgrado.',
    pct: 38,
    areas: [
      { id: 'verb', name: 'Habilidad Verbal', correct: 12, total: 30, pct: 40 },
      { id: 'hmat', name: 'Habilidad Matemática', correct: 11, total: 30, pct: 37 },
      { id: 'leca', name: 'Comprensión Lectora Avanzada', correct: 10, total: 30, pct: 33 },
      { id: 'ing', name: 'Inglés Técnico', correct: 13, total: 30, pct: 43, locked: true },
    ],
  },
  {
    id: 'egel', name: 'EGEL', short: 'Egreso de Licenciatura',
    full: 'Examen General para el Egreso de la Licenciatura',
    color: '#A6643C', tint: '#F5EDE4',
    desc: 'Certifica conocimientos del área disciplinar.',
    pct: 12,
    areas: [
      { id: 'disc', name: 'Área Disciplinar', correct: 5, total: 40, pct: 12 },
      { id: 'etic', name: 'Ética Profesional', correct: 3, total: 20, pct: 15, locked: true },
      { id: 'com', name: 'Comunicación', correct: 2, total: 20, pct: 10, locked: true },
    ],
  },
]

const SAMPLE_Q = {
  area: 'Pensamiento Matemático',
  areaId: 'mat',
  n: 3, of: 12,
  q: 'Si una librería ofrece un 30% de descuento sobre un libro de $480 y luego aplica un 10% adicional sobre el precio ya rebajado, ¿cuál es el precio final?',
  opts: ['$302.40', '$288.00', '$336.00', '$316.80'],
  ans: 0,
  exp: 'Primero $480 × 0.70 = $336. Sobre ese precio, $336 × 0.90 = $302.40. Los descuentos sucesivos no se suman.',
}

const StatusBar = ({ color = '#3D3833' }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 20px 2px', fontSize: 12.5, fontWeight: 600, color,
    fontFamily: "'Inter', sans-serif", letterSpacing: '.02em',
  }}>
    <span>9:41</span>
    <span style={{ display: 'flex', gap: 5, alignItems: 'center', opacity: .85 }}>
      <svg width="17" height="11" viewBox="0 0 17 11" fill={color}><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
      <svg width="22" height="11" viewBox="0 0 22 11" fill="none" stroke={color} strokeWidth="1.1"><rect x="1" y="1" width="18" height="9" rx="2.5"/><rect x="2.5" y="2.5" width="13" height="6" rx="1.3" fill={color} stroke="none"/><rect x="20" y="3.6" width="1.6" height="3.8" rx="0.8" fill={color} stroke="none"/></svg>
    </span>
  </div>
)

Object.assign(window, { EXAMS, SAMPLE_Q, StatusBar })
