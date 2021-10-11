import * as changes from "./changeHistory.js";
import * as colorSelection from "./colorSelection.js";

let canvas;
let ctx;

let size = {};

let canvasData;
let pixelData;

// Setup the drawing canvas
const initialize = (width, height, _canvas) => {
    size.width = width;
    size.height = height;

    canvas = _canvas;
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    setupImage();
};

// Setup the image on the drawing canvas
const setupImage = () => {
    canvasData = ctx.createImageData(size.width, size.height);
    pixelData = canvasData.data;

    for (let i = 0; i < pixelData.length; i += 4) {
        pixelData[i] = 0;
        pixelData[i + 1] = 0;
        pixelData[i + 2] = 0;
        pixelData[i + 3] = 0;
    }

    ctx.putImageData(canvasData, 0, 0);
};

// Set a pixel on the drawing canvas given a 2d point
const setPixel = (x, y, color) => {
    if ((x < 0 || x >= size.width) || (y < 0 || y >= size.height))
        return;

    let i = convertToPixelIndex(x, y, size.width);
    changes.addPixelChange(
        i,
        color,
        colorSelection.asColor(pixelData[i], pixelData[i + 1], pixelData[i + 2], pixelData[i + 3])
    );

    pixelData[i] = color.r;
    pixelData[i + 1] = color.g;
    pixelData[i + 2] = color.b;
    pixelData[i + 3] = color.a;
};

// Set a pixel on the drawing canvas given a 1d index
const setPixelI = (i, color) => {
    if (i < 0 || i >= pixelData.length)
        return;

    pixelData[i] = color.r;
    pixelData[i + 1] = color.g;
    pixelData[i + 2] = color.b;
    pixelData[i + 3] = color.a;
};

const getPixel = (x, y) => {
    if ((x < 0 || x >= size.width) || (y < 0 || y >= size.height))
        return;

    let i = convertToPixelIndex(x, y, size.width);
    return colorSelection.asColor(pixelData[i], pixelData[i + 1], pixelData[i + 2], pixelData[i + 3]);
}

// Set a line of pixels from one 2d point to another
// From https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript with some tweaks
const setPixels = (x0, y0, x1, y1, color) => {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        if (x0 === x1 && y0 === y1) break;

        setPixel(x0, y0, color);

        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 <= dx) {
            err += dx;
            y0 += sy;
        }
    }
};

// Applys the canvasData obj to the ctx image data
const applyCanvasData = () => {
    ctx.putImageData(canvasData, 0, 0);
}

// Converts a 2d point to a 1d index in the image data array
const convertToPixelIndex = (x, y, width) => {
    return y * (width * 4) + x * 4;
};

export { initialize, setPixel, setPixelI, getPixel, setPixels, applyCanvasData, canvas };