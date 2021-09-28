import * as utils from "./utils.js";

let ctx, canvas;

let zoomedCtx;
const canvasWidth = 600;
const canvasHeight = 600;

let mousePos = {
    x: 0,
    y: 0
};

let mousePosLastFrame = {
    x: 0,
    y: 0
}

let mouseDownPos = {};
let mouseUpPos = {};
let isMouseDown = false;

const imageSize = { x: 32, y: 32 };
let image = [];

let imageData;

const init = () => {
    canvas = document.querySelector('#rawimage');
    canvas.width = imageSize.x;
    canvas.height = imageSize.y;
    ctx = canvas.getContext("2d");

    zoomedCtx = document.querySelector("#display");
    zoomedCtx.imageSmoothingEnabled = false;

    canvas.onmousemove = onMouseMove;
    canvas.onmousedown = onMouseDown;
    canvas.onmouseup = onMouseUp;

    imageData = ctx.createImageData(imageSize.x, imageSize.y);

    generateImage();
    loop();
}

const loop = () => {
    requestAnimationFrame(loop);
    clear();
    ctx.putImageData(imageData, 0, 0);

    if (isMouseDown) {
        let pixelPos = getPixelPos(mousePos);
    }

    ctx.fillStyle = "black";
    ctx.fillRect(mousePos.x - 2.5, mousePos.y - 2.5, 5, 5);

    mousePosLastFrame = mousePos;
}

const clear = () => {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
}

const onMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();

    mousePos = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y
    };
}

const onMouseDown = (e) => {
    mouseDownPos = mousePos;
    mouseUpPos = null;
    isMouseDown = true;
}

const onMouseUp = (e) => {
    mouseUpPos = mousePos;
    isMouseDown = false;
}

const generateImage = () => {
    for (let i = 0; i < imageSize.x; i++) {
        for (let j = 0; j < imageSize.y; j++) {
            if (!image[i])
                image[i] = [];

            image[i][j] = "white";
        }
    }
}

const getPixelPos = (pos) => {
    return {
        x: Math.floor((pos.x / canvasWidth) * imageSize.x),
        y: Math.floor((pos.y / canvasHeight) * imageSize.y)
    };
}
const getCanvasPos = (pos) => {
    return {
        x: Math.round((pos.x / imageSize.x) * canvasWidth),
        y: Math.round((pos.y / imageSize.y) * canvasWidth)
    }
}

const setPixel = (pos, color) => {
    if (pos.x < 0 || pos.x >= imageSize.x)
        return;
    if (pos.y < 0 || pos.x >= imageSize.y)
        return;

    image[pos.x][pos.y] = color;
}

// From https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript with some tweaks
const setPixels = (pos0, pos1, color) => {
    pos0 = getPixelPos(pos0);
    pos1 = getPixelPos(pos1);

    let dx = Math.abs(pos1.x - pos0.x);
    let dy = Math.abs(pos1.y - pos0.y);

    let sx = (pos0.x < pos1.x) ? 1 : -1;
    let sy = (pos0.y < pos1.y) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        setPixel(pos0, color);

        if (pos0.x === pos1.x && pos0.y === pos1.y) break;

        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            pos0.x += sx;
        }
        if (e2 <= dx) {
            err += dx;
            pos0.y += sy;
        }
    }
}

const drawImage = () => {
    let pixelSize = { x: canvasWidth / imageSize.x, y: canvasHeight / imageSize.y };
    for (let i = 0; i < imageSize.x; i++) {
        for (let j = 0; j < imageSize.y; j++) {
            let pixelPos = getCanvasPos({ x: i, y: j });
            let pixel = image[i][j];
            ctx.save();
            ctx.fillStyle = pixel;
            ctx.fillRect(pixelPos.x, pixelPos.y, pixelSize.x, pixelSize.y);
            ctx.restore();
        }
    }
}

export { init }