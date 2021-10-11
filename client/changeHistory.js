import * as drawing from "./drawingCanvas.js";
import * as server from "./serverHandler.js";

let changeListOL;

let undoStack = [];
let redoStack = [];

let currentChanges = [];
let notCommited;
let isUndoing;
let isRedoing;

let totalChanges = 0;

const SAVED_MAX = 1000;

// Setup the history stuff
const initialize = () => {
    const historyDiv = document.querySelector("#historyHolder");
    changeListOL = historyDiv.querySelector("#changes");

    const undoButton = historyDiv.querySelector("#undo");
    const redoButton = historyDiv.querySelector("#redo");

    undoButton.onclick = undoChange;
    redoButton.onclick = redoChange;
}

// Adds a pixel change object to current changes
// Also clears the redo stack
// Most of this stuff is probably going to disappear
const addPixelChange = (pixelIndex, toColor, fromColor) => {
    if (isUndoing)
        return;

    if (currentChanges.find(c => c.pixelIndex === pixelIndex))
        return;

    currentChanges.push({ pixelIndex, toColor: { ...toColor }, fromColor: { ...fromColor } });
    redoStack = [];
    notCommited = true;
}

// Commit current changes to the undo stack and send it too the server
const commitChanges = (message) => {
    notCommited = false;

    const change = { time: Date.now(), changes: currentChanges, changeNumber: totalChanges += 1, message };

    undoStack.push(change);
    currentChanges = [];

    if (undoStack.length > SAVED_MAX)
        undoStack.shift();

    server.sendChange({ time: change.time, changes: change.changes });
    updateHistoryVisual();
}

// Pop a change off the undo stack and do its invers, then add it to the redo stack
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
    drawing.applyCanvasData();

    totalChanges--;
    isUndoing = false;
    updateHistoryVisual();
}

// Pop a change off the redo stack and do it, then add it too the undo stack
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
    drawing.applyCanvasData();

    totalChanges++;
    isRedoing = false;
    updateHistoryVisual();
}

// Update the histroy visual display.
// Probably going to be remove but its still kind of cool
const updateHistoryVisual = () => {
    while (changeListOL.firstChild) {
        changeListOL.removeChild(changeListOL.firstChild);
    }

    for (let i = 0; i < undoStack.length; i++) {
        const changeText = document.createElement('p');
        changeText.innerText = `${undoStack[i].changeNumber}. ${undoStack[i].message}`;
        if (i === undoStack.length - 1)
            changeText.style.border = '1px solid white';

        changeListOL.append(changeText);
    }

    changeListOL.scrollTop = changeListOL.scrollHeight;

    for (let i = redoStack.length - 1; i >= 0; i--) {
        const changeText = document.createElement('p');
        changeText.innerText = `${redoStack[i].changeNumber}. ${redoStack[i].message}`;
        changeText.style.fontStyle = 'italic';
        changeText.style.color = '#aaaaaa';

        changeListOL.append(changeText);
    }
}

export { initialize, addPixelChange, commitChanges, undoChange, redoChange, notCommited }