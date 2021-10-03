import * as color from "./colorSelection.js";
import * as changes from "./changeHistory.js";
import * as drawing from "./drawingCanvas.js";
import * as display from "./displayCanvas.js";
import * as tools from "./tools.js";
import * as server from "./serverHandler.js"

let drawingSize = { width: 64, height: 64 };
let displaySize = { width: 600, height: 600 };

let drawingCanvas;
let displayCanvas;

let mousePos = {
    x: -1,
    y: -1
};

let lastMousePos;

let mouseDown = false;

let mouseTimer = 0.1;

const initialize = (canvasSize) => {
    drawingSize = canvasSize;

    // Setup canvases
    drawingCanvas = document.querySelector("#rawimage");
    drawing.initialize(drawingSize.width, drawingSize.height, drawingCanvas);

    displayCanvas = document.querySelector("#display");
    display.initialize(displaySize.width, displaySize.height, displayCanvas);

    // Setup others
    color.initialize();
    changes.initialize();
    tools.initialize();

    // Setup listeners
    displayCanvas.onmousedown = onMouseDown;
    document.onmouseup = onMouseUp;
    document.onmousemove = onMouseMove;

    displayCanvas.touchstart = onMouseDown;
    document.touchend = onMouseUp;
    document.touchmove = onMouseMove;

    loop();
};

const loop = () => {
    requestAnimationFrame(loop);

    display.drawHiddenCanvas(drawing.canvas);

    if (mouseDown) {
        tools.useTool(mousePos, lastMousePos, displaySize, drawingSize);
    }

    if (!mouseDown && changes.notCommited) {
        changes.commitChanges(tools.changeMessage);
    }

    mouseTimer -= 1 / 60;
    if (mouseTimer <= 0) {
        mouseTimer = 0.0;
        server.updatePlayer(mousePos);
        server.getPlayerList();
    }

    display.drawMouse(mousePos.x, mousePos.y, server.playerColor);
    display.drawPlayers(server.playerList, server.playerId);

    lastMousePos = mousePos;
};

const onMouseDown = (e) => {
    mouseDown = true;
};

const onMouseUp = (e) => {
    mouseDown = false;
};

const onMouseMove = (e) => {
    const rect = displayCanvas.getBoundingClientRect();

    mousePos = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y
    };
};

export { initialize };


/*
--- Code Plan ---
loader.js
    -onload
        - load any potential images and such there likely wont be any
            other then getting the rooms image from the server.
        - call mains init

main.js
    - init
        - Setup the canvases
            - Hidden (this is where actual painting occures)
            - Display (this is the scaled up version of the Hidden)
                - The two canvases are seperate so that I can use smaller resolutions
                    with the painting. By having two seperate it should be a little
                    bit easier to handle sending data back and forth from the server.
                    From the client perspective its simply easier to set exact
                    pixel stuff using a seperate canvas. It also allows for good looking
                    transparency.
        - Setup listeners
        - Setup the empty canvas (this setting will likely come from the)
    - loop
        - call draw on the display canvas
        - check if the mouse is down && if it has moved
            - if it is do a set pixel and set pixels between its last position and current
        - update the lastMousePosition

drawingCanvas.js
    - initialize (width, height, drawingCanvas)
        - Setup the drawing canvas (the hidden one) and setup the image data and data objects
    - setPixel (x, y, color)
        - Convert the x and y to and index on the data object.
        - Sets a pixel on the data object.
    - setPixels(x0, y0, x1, x0, color)
        - Convert the two positions and use an algoritm to set all pixels between them.
            - Might be able to simply use ctx.lineTo
    - Exports initialize, setPixel, setPixels, and drawingCanvas

displayCanvas.js
    - initialize (width, height, displayCanvas)
        - just setup the canvas
    - draw
        - have it draw the hidden canvas zoomed up a bit, could potentially have some magnification stuff.
    - exports initialize and draw

colorSelection.js
    - initialize
    - GetColor()
        - Returns the selected color
    - AsColor(r, g, b)
    - AsColor(r, g, b, a)
        - Converts given R, G, B, A into a color object
        - (as an aside this is not how overloading methods works but whatever)

changeHistory.js
    - initialize
        - gets the dom for the history holder, which has the undo, redo buttons
        - Also sets up the changes stack
    - addChange (pixelIndex, toColor, fromColor)
        - saves the pixelIndex, color its being changed to, and color changed from
            to the currentChanges object
    - commitChanges
        - adds and clears the current changes object
        - clears redo stack
        - (could possibly be where my server tie-in is)
    - undoChange
        - removes the most recent change from the changes stack and goes back through
            setting each pixel index to its from color
        - saves the pulled change onto the redoStack
    - redoChange
        - pulls from the redo stack and goes back through each change setting each pixel
            index to its to color
        - saves the pulled change onto the undoStack

tools.js
    - initialize
        - Setup all the different tools and their listeners
    - useTool(mousePos)
        - Uses whatever tool at specified position,
            this is also where the history is done now

--- References ---
    - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
        - Much of the logic for zoom and setting pixels came from here
*/