export function getRGBFromNumber(number) {
  const r = (number >> 16) & 0xFF;
  const g = (number >> 8) & 0xFF;
  const b = number & 0xFF;
  return { r, g, b };
}

export function getTempHexColor(kelvin) {
  const value = Math.max(2000, Math.min(9000, kelvin));

  // Base colors
  const warm = { r: 0xFF, g: 0xD2, b: 0x9D }; // 2000K
  const mid  = { r: 0xFF, g: 0xFF, b: 0xFF }; // 5500K
  const cool = { r: 0x8D, g: 0xCD, b: 0xFB }; // 9000K

  const midPoint = 5500;

  let r, g, b;

  if (value <= midPoint) {
    // Interpolate warm -> white
    const t = (value - 2000) / (midPoint - 2000); 
    r = warm.r + (mid.r - warm.r) * t;
    g = warm.g + (mid.g - warm.g) * t;
    b = warm.b + (mid.b - warm.b) * t;
  } else {
    // Interpolate white -> cool
    const t = (value - midPoint) / (9000 - midPoint);
    r = mid.r + (cool.r - mid.r) * t;
    g = mid.g + (cool.g - mid.g) * t;
    b = mid.b + (cool.b - mid.b) * t;
  }

  return { r, g, b };
}