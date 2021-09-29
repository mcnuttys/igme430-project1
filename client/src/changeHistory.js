import * as drawing from "./drawingCanvas.js";
import * as utils from "./utils.js";

let changeListOL;

let undoStack = [];
let redoStack = [];

let currentChanges = [];
let notCommited;
let isUndoing;
let isRedoing;

let totalChanges = 0;

const SAVED_MAX = 1000;

const initialize = () => {
    const historyDiv = document.querySelector("#historyHolder");
    changeListOL = historyDiv.querySelector("#changes");

    const undoButton = historyDiv.querySelector("#undo");
    const redoButton = historyDiv.querySelector("#redo");

    undoButton.onclick = undoChange;
    redoButton.onclick = redoChange;
}

const addPixelChange = (pixelIndex, toColor, fromColor) => {
    if (isUndoing)
        return;

    if (currentChanges.find(c => c.pixelIndex === pixelIndex))
        return;

    currentChanges.push({ pixelIndex, toColor: { ...toColor }, fromColor: { ...fromColor } });
    redoStack = [];
    notCommited = true;
}

const commitChanges = (message) => {
    notCommited = false;

    undoStack.push({ time: Date.now(), changes: currentChanges, changeNumber: totalChanges += 1, message });
    currentChanges = [];

    if (undoStack.length > SAVED_MAX)
        undoStack.shift();

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

    totalChanges--;
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

    totalChanges++;
    isRedoing = false;
    updateHistoryVisual();
}

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

export { initialize, addPixelChange as addChange, commitChanges, undoChange, redoChange, notCommited }