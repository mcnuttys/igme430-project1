import * as colorSelector from "./colorSelection.js";
import * as drawingCanvas from "./drawingCanvas.js";
import * as utils from "./utils.js";


let toolStruct;
let currentTool;
let changeMessage;

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

const useTool = (mousePos, lastMousePos, displaySize, drawingSize) => {
    currentTool(mousePos, lastMousePos, displaySize, drawingSize);
}

const useEraser = (mousePos, lastMousePos, displaySize, drawingSize) => {
    changeMessage = "Erased Pixels..."

    if (lastMousePos != null) {
        let mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
        let lastMousePixelPos = utils.convertPosFromSizeToSize(lastMousePos.x, lastMousePos.y, displaySize, drawingSize);

        drawingCanvas.setPixels(mousePixelPos.x, mousePixelPos.y, lastMousePixelPos.x, lastMousePixelPos.y, colorSelector.asColor(0, 0, 0, 0));
        drawingCanvas.setPixel(mousePixelPos.x, mousePixelPos.y, colorSelector.asColor(0, 0, 0, 0));
    }
}

const usePencil = (mousePos, lastMousePos, displaySize, drawingSize) => {
    changeMessage = `Penciled Pixels as ${utils.rgbToHex(colorSelector.getSelectedColor())}...`;

    if (lastMousePos != null) {
        let mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
        let lastMousePixelPos = utils.convertPosFromSizeToSize(lastMousePos.x, lastMousePos.y, displaySize, drawingSize);

        drawingCanvas.setPixels(mousePixelPos.x, mousePixelPos.y, lastMousePixelPos.x, lastMousePixelPos.y, colorSelector.getSelectedColor());
        drawingCanvas.setPixel(mousePixelPos.x, mousePixelPos.y, colorSelector.getSelectedColor());
    }
}

const useDropper = (mousePos, lastMousePos, displaySize, drawingSize) => {
    let mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
    colorSelector.setSelectorColor(drawingCanvas.getPixel(mousePixelPos.x, mousePixelPos.y));
}

const onClickEraserTool = () => {
    currentTool = toolStruct.Eraser;
}

const onClickPencilTool = () => {
    currentTool = toolStruct.Pencil;
}

const onClickDropperTool = () => {
    currentTool = toolStruct.Dropper;
}

export { initialize, useTool, changeMessage };