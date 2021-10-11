import * as colorSelector from "./colorSelection.js";
import * as drawingCanvas from "./drawingCanvas.js";
import * as utils from "./utils.js";

let toolStruct;
let currentTool;
let changeMessage;

// Setup the tools script, references and such, 
// if I were to recode this I would have it pass in the document stuff 
// so that all the document querying was happing in a single script
const initialize = () => {
    document.querySelector("#eraser").onclick = onClickEraserTool;
    document.querySelector("#pencil").onclick = onClickPencilTool;
    document.querySelector("#dropper").onclick = onClickDropperTool;

    toolStruct = {
        Eraser: useEraser,
        Pencil: usePencil,
        Dropper: useDropper
    };

    currentTool = toolStruct.Pencil;
}

// Use whatever the current tool is on this position
const useTool = (mousePos, lastMousePos, displaySize, drawingSize) => {
    currentTool(mousePos, lastMousePos, displaySize, drawingSize);
}

// Use the eraser on the mouse position
const useEraser = (mousePos, lastMousePos, displaySize, drawingSize) => {
    changeMessage = "Erased Pixels..."

    if (lastMousePos != null) {
        let mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
        let lastMousePixelPos = utils.convertPosFromSizeToSize(lastMousePos.x, lastMousePos.y, displaySize, drawingSize);

        drawingCanvas.setPixels(mousePixelPos.x, mousePixelPos.y, lastMousePixelPos.x, lastMousePixelPos.y, colorSelector.asColor(0, 0, 0, 0));
        drawingCanvas.setPixel(mousePixelPos.x, mousePixelPos.y, colorSelector.asColor(0, 0, 0, 0));
    }
}

// Use the pencil on the mouse position
const usePencil = (mousePos, lastMousePos, displaySize, drawingSize) => {
    changeMessage = `Penciled Pixels as ${utils.rgbToHex(colorSelector.getSelectedColor())}...`;

    if (lastMousePos != null) {
        let mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
        let lastMousePixelPos = utils.convertPosFromSizeToSize(lastMousePos.x, lastMousePos.y, displaySize, drawingSize);

        drawingCanvas.setPixels(mousePixelPos.x, mousePixelPos.y, lastMousePixelPos.x, lastMousePixelPos.y, colorSelector.getSelectedColor());
        drawingCanvas.setPixel(mousePixelPos.x, mousePixelPos.y, colorSelector.getSelectedColor());
    }
}

// Use the dropper on the mouse position
const useDropper = (mousePos, lastMousePos, displaySize, drawingSize) => {
    let mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
    colorSelector.setSelectorColor(drawingCanvas.getPixel(mousePixelPos.x, mousePixelPos.y));
}

// Change the current tool to eraser
const onClickEraserTool = () => {
    currentTool = toolStruct.Eraser;
}

// Change the current tool to pencil
const onClickPencilTool = () => {
    currentTool = toolStruct.Pencil;
}

// Change the current tool to dropper
const onClickDropperTool = () => {
    currentTool = toolStruct.Dropper;
}

export { initialize, useTool, changeMessage };