import * as utils from "./utils.js";

const selectedColor = { r: 255, g: 255, b: 255, a: 255 };

const initialize = () => {
    const colorPicker = document.querySelector("#colorPicker");

    colorPicker.onchange = colorPickerChange;
}

const colorPickerChange = (e) => {
    const color = utils.hexToRgb(e.target.value);
    setSelectedColor(color.r, color.g, color.b, color.a);
}

const setSelectedColor = (r, g, b, a) => {
    selectedColor.r = r;
    selectedColor.g = g;
    selectedColor.b = b;
    selectedColor.a = a;
}

const getSelectedColor = () => {
    return selectedColor;
}

const asColor = (r, g, b, a = 255) => {
    return {
        r: r,
        g: g,
        b: b,
        a: a
    }
}

export { initialize, getSelectedColor, asColor };