import * as drawing from "./drawingCanvas.js";
import * as utils from "./utils.js";

let changeListOL;

let undoStack = [];
let redoStack = [];

let currentChanges = [];
let notCommited;
let isUndoing;
let isRedoing;

const initialize = () => {
    const historyDiv = document.querySelector("#historyHolder");
    changeListOL = historyDiv.querySelector("#changes");

    const undoButton = historyDiv.querySelector("#undo");
    const redoButton = historyDiv.querySelector("#redo");

    undoButton.onclick = undoChange;
    redoButton.onclick = redoChange;
}

const addChange = (pixelIndex, toColor, fromColor) => {
    if (isUndoing)
        return;

    if (currentChanges.find(c => c.pixelIndex === pixelIndex))
        return;

    currentChanges.push({ pixelIndex, toColor: { ...toColor }, fromColor: { ...fromColor } });
    redoStack = [];
    notCommited = true;
}

const commitChanges = () => {
    notCommited = false;

    undoStack.push({ time: Date.now(), changes: currentChanges });
    currentChanges = [];

    updateHistoryVisual();
}

const undoChange = () => {
    if (undoStack.length <= 0)
        return;

    let undo = undoStack.pop();

    if (undo === null)
        return;

    isUndoing = true;
    redoStack.push(undo);

    let changes = undo.changes;
    for (let i = 0; i < changes.length; i++) {
        let change = changes[i];
        drawing.setPixelI(change.pixelIndex, change.fromColor);
    }

    isUndoing = false;
    updateHistoryVisual();
}

const redoChange = () => {
    if (redoStack.length <= 0)
        return;

    let redo = redoStack.pop();

    if (redo === null)
        return;

    isRedoing = true;
    undoStack.push(redo);

    let changes = redo.changes;
    for (let i = 0; i < changes.length; i++) {
        let change = changes[i];
        drawing.setPixelI(change.pixelIndex, change.toColor);
    }

    isRedoing = false;

    updateHistoryVisual();
}

const updateHistoryVisual = () => {
    while (changeListOL.firstChild) {
        changeListOL.removeChild(changeListOL.firstChild);
    }

    for (let i = 0; i < undoStack.length; i++) {
        const changeText = document.createElement('li');
        let c = undoStack[i].changes[0].toColor;
        changeText.innerText = `Set Pixels to ${utils.rgbToHex(c)}`;
        changeText.style.color = utils.rgbToHex(c);

        if (i === undoStack.length - 1)
            changeText.style.border = '1px solid white';

        changeListOL.append(changeText);
    }

    changeListOL.scrollTop = changeListOL.scrollHeight;

    for (let i = redoStack.length - 1; i >= 0; i--) {
        const changeText = document.createElement('li');
        let color = redoStack[i].changes[0].toColor;
        changeText.innerText = `Set Pixels to ${utils.rgbToHex(color)}`;
        changeText.style.color = utils.rgbToHex(color);
        changeText.style.fontStyle = 'italic';

        changeListOL.append(changeText);
    }
}

export { initialize, addChange, commitChanges, undoChange, redoChange, notCommited }