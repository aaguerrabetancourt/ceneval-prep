# Handoff: Certus — Rediseño "Editorial Calmo"

## Overview
Rediseño integral de la identidad visual de **Certus** (app de preparación para exámenes CENEVAL: EXANI-II, EXANI-III, EGEL). La dirección elegida es **"Editorial Calmo"**: un refinamiento de la identidad actual (cálida y orgánica) con más aire, jerarquía tipográfica fuerte, anillos de progreso, una **iconografía propia que reemplaza por completo a los emoji**, y un **menú desplegable superior** que funciona como centro de control (cambiar de examen, ver puntuación y ajustes). El dashboard pasa a ser **exam-driven**: el examen activo se elige en el menú y todo el tablero se actualiza.

La marca (nombre Certus, logo de laurel, paleta y tipografías Montserrat + Inter) se **conserva y refina** — no se inventaron colores ni fuentes nuevas.

## About the Design Files
Los archivos `.html`/`.jsx` de este bundle son **referencias de diseño creadas en HTML/React** (prototipos del look & feel y el comportamiento), **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños dentro del codebase existente** de Certus — un proyecto **Vite + React** (`ceneval-prep/`), con `@clerk/clerk-react` para auth y un backend `api/tutor.js` (Anthropic) — reutilizando sus patrones actuales (componentes funcionales, estilos inline basados en un objeto de tokens `T` en `src/constants/theme.js`, datos en `src/constants/exams.js` y `src/data/questions.js`).

En concreto: este rediseño **sustituye** el objeto de tokens `T` actual por la paleta refinada de abajo, **agrega** un set de íconos SVG (reemplazando los emoji que hoy viven en `exams.js` y en los componentes), e **introduce** dos piezas nuevas de UX (menú desplegable + dashboard exam-driven). La lógica de negocio (Clerk, límite gratis, premium, racha, Tutor IA, progreso en localStorage) **no cambia**; sólo cambia la capa visual y la navegación superior.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciado, radios e interacciones son finales. Recrear pixel-perfect con los patrones del codebase. Las medidas están dadas para un ancho de pantalla móvil de ~320–340px (la app actual usa un `Shell` de `maxWidth: 480`).

## Capturas (carpeta `screenshots/`)
- `01-dashboard.png` — Dashboard exam-driven (estado cerrado).
- `02-menu-desplegable.png` — Menú desplegable abierto (selector de examen + puntuación + ajustes).
- `03-direccionA-pantallas.png` — Las 4 pantallas de la dirección elegida (Inicio, Detalle de examen, Pregunta, Resultado).
- `04-iconografia.png` — Lámina de los 21 íconos y el emoji que reemplaza cada uno.

> En `03` la pantalla "Detalle de examen" muestra el logo mini con interletraje irregular: es el artefacto del SVG-como-`<img>` descrito en la sección **Logo** (en la app real, renderizar el logo mini **inline** para que use Montserrat).

---

## Design Tokens

### Paleta "Editorial Calmo" (reemplaza el objeto `T` actual)
Mapeada a las llaves que ya usa `src/constants/theme.js`:

```js
export const T = {
  // Fondos — papel cálido (nunca blanco puro)
  bg: "#F1EBDE", bgCard: "#FBF8F0", bgMuted: "#ECE4D4",
  // Texto — marrón orgánico
  text: "#3B362F", textSub: "#857A6C", textMuted: "#B3A899",
  // Verde laurel (acento principal)
  olive: "#7E9A77", oliveLt: "#E3EEDD", oliveDk: "#566F50",
  // Respuestas correctas — verde laurel
  correct: "#566F50", correctBg: "#E3EEDD", correctBd: "#7E9A77",
  // Respuestas incorrectas — terracota
  wrong: "#C2664F", wrongBg: "#F4E3DD", wrongBd: "#C2664F",
  // Ocre arena — acentos y racha
  streak: "#B08D4F", streakBg: "#F6ECD6",
  accent: "#B08D4F", accentLt: "#F6ECD6", accentDk: "#8A6E3A",
  // Bordes
  border: "#E4DACA", borderDk: "#D5C9B5", borderSoft: "#EFE8DA",
  // Overlay / scrim para el menú
  scrim: "rgba(48,43,37,.34)",
  // Tipografías (Google Fonts)
  fontDisplay: "'Montserrat', sans-serif",
  fontBody: "'Inter', sans-serif",
};
```

### Colores de acento por examen (en `exams.js`, llaves `color` y `colorLight`)
| Examen | `color` | `tint` / `colorLight` |
|---|---|---|
| EXANI-II | `#6B7C45` (oliva) | `#EBF0DC` |
| EXANI-III | `#5B6FA0` (azul pizarra) | `#E8ECFA` |
| EGEL | `#A6643C` (terracota cálida) | `#F5EDE4` |

> Nota: el código actual usa `#8B5E3C` para EGEL; el rediseño lo aclara a `#A6643C` para más calidez. Cualquiera de los dos funciona — es preferencia.

### Tipografía
- **Display:** Montserrat — pesos 600 / 700 / 800. Usado en títulos, nombres de examen/área, números grandes, botones. Tracking ceñido en titulares: `letter-spacing: -0.02em`.
- **Cuerpo:** Inter — pesos 400 / 500 / 600 / 700 / 800.
- **Eyebrow / etiquetas:** Inter 700, `font-size: 10.5–11px`, `letter-spacing: .16em`, `text-transform: uppercase`, color `textMuted` u `ochre`.
- Escala típica (móvil): título pantalla 24–27px/800; título examen 15–17px/700–800; cuerpo 12.5–14px; meta 11px; números hero 40–64px/800.
- Import: `Montserrat:wght@600;700;800` + `Inter:wght@400;500;600;700;800`.

### Espaciado, radios, sombras
- **Radios:** tarjetas 15–20px; tokens de ícono 11–16px; píldoras/badges 999px; botones 13–16px.
- **Bordes:** hairline 1px `border`; tarjetas 1–1.5px. Inputs/seleccionados 1.5–2px en `olive`.
- **Sombras (sutiles, cálidas):**
  - Tarjeta: `0 1px 2px rgba(74,67,62,.04), 0 8px 22px -16px rgba(74,67,62,.22)`
  - Elevada (phone/menú): `0 24px 48px -24px rgba(48,43,37,.55)`
- **Barras de progreso:** alto 5–8px, radio completo, track `bgMuted`, relleno en color del examen, `transition: width .35s`.
- **Anillos de progreso (Ring):** SVG, stroke 3.5–8px, track `border`, relleno en color del examen, `stroke-linecap: round`, rotado -90°.

---

## Iconografía (reemplaza TODOS los emoji)
Set propio de **21 íconos** SVG, trazo geométrico con remates redondeados, viewBox 24×24, `stroke-width` 1.6–1.7, `fill: none` por defecto (heredan `currentColor`; opción de duotono pasando un `fill` claro). Archivo de referencia: **`icons.jsx`** (componentes React listos: `<IconCap size stroke sw fill />`, etc.) y un mapa `ICONS[id]`.

| Contexto (id) | Emoji que reemplaza | Componente |
|---|---|---|
| EXANI-II (`exani2`) | 🎓 | `IconCap` |
| EXANI-III (`exani3`) | 🔬 | `IconMicroscope` |
| EGEL (`egel`) | 🏛️ | `IconColumns` |
| Pensamiento Matemático (`mat`) | 📐 | `IconCompass` |
| Pensamiento Analítico (`ana`) | 🧩 | `IconPuzzle` |
| Comprensión Lectora (`lec`) | 📖 | `IconBook` |
| Redacción Indirecta (`red`) | ✍️ | `IconPencil` |
| Habilidad Verbal (`verb`) | 💬 | `IconChat` |
| Habilidad Matemática (`hmat`) | 🔢 | `IconHash` |
| Comp. Lectora Avanzada (`leca`) | 📚 | `IconBooks` |
| Inglés Técnico (`ing`) | 🌐 | `IconGlobe` |
| Área Disciplinar (`disc`) | 🎯 | `IconTarget` |
| Ética Profesional (`etic`) | ⚖️ | `IconScale` |
| Comunicación (`com`) | 📡 | `IconSignal` |
| Racha | 🔥 | `IconFlame` |
| Progreso | 📊 | `IconChart` |
| Tutor IA | 🤖 | `IconSpark` |
| Premium / bloqueado | 🔒 | `IconLock` |
| Correcto | ✅ | `IconCheck` |
| Incorrecto | ❌ | `IconX` |
| Navegación / siguiente | ➡️ ⬅️ | `IconArrowRight` / `IconArrowLeft` |

Íconos de UI adicionales en `icons.jsx`: `IconChevron`, `IconBell`, `IconSliders`, `IconLogout`, `IconClock`.

**Uso típico:** ícono dentro de un "token" cuadrado redondeado (38–46px, radio 11–14px) con fondo `tint` del examen o `bgMuted`; stroke en el color del examen o `oliveDk`.

---

## Logo
- **Logo completo** (`assets/certus-logo.svg`): emblema de laurel + "CERTUS" + bajada "PREPÁRATE CON CONFIANZA". **Úsalo solo en la página de inicio / login** (donde hay espacio y es el momento de marca principal).
- **Logo mini** (`assets/certus-logo-mini.svg`): emblema de laurel + "CERTUS" (sin bajada). **Úsalo en todo lo demás** (encabezados de pantallas secundarias y cualquier tamaño pequeño, desde ~26px de alto). Corona en verde laurel `#8FA88B`, emblema y wordmark en `#4A433E`.
  - ⚠️ El wordmark "CERTUS" del mini usa la fuente **Montserrat Bold**. En un SVG cargado vía `<img>` la fuente de la página NO se hereda → renderiza con fuente de sistema y el interletraje (calibrado para Montserrat) se ve irregular. **En el codebase, renderiza el logo mini inline (SVG en el JSX), no como `<img>`**, para que tome la Montserrat ya cargada y se vea correcto. (Alternativa robusta: convertir el texto a contornos/paths en el SVG.)

---

## Screens / Views

### 1. Dashboard (Inicio) — *exam-driven*, con menú desplegable
Archivo de referencia: **`Certus Dashboard.html`**.
- **Propósito:** punto de entrada tras login. Muestra el examen activo y sus áreas; permite reanudar la práctica.
- **Layout (de arriba a abajo):**
  1. **Status bar** simulada (omitir en app real).
  2. **Header "switcher"** (z-index alto, siempre visible): botón que ocupa el ancho con `[token-ícono del examen] [eyebrow "ESTUDIANDO" en ochre] [nombre del examen, Montserrat 800/15px] [chevron]`, más una **píldora de racha** a la derecha (`bg streakBg`, ícono `IconFlame` ochre + número). Tocar el botón abre/cierra el **menú desplegable** (rota el chevron 180°). Tarjeta `bgCard`, borde `border`, radio 15px, padding 9–12px.
  3. **Contenido scrolleable** (se aplica `filter: blur(1.5px)` cuando el menú está abierto):
     - Saludo: "Buen día, Mariana." (Montserrat 800/25px, `letter-spacing:-.02em`) + subtítulo "Vas **{acc}%** de aciertos en **{examen}**." (acc en color del examen).
     - **Tarjeta "Continúa donde quedaste"** (`bg oliveLt`, radio 20px): eyebrow `oliveDk`; fila con token-ícono blanco del área recomendada (= **el área de menor `pct`** del examen), nombre (Montserrat 700/16px), "{correct}/{total} correctas · {pct}%", y un **Ring** pequeño (50px) a la derecha; botón **"Reanudar práctica →"** (`bg olive`, texto blanco, Montserrat 700).
     - **Lista "Áreas de {examen}"**: eyebrow + contador. Cada área = tarjeta `bgCard`/`border`/radio 15px: token-ícono `tint`, nombre 13.5px/700, "{correct}/{total} correctas", a la derecha `pct%` en color del examen **o** badge "🔒 Premium" (`IconLock`, texto ochre, `bg streakBg`) si `locked`; barra de progreso; línea "3 preguntas gratis restantes" en ochre si `free`.
     - Botón **"Ver mi progreso completo"** (ghost: `bgCard`, borde `border`, texto `oliveDk`, `IconChart`).
- **Comportamiento:** al cambiar de examen en el menú, **todo** lo de arriba se recalcula (saludo, tarjeta continuar, lista de áreas, colores).

### 2. Menú desplegable (overlay desde el header)
Archivo de referencia: **`Certus Menú Desplegable.html`** (componente `DropdownMenu` en **`calmo.jsx`**).
- **Propósito:** centro de control — seleccionar examen, ver puntuación, ajustar preferencias.
- **Layout:** **scrim** semitransparente (`scrim`, cierra al tocar) + **panel** que baja desde el header (`transform: translateY(-118% → 0)`, `opacity 0→1`, `transition .32s cubic-bezier(.22,1,.36,1)`). Panel `bgCard`, radio 22px, sombra elevada, `max-height ~572px` con scroll interno. Secciones:
  1. **EXAMEN** — 3 filas seleccionables (`ExamRow`): activo con fondo `oliveLt`, borde `olive` y check circular `olive`; inactivo muestra su `pct%`. token-ícono 38px.
  2. **MI PUNTUACIÓN · {examen}** (etiqueta con el nombre del examen en su color sobre su `tint`): **Ring** con `acc%` en color del examen + 3 mini-stats (Respondidas, Correctas, Nivel) + **desglose por área** (lista con ícono, nombre, mini-barra y `pct%`, todo en el color del examen).
  3. **AJUSTES** — "Meta diaria" con stepper –/+ (5–60); "Recordatorios" (Toggle); "Tutor IA" (Toggle); "Preferencias" (fila con chevron); botón **"Cerrar sesión"** (ghost, texto `wrong`/terracota, `IconLogout`).

### 3. Detalle de examen
Referencia: dirección A en **`Certus Identidad Visual.html`** (`directionA.jsx` → `ExamA`). Header con botón atrás (token), **logo mini**, eyebrow color examen, nombre (Montserrat 800/26px), nombre completo, barra de progreso global + "{pct}% completado · N áreas". Lista de áreas como en el dashboard.

### 4. Pregunta + feedback
Referencia: `directionA.jsx → QuestionA`. Top bar: `IconX` (salir) + barra de progreso (color examen) + píldora de racha. Eyebrow "{área} · {n}/{total}" con ícono. Enunciado en Montserrat 600/18px, `line-height 1.5`. Opciones: tarjetas `bgCard`/borde, con cuadro de letra A–D; **correcta** = `bg correctBg`, borde `correct`, cuadro con `IconCheck` blanco; seleccionada-incorrecta = `wrongBg`/`wrong`. Bloque de feedback (`correctBg`/`wrongBg`) con título `IconCheck`/`IconX`, explicación, y botón **"Pídele más al Tutor IA"** (`IconSpark`). Botón inferior **"Siguiente →"**.

### 5. Resultado
Referencia: `directionA.jsx → ResultA`. Eyebrow "Resultado · {área}", título "¡Excelente trabajo!" / "Sigue practicando" (Montserrat 800/25px). **Ring grande** (150px) con `pct%` central + "{correct}/{total}". Fila de 3 stats (Correctas/Incorrectas/Racha) en cajas `correctBg`/`wrongBg`/`streakBg`. Tarjeta de aliento con `IconSpark`. Botones "Practicar de nuevo" (sólido olive) + "Ir al inicio" (ghost).

---

## Interactions & Behavior
- **Abrir/cerrar menú:** tocar el header switcher togglea `open`; el scrim y "tocar fuera" cierran. Chevron rota 180°. Contenido detrás se desenfoca (`blur(1.5px)`).
- **Cambiar de examen:** actualiza el `activeId` global → recalcula dashboard, tarjeta "continuar" (área de menor `pct`), puntuación y desglose. Color de acento sigue al examen.
- **Stepper meta diaria:** ±5, límites 5–60.
- **Toggles:** Recordatorios y Tutor IA (estado persistible).
- **Transiciones:** panel `.32s cubic-bezier(.22,1,.36,1)`; barras `width .35s ease`; anillos `stroke-dashoffset .5s ease`; blur/scrim `.25s`.
- **Hit targets:** mínimo 44px en controles táctiles.

## State Management
Reutiliza el estado actual (Clerk, `cp_progress`, `cp_free`, `cp_premium`, `cp_streak` en localStorage). **Nuevo estado:**
- `activeExamId` (global, persistible) — examen seleccionado en el menú.
- `menuOpen` (bool).
- Ajustes: `dailyGoal` (num), `remindersOn` (bool), `tutorOn` (bool) — persistibles.
- **Puntuación derivada por examen** (no se hardcodea): `answered = Σ area.total`, `correct = Σ area.correct`, `acc = round(correct/answered*100)`, `level = acc≥65 'Avanzado' : acc≥40 'Intermedio' : 'Inicial'`. (Ver `scoreFor()` en `calmo.jsx`.) En producción, derivar de los datos reales de progreso del usuario.

## Design Tokens (resumen)
Ver sección **Design Tokens** arriba — paleta `T`, acentos por examen, tipografía, radios, sombras, anillos y barras.

## Assets
- `assets/certus-logo.svg` — logo completo (inicio/login).
- `assets/certus-logo-mini.svg` — logo mini (resto; renderizar inline para fuente correcta).
- `icons.jsx` — 21+ íconos SVG propios (reemplazan emoji) + mapa `ICONS`.
- Fuentes: Google Fonts Montserrat + Inter (ya cargadas en `index.html`).
- Sin imágenes raster; todo es SVG/CSS.

## Files (referencias en este bundle)
- `Certus Dashboard.html` — dashboard exam-driven + menú integrado (pantalla principal). Depende de `icons.jsx`, `data.jsx`, `calmo.jsx`.
- `Certus Menú Desplegable.html` — el menú desplegable aislado.
- `Certus Identidad Visual.html` — comparativa de 3 direcciones × 4 pantallas (la elegida es **A · Editorial Calmo**). Depende de `icons.jsx`, `data.jsx`, `direction{A,B,C}.jsx`, `design-canvas.jsx`.
- `Certus Iconografía.html` — lámina de los 21 íconos y el emoji que reemplaza cada uno.
- `calmo.jsx` — **sistema Editorial Calmo**: tokens (`CALMO`), `scoreFor`, primitivas (`Ring`, `Toggle`, `Eyebrow`, `ExamRow`, `SettingRow`) y `DropdownMenu`. Mejor punto de partida para portar.
- `icons.jsx` — set de íconos.
- `data.jsx` — datos de ejemplo (exámenes/áreas/pregunta) y `StatusBar`.
- `directionA.jsx` — pantallas de la dirección elegida (Home/Exam/Question/Result).
- `assets/` — logos.

> Las direcciones B y C (`directionB.jsx`, `directionC.jsx`) se incluyen solo como alternativas descartadas; **implementar la dirección A**.
