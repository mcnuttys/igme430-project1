import * as utils from "./utils.js";

let colorSelector;
const selectedColor = { r: 0, g: 0, b: 0, a: 255 };

// Setup the color selector DOM element
const initialize = () => {
    colorSelector = document.querySelector("#colorPicker");

    colorSelector.onchange = colorPickerChange;
}

// when the color selecter changes call this
const colorPickerChange = (e) => {
    const color = utils.hexToRgb(e.target.value);
    setSelectedColor(color.r, color.g, color.b, color.a);
}

// Gets the currently selected color
const getSelectedColor = () => {
    return selectedColor;
}

// Sets the dom element and selected color
const setSelectorColor = (color) => {
    setSelectedColor(color.r, color.g, color.b, color.a);
    colorSelector.value = utils.rgbToHex(selectedColor);
}

// sets the currently selected color
const setSelectedColor = (r, g, b, a) => {
    selectedColor.r = r;
    selectedColor.g = g;
    selectedColor.b = b;
    selectedColor.a = a;
}

// Converts given r, g, b, a values to a color object
const asColor = (r, g, b, a = 255) => {
    return {
        r: r,
        g: g,
        b: b,
        a: a
    }
}

export { initialize, getSelectedColor, setSelectorColor, asColor };