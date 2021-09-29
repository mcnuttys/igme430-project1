const clamp = (value, min, max) => {
    if (value < min)
        value = min;

    if (value > max)
        value = max;

    return value;
}

// YOINKED off internet: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255
    } : null;
}

const rgbToHex = (rgb) => {
    let r = ("00" + rgb.r.toString(16)).slice(-2);
    let g = ("00" + rgb.g.toString(16)).slice(-2);
    let b = ("00" + rgb.b.toString(16)).slice(-2);
    return `#${r}${g}${b}`;
}

export { clamp, hexToRgb, rgbToHex };