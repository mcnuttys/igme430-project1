let canvas;
let ctx;

let size = {};

let lastPlayerListPos = [];

// Setup the display canvas, with the parameters for the drawing canvas setup such as imageSmoothing
const initialize = (width, height, _canvas) => {
    const dpi = window.devicePixelRatio;

    size.width = width;
    size.height = height;

    canvas = _canvas;
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
};

// Draw a zoomed up version of the hidden canvas...
const drawHiddenCanvas = (hiddenCanvas) => {
    ctx.clearRect(0, 0, size.width, size.height);

    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, size.width, size.height);
    ctx.restore();

    ctx.drawImage(hiddenCanvas, 0, 0, hiddenCanvas.width, hiddenCanvas.height, 0, 0, size.width, size.height);
};

// Draw all the player mice from the playerList
// Also do lerp stuff
const drawPlayers = (playerList, currentPlayerId) => {
    if (lastPlayerListPos.length != playerList.length) {
        lastPlayerListPos = playerList;
    }

    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].id != currentPlayerId) {
            let lastX = parseFloat(lastPlayerListPos[i].position.mousePosX);
            let lastY = parseFloat(lastPlayerListPos[i].position.mousePosY);

            let x = parseFloat(playerList[i].position.mousePosX);
            let y = parseFloat(playerList[i].position.mousePosY);

            if (lastX < 0) {
                lastX = x;
            }

            if (lastY < 0) {
                lastY = y;
            }

            let xLerp = (x - lastX) * ((1 / 60.0) * 5);
            let yLerp = (y - lastY) * ((1 / 60.0) * 5);
            let color = playerList[i].color;

            lastPlayerListPos[i].position.mousePosX = lastX + xLerp;
            lastPlayerListPos[i].position.mousePosY = lastY + yLerp;

            drawMouse(lastX + xLerp, lastY + yLerp, color);
        }
    }
}

// Draw a mouse at a given position (its just a circle but if I wanted something fancier here it is)
const drawMouse = (mousePosX, mousePosY, color) => {
    ctx.save();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(mousePosX, mousePosY, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
};

export { initialize, drawHiddenCanvas, drawMouse, drawPlayers };