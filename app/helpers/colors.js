export function getRGBFromNumber(number) {
  const r = (number >> 16) & 0xFF;
  const g = (number >> 8) & 0xFF;
  const b = number & 0xFF;
  return { r, g, b };
}

export function resolveColorFromRgb(rgb) {
  const { r, g, b } = getRGBFromNumber(rgb)
  return `rgb(${r}, ${g}, ${b})`
}

export function resolveColorFromTemp(temp) {
  const { r, g, b } = getTempHexColor(temp)
  return `rgb(${r}, ${g}, ${b})`
}


export function hslaToPackedRgb(hsla) {
  let { h, s, l } = hsla

  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0

  if (h < 60)       { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else              { r = c; b = x }

  const R = Math.round((r + m) * 255)
  const G = Math.round((g + m) * 255)
  const B = Math.round((b + m) * 255)

  return (R << 16) | (G << 8) | B
}


export function packedRgbToHsla(color) {
  let r = (color >> 16) & 255
  let g = (color >> 8) & 255
  let b = color & 255


  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))

    switch (max) {
      case r:
        h = ((g - b) / delta) % 6
        break
      case g:
        h = (b - r) / delta + 2
        break
      case b:
        h = (r - g) / delta + 4
        break
    }

    h *= 60
    if (h < 0) h += 360
  }

  return {
    h,
    s: s * 100,
    l: l * 100,
    a: 1,
  }
}



export function getTempHexColor(kelvin) {
  const value = Math.max(2000, Math.min(9000, kelvin));

  const warm = { r: 0xFF, g: 0xD2, b: 0x9D }; // 2000K
  const mid  = { r: 0xFF, g: 0xFF, b: 0xFF }; // 5500K
  const cool = { r: 0x8D, g: 0xCD, b: 0xFB }; // 9000K

  const midPoint = 5500;

  let r, g, b;

  if (value <= midPoint) {
    const t = (value - 2000) / (midPoint - 2000); 
    r = warm.r + (mid.r - warm.r) * t;
    g = warm.g + (mid.g - warm.g) * t;
    b = warm.b + (mid.b - warm.b) * t;
  } else {
    const t = (value - midPoint) / (9000 - midPoint);
    r = mid.r + (cool.r - mid.r) * t;
    g = mid.g + (cool.g - mid.g) * t;
    b = mid.b + (cool.b - mid.b) * t;
  }

  return { r, g, b };
}

export function rgbStringToColorMatrix( rgb, alpha = 0.5) 
{
  const match = rgb.match(/\d+/g);
  if (!match) {
    throw new Error(`Invalid rgb string: ${rgb}`);
  }

  const [r, g, b] = match.map(n => Number(n) / 255);

  return `
    0 0 0 0 ${r}
    0 0 0 0 ${g}
    0 0 0 0 ${b}
    0 0 0 ${alpha} 0
  `;
}

export function rgbNumberToHsla(rgb) {
  const r = ((rgb >> 16) & 255) / 255
  const g = ((rgb >> 8) & 255) / 255
  const b = (rgb & 255) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }

  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))

  return {
    h,
    s: s * 100,
    l: l * 100,
    a: 1, 
  }
}

export function hslaToRgbNumber(h, s, l) {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const R = Math.round((r + m) * 255)
  const G = Math.round((g + m) * 255)
  const B = Math.round((b + m) * 255)

  return (R << 16) + (G << 8) + B
}
