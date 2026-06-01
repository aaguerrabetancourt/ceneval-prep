// icons.jsx — Custom Certus icon set (reemplaza todos los emoji)
// Iconos geometricos 24x24, trazo redondeado, fill:none por defecto.
// Props: size, stroke (color), sw (stroke-width), fill (duotono)

const ic = (paths, { size = 24, stroke = 'currentColor', sw = 1.7, fill = 'none' } = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths(fill)}
  </svg>
)

// Examenes
export const IconCap = (p) => ic((fill) => (<>
  <path d="M2.5 8.5 12 4.5l9.5 4-9.5 4-9.5-4Z" fill={fill} />
  <path d="M6 10.5V15c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5" />
  <path d="M21.5 8.5v4.2" />
</>), p)

export const IconMicroscope = (p) => ic((fill) => (<>
  <path d="M6 18h11" />
  <path d="M8.5 18a6 6 0 0 0 6-6" />
  <path d="m9.2 13.3-2.1-2.1 2.3-2.3 2.1 2.1Z" fill={fill} />
  <path d="m11.1 7.4 1.9-1.9 2.5 2.5-1.9 1.9" />
  <path d="M6 21h9" />
</>), p)

export const IconColumns = (p) => ic((fill) => (<>
  <path d="M3.5 8.5 12 4l8.5 4.5H3.5Z" fill={fill} />
  <path d="M5.5 8.5v8M10 8.5v8M14 8.5v8M18.5 8.5v8" />
  <path d="M3.5 19.5h17" />
</>), p)

// EXANI-II areas
export const IconCompass = (p) => ic((fill) => (<>
  <path d="M12 3.5 5 19" />
  <path d="M12 3.5 19 19" />
  <path d="M8.7 11.5h6.6" />
  <circle cx="12" cy="3.5" r="1.3" fill={fill} />
</>), p)

export const IconPuzzle = (p) => ic((fill) => (<>
  <path d="M10 4.5h4v2.2a1.6 1.6 0 1 0 3.2 0V4.5H20v4.3h-2.2a1.6 1.6 0 1 0 0 3.2H20v4.5h-4.3v-2.2a1.6 1.6 0 1 0-3.2 0V16.5H8v-4.3h2.2a1.6 1.6 0 1 0 0-3.2H8Z" fill={fill} />
</>), p)

export const IconBook = (p) => ic((fill) => (<>
  <path d="M12 6.5C10.5 5 8 4.5 5 5v12c3-.5 5.5 0 7 1.5" fill={fill} />
  <path d="M12 6.5C13.5 5 16 4.5 19 5v12c-3-.5-5.5 0-7 1.5" />
  <path d="M12 6.5v12" />
</>), p)

export const IconPencil = (p) => ic((fill) => (<>
  <path d="M15.5 5.5 18.5 8.5 9 18l-3.5.9.9-3.5Z" fill={fill} />
  <path d="m14 7 3 3" />
  <path d="M4 21h11" />
</>), p)

// EXANI-III areas
export const IconChat = (p) => ic((fill) => (<>
  <path d="M4.5 6.5h15v9h-9l-4 3.5v-3.5h-2Z" fill={fill} />
  <path d="M8 10h8M8 12.5h5" />
</>), p)

export const IconHash = (p) => ic((fill) => (<>
  <rect x="4.5" y="4.5" width="15" height="15" rx="3.5" fill={fill} />
  <path d="M9.5 4.8 8.5 19.2M15.5 4.8l-1 14.4M4.8 9.5h14.4M4.6 14.5H19" />
</>), p)

export const IconBooks = (p) => ic((fill) => (<>
  <rect x="4.5" y="5" width="3.6" height="14" rx="1" fill={fill} />
  <rect x="8.6" y="5" width="3.6" height="14" rx="1" />
  <path d="m13.3 6 3.4-1 3 13.6-3.4 1Z" fill={fill} />
  <path d="M5 9h3M9 9h3" />
</>), p)

export const IconGlobe = (p) => ic((fill) => (<>
  <circle cx="12" cy="12" r="7.5" fill={fill} />
  <path d="M4.5 12h15M12 4.5c2.2 2 2.2 13 0 15M12 4.5c-2.2 2-2.2 13 0 15" />
</>), p)

// EGEL areas
export const IconTarget = (p) => ic((fill) => (<>
  <circle cx="12" cy="12" r="8" fill={fill} />
  <circle cx="12" cy="12" r="4.4" />
  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
</>), p)

export const IconScale = (p) => ic((fill) => (<>
  <path d="M12 4.5v15" />
  <path d="M6 19.5h12" />
  <path d="M5 7.5h14" />
  <path d="m5 7.5-2.5 5h5Z" fill={fill} />
  <path d="m19 7.5-2.5 5h5Z" fill={fill} />
</>), p)

export const IconSignal = (p) => ic((fill) => (<>
  <circle cx="12" cy="13" r="2.3" fill={fill} />
  <path d="M8.4 9.4a5 5 0 0 0 0 7.2M15.6 9.4a5 5 0 0 1 0 7.2" />
  <path d="M5.8 6.8a8.7 8.7 0 0 0 0 12.4M18.2 6.8a8.7 8.7 0 0 1 0 12.4" />
</>), p)

// UI / sistema
export const IconFlame = (p) => ic((fill) => (<>
  <path d="M12 3.5c.8 3-2.2 4.3-2.2 7.2 0 1 .5 1.8 1.2 2.3-.4-1.6.6-2.7 1.3-3.2.1 2.4 2.7 3 2.7 5.6A4.9 4.9 0 0 1 12 20.5 5.3 5.3 0 0 1 6.7 15c0-4.5 4.2-5.6 5.3-11.5Z" fill={fill} />
</>), p)

export const IconChart = (p) => ic((fill) => (<>
  <path d="M4 4.5v15h15.5" />
  <path d="M8 16v-3.5M12 16V8M16 16v-5.5" />
  <path d="M8 12.5 12 8l4 2.5 3.5-5" />
</>), p)

export const IconSpark = (p) => ic((fill) => (<>
  <path d="M12 4c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5Z" fill={fill} />
  <path d="M18.5 13.5c.3 1.4.7 1.8 2 2-1.3.3-1.7.7-2 2-.3-1.3-.7-1.7-2-2 1.3-.2 1.7-.6 2-2Z" fill={fill} />
</>), p)

export const IconLock = (p) => ic((fill) => (<>
  <rect x="5.5" y="10.5" width="13" height="9" rx="2.5" fill={fill} />
  <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  <path d="M12 14v2.2" />
</>), p)

export const IconCheck = (p) => ic(() => (<path d="m5 12.5 4.5 4.5L19 6.5" />), p)
export const IconX = (p) => ic(() => (<><path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" /></>), p)
export const IconArrowLeft = (p) => ic(() => (<><path d="M19 12H5M11 6 5 12l6 6" /></>), p)
export const IconArrowRight = (p) => ic(() => (<><path d="M5 12h14M13 6l6 6-6 6" /></>), p)
export const IconClock = (p) => ic((fill) => (<><circle cx="12" cy="12" r="8" fill={fill} /><path d="M12 7.5V12l3 1.8" /></>), p)

// Menu / ajustes
export const IconChevron = (p) => ic(() => (<path d="m6 9.5 6 6 6-6" />), p)
export const IconBell = (p) => ic((fill) => (<>
  <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 2H4.4Z" fill={fill} />
  <path d="M10 19.5a2 2 0 0 0 4 0" />
</>), p)
export const IconSliders = (p) => ic((fill) => (<>
  <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
  <circle cx="16" cy="8" r="2.4" fill={fill} />
  <circle cx="8" cy="16" r="2.4" fill={fill} />
</>), p)
export const IconLogout = (p) => ic(() => (<>
  <path d="M14 7.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.5" />
  <path d="M10 12h10M17 9l3 3-3 3" />
</>), p)

// Mapa id -> icono
export const ICONS = {
  exani2: IconCap, exani3: IconMicroscope, egel: IconColumns,
  mat: IconCompass, ana: IconPuzzle, lec: IconBook, red: IconPencil,
  verb: IconChat, hmat: IconHash, leca: IconBooks, ing: IconGlobe,
  disc: IconTarget, etic: IconScale, com: IconSignal,
}
