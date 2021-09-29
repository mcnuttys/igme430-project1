let canvas;
let ctx;

let size = {};

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

export { initialize, drawHiddenCanvas };