// Clamp a value between the min and max
const clamp = (value, min, max) => {
    if (value < min)
        value = min;

    if (value > max)
        value = max;

    return value;
}

// Convert a position from one size space to another (Not even sure if this is the correct mathimatical approach but it works!)
const convertPosFromSizeToSize = (x, y, displaySize, drawingSize) => {
    return {
        x: Math.floor((x / displaySize.width) * drawingSize.width),
        y: Math.floor((y / displaySize.height) * drawingSize.height)
    };
};

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

// Do the inverse of the above hexToRgb, comes from the same page
const rgbToHex = (rgb) => {
    let r = ("00" + rgb.r.toString(16)).slice(-2);
    let g = ("00" + rgb.g.toString(16)).slice(-2);
    let b = ("00" + rgb.b.toString(16)).slice(-2);
    return `#${r}${g}${b}`;
}

export { clamp, hexToRgb, rgbToHex, convertPosFromSizeToSize };