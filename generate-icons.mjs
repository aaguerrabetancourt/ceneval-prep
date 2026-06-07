import sharp from 'sharp'

// Icono Certus: fondo verde laurel con "C" blanca
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#7E9A77"/>
  <rect x="30" y="30" width="452" height="452" rx="80" fill="#F1EBDE"/>
  <!-- Fondo verde interno -->
  <rect x="50" y="50" width="412" height="412" rx="70" fill="#7E9A77"/>
  <!-- Letra C grande -->
  <text x="256" y="340"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="280"
    font-weight="bold"
    fill="#F1EBDE">C</text>
  <!-- Punto verde laurel oscuro debajo -->
  <text x="256" y="430"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="60"
    font-weight="bold"
    fill="#566F50">CERTUS</text>
</svg>`

const buf = Buffer.from(svgIcon)

await sharp(buf).resize(192, 192).png().toFile('public/pwa-192.png')
console.log('✅ pwa-192.png generado')

await sharp(buf).resize(512, 512).png().toFile('public/pwa-512.png')
console.log('✅ pwa-512.png generado')

// Icono para Apple Touch
await sharp(buf).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('✅ apple-touch-icon.png generado')
