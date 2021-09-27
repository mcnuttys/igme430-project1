import * as utils from "./utils.js";

let ctx, canvas;
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
let pixels = [];

const init = () => {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    canvas.onmousemove = onMouseMove;
    canvas.onmousedown = onMouseDown;
    canvas.onmouseup = onMouseUp;

    generateImage();
    loop();
}

const loop = () => {
    requestAnimationFrame(loop);
    clear();
    drawImage();

    if (isMouseDown) {
        let pixelPos = getPixelPos(mousePos);
        setPixel(pixelPos, "red");
        setPixels(mousePosLastFrame, mousePos, "red");
    }

    ctx.fillStyle = "black";
    ctx.fillRect(mousePos.x - 2.5, mousePos.y - 2.5, 5, 5);

    setPixels({ x: 0, y: 0 }, { x: 100, y: 100 }, "red");

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
            if (!pixels[i])
                pixels[i] = [];

            pixels[i][j] = "white";
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

    pixels[pos.x][pos.y] = color;
}

const setPixels = (pos0, pos1, color) => {
    pos0 = getPixelPos(pos0);
    pos1 = getPixelPos(pos1);

    let dirX = pos1.x - pos0.x;
    let dirY = pos1.y - pos0.y;

    while (pos0.x != pos1.x && pos0.y != pos1.y) {
        console.dir(pos0.x + " | " + pos0.y);
        setPixel(pos0, color);
        pos0.x += dirX;
        pos0.y += dirY;
    }
}

const drawImage = () => {
    let pixelSize = { x: canvasWidth / imageSize.x, y: canvasHeight / imageSize.y };
    for (let i = 0; i < imageSize.x; i++) {
        for (let j = 0; j < imageSize.y; j++) {
            let pixelPos = getCanvasPos({ x: i, y: j });
            let pixel = pixels[i][j];
            ctx.save();
            ctx.fillStyle = pixel;
            ctx.fillRect(pixelPos.x, pixelPos.y, pixelSize.x, pixelSize.y);
            ctx.restore();
        }
    }
}

export { init }