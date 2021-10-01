"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notCommited = exports.redoChange = exports.undoChange = exports.commitChanges = exports.addChange = exports.initialize = void 0;

var drawing = _interopRequireWildcard(require("./drawingCanvas.js"));

var utils = _interopRequireWildcard(require("./utils.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var changeListOL;
var undoStack = [];
var redoStack = [];
var currentChanges = [];
var notCommited;
exports.notCommited = notCommited;
var isUndoing;
var isRedoing;
var totalChanges = 0;
var SAVED_MAX = 1000;

var initialize = function initialize() {
  var historyDiv = document.querySelector("#historyHolder");
  changeListOL = historyDiv.querySelector("#changes");
  var undoButton = historyDiv.querySelector("#undo");
  var redoButton = historyDiv.querySelector("#redo");
  undoButton.onclick = undoChange;
  redoButton.onclick = redoChange;
};

exports.initialize = initialize;

var addPixelChange = function addPixelChange(pixelIndex, toColor, fromColor) {
  if (isUndoing) return;
  if (currentChanges.find(function (c) {
    return c.pixelIndex === pixelIndex;
  })) return;
  currentChanges.push({
    pixelIndex: pixelIndex,
    toColor: _objectSpread({}, toColor),
    fromColor: _objectSpread({}, fromColor)
  });
  redoStack = [];
  exports.notCommited = notCommited = true;
};

exports.addChange = addPixelChange;

var commitChanges = function commitChanges(message) {
  exports.notCommited = notCommited = false;
  undoStack.push({
    time: Date.now(),
    changes: currentChanges,
    changeNumber: totalChanges += 1,
    message: message
  });
  currentChanges = [];
  if (undoStack.length > SAVED_MAX) undoStack.shift();
  updateHistoryVisual();
};

exports.commitChanges = commitChanges;

var undoChange = function undoChange() {
  if (undoStack.length <= 0) return;
  var undo = undoStack.pop();
  if (undo === null) return;
  isUndoing = true;
  redoStack.push(undo);
  var changes = undo.changes;

  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];
    drawing.setPixelI(change.pixelIndex, change.fromColor);
  }

  totalChanges--;
  isUndoing = false;
  updateHistoryVisual();
};

exports.undoChange = undoChange;

var redoChange = function redoChange() {
  if (redoStack.length <= 0) return;
  var redo = redoStack.pop();
  if (redo === null) return;
  isRedoing = true;
  undoStack.push(redo);
  var changes = redo.changes;

  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];
    drawing.setPixelI(change.pixelIndex, change.toColor);
  }

  totalChanges++;
  isRedoing = false;
  updateHistoryVisual();
};

exports.redoChange = redoChange;

var updateHistoryVisual = function updateHistoryVisual() {
  while (changeListOL.firstChild) {
    changeListOL.removeChild(changeListOL.firstChild);
  }

  for (var i = 0; i < undoStack.length; i++) {
    var changeText = document.createElement('p');
    changeText.innerText = "".concat(undoStack[i].changeNumber, ". ").concat(undoStack[i].message);
    if (i === undoStack.length - 1) changeText.style.border = '1px solid white';
    changeListOL.append(changeText);
  }

  changeListOL.scrollTop = changeListOL.scrollHeight;

  for (var _i = redoStack.length - 1; _i >= 0; _i--) {
    var _changeText = document.createElement('p');

    _changeText.innerText = "".concat(redoStack[_i].changeNumber, ". ").concat(redoStack[_i].message);
    _changeText.style.fontStyle = 'italic';
    _changeText.style.color = '#aaaaaa';
    changeListOL.append(_changeText);
  }
};
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asColor = exports.setSelectorColor = exports.getSelectedColor = exports.initialize = void 0;

var utils = _interopRequireWildcard(require("./utils.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var colorSelector;
var selectedColor = {
  r: 0,
  g: 0,
  b: 0,
  a: 255
};

var initialize = function initialize() {
  colorSelector = document.querySelector("#colorPicker");
  colorSelector.onchange = colorPickerChange;
};

exports.initialize = initialize;

var colorPickerChange = function colorPickerChange(e) {
  var color = utils.hexToRgb(e.target.value);
  setSelectedColor(color.r, color.g, color.b, color.a);
};

var getSelectedColor = function getSelectedColor() {
  return selectedColor;
};

exports.getSelectedColor = getSelectedColor;

var setSelectorColor = function setSelectorColor(color) {
  setSelectedColor(color.r, color.g, color.b, color.a);
  colorSelector.value = utils.rgbToHex(selectedColor);
};

exports.setSelectorColor = setSelectorColor;

var setSelectedColor = function setSelectedColor(r, g, b, a) {
  selectedColor.r = r;
  selectedColor.g = g;
  selectedColor.b = b;
  selectedColor.a = a;
};

var asColor = function asColor(r, g, b) {
  var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 255;
  return {
    r: r,
    g: g,
    b: b,
    a: a
  };
};

exports.asColor = asColor;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawHiddenCanvas = exports.initialize = void 0;
var canvas;
var ctx;
var size = {};

var initialize = function initialize(width, height, _canvas) {
  var dpi = window.devicePixelRatio;
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
}; // Draw a zoomed up version of the hidden canvas...


exports.initialize = initialize;

var drawHiddenCanvas = function drawHiddenCanvas(hiddenCanvas) {
  ctx.clearRect(0, 0, size.width, size.height);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.restore();
  ctx.drawImage(hiddenCanvas, 0, 0, hiddenCanvas.width, hiddenCanvas.height, 0, 0, size.width, size.height);
};

exports.drawHiddenCanvas = drawHiddenCanvas;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canvas = exports.setPixels = exports.getPixel = exports.setPixelI = exports.setPixel = exports.initialize = void 0;

var changes = _interopRequireWildcard(require("./changeHistory.js"));

var colorSelection = _interopRequireWildcard(require("./colorSelection.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var canvas;
exports.canvas = canvas;
var ctx;
var size = {};
var canvasData;
var pixelData;

var initialize = function initialize(width, height, _canvas) {
  size.width = width;
  size.height = height;
  exports.canvas = canvas = _canvas;
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");
  setupImage();
};

exports.initialize = initialize;

var setupImage = function setupImage() {
  canvasData = ctx.createImageData(size.width, size.height);
  pixelData = canvasData.data;

  for (var i = 0; i < pixelData.length; i += 4) {
    pixelData[i] = 0;
    pixelData[i + 1] = 0;
    pixelData[i + 2] = 0;
    pixelData[i + 3] = 0;
  }

  ctx.putImageData(canvasData, 0, 0);
};

var setPixel = function setPixel(x, y, color) {
  if (x < 0 || x >= size.width || y < 0 || y >= size.height) return;
  var i = convertToPixelIndex(x, y, size.width);
  changes.addChange(i, color, colorSelection.asColor(pixelData[i], pixelData[i + 1], pixelData[i + 2], pixelData[i + 3]));
  pixelData[i] = color.r;
  pixelData[i + 1] = color.g;
  pixelData[i + 2] = color.b;
  pixelData[i + 3] = color.a;
  ctx.putImageData(canvasData, 0, 0);
};

exports.setPixel = setPixel;

var setPixelI = function setPixelI(i, color) {
  if (i < 0 || i >= pixelData.length) return;
  pixelData[i] = color.r;
  pixelData[i + 1] = color.g;
  pixelData[i + 2] = color.b;
  pixelData[i + 3] = color.a;
  ctx.putImageData(canvasData, 0, 0);
};

exports.setPixelI = setPixelI;

var getPixel = function getPixel(x, y) {
  if (x < 0 || x >= size.width || y < 0 || y >= size.height) return;
  var i = convertToPixelIndex(x, y, size.width);
  return colorSelection.asColor(pixelData[i], pixelData[i + 1], pixelData[i + 2], pixelData[i + 3]);
}; // From https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript with some tweaks


exports.getPixel = getPixel;

var setPixels = function setPixels(x0, y0, x1, y1, color) {
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;

  while (true) {
    if (x0 === x1 && y0 === y1) break;
    setPixel(x0, y0, color);
    var e2 = 2 * err;

    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }

    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
};

exports.setPixels = setPixels;

var convertToPixelIndex = function convertToPixelIndex(x, y, width) {
  return y * (width * 4) + x * 4;
};
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var main = _interopRequireWildcard(require("./main.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

window.onload = main.init;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;

var color = _interopRequireWildcard(require("./colorSelection.js"));

var changes = _interopRequireWildcard(require("./changeHistory.js"));

var drawing = _interopRequireWildcard(require("./drawingCanvas.js"));

var display = _interopRequireWildcard(require("./displayCanvas.js"));

var tools = _interopRequireWildcard(require("./tools.js"));

var utils = _interopRequireWildcard(require("./utils.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var drawingSize = {
  width: 64,
  height: 64
};
var displaySize = {
  width: 600,
  height: 600
};
var drawingCanvas;
var displayCanvas;
var mousePos = {
  x: -1,
  y: -1
};
var lastMousePos;
var mouseDown = false;

var init = function init() {
  // Setup canvases
  drawingCanvas = document.querySelector("#rawimage");
  drawing.initialize(drawingSize.width, drawingSize.height, drawingCanvas);
  displayCanvas = document.querySelector("#display");
  display.initialize(displaySize.width, displaySize.height, displayCanvas); // Setup others

  color.initialize();
  changes.initialize();
  tools.initialize(); // Setup listeners

  displayCanvas.onmousedown = onMouseDown;
  document.onmouseup = onMouseUp;
  document.onmousemove = onMouseMove;
  displayCanvas.touchstart = onMouseDown;
  document.touchend = onMouseUp;
  document.touchmove = onMouseMove;
  loop();
};

exports.init = init;

var loop = function loop() {
  requestAnimationFrame(loop);
  display.drawHiddenCanvas(drawing.canvas);

  if (mouseDown) {
    tools.useTool(mousePos, lastMousePos, displaySize, drawingSize);
  }

  if (!mouseDown && changes.notCommited) {
    changes.commitChanges(tools.changeMessage);
  }

  lastMousePos = mousePos;
};

var onMouseDown = function onMouseDown(e) {
  mouseDown = true;
};

var onMouseUp = function onMouseUp(e) {
  mouseDown = false;
};

var onMouseMove = function onMouseMove(e) {
  var rect = displayCanvas.getBoundingClientRect();
  mousePos = {
    x: e.clientX - rect.x,
    y: e.clientY - rect.y
  };
};
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
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeMessage = exports.useTool = exports.initialize = void 0;

var colorSelector = _interopRequireWildcard(require("./colorSelection.js"));

var drawingCanvas = _interopRequireWildcard(require("./drawingCanvas.js"));

var utils = _interopRequireWildcard(require("./utils.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var toolStruct;
var currentTool;
var changeMessage;
exports.changeMessage = changeMessage;

var initialize = function initialize() {
  document.querySelector("#eraser").onclick = onClickEraserTool;
  document.querySelector("#pencil").onclick = onClickPencilTool;
  document.querySelector("#dropper").onclick = onClickDropperTool;
  toolStruct = {
    Eraser: useEraser,
    Pencil: usePencil,
    Dropper: useDropper
  };
  currentTool = toolStruct.Pencil;
};

exports.initialize = initialize;

var useTool = function useTool(mousePos, lastMousePos, displaySize, drawingSize) {
  currentTool(mousePos, lastMousePos, displaySize, drawingSize);
};

exports.useTool = useTool;

var useEraser = function useEraser(mousePos, lastMousePos, displaySize, drawingSize) {
  exports.changeMessage = changeMessage = "Erased Pixels...";

  if (lastMousePos != null) {
    var mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
    var lastMousePixelPos = utils.convertPosFromSizeToSize(lastMousePos.x, lastMousePos.y, displaySize, drawingSize);
    drawingCanvas.setPixels(mousePixelPos.x, mousePixelPos.y, lastMousePixelPos.x, lastMousePixelPos.y, colorSelector.asColor(0, 0, 0, 0));
    drawingCanvas.setPixel(mousePixelPos.x, mousePixelPos.y, colorSelector.asColor(0, 0, 0, 0));
  }
};

var usePencil = function usePencil(mousePos, lastMousePos, displaySize, drawingSize) {
  exports.changeMessage = changeMessage = "Penciled Pixels as ".concat(utils.rgbToHex(colorSelector.getSelectedColor()), "...");

  if (lastMousePos != null) {
    var mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
    var lastMousePixelPos = utils.convertPosFromSizeToSize(lastMousePos.x, lastMousePos.y, displaySize, drawingSize);
    drawingCanvas.setPixels(mousePixelPos.x, mousePixelPos.y, lastMousePixelPos.x, lastMousePixelPos.y, colorSelector.getSelectedColor());
    drawingCanvas.setPixel(mousePixelPos.x, mousePixelPos.y, colorSelector.getSelectedColor());
  }
};

var useDropper = function useDropper(mousePos, lastMousePos, displaySize, drawingSize) {
  var mousePixelPos = utils.convertPosFromSizeToSize(mousePos.x, mousePos.y, displaySize, drawingSize);
  colorSelector.setSelectorColor(drawingCanvas.getPixel(mousePixelPos.x, mousePixelPos.y));
};

var onClickEraserTool = function onClickEraserTool() {
  currentTool = toolStruct.Eraser;
};

var onClickPencilTool = function onClickPencilTool() {
  currentTool = toolStruct.Pencil;
};

var onClickDropperTool = function onClickDropperTool() {
  currentTool = toolStruct.Dropper;
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertPosFromSizeToSize = exports.rgbToHex = exports.hexToRgb = exports.clamp = void 0;

var clamp = function clamp(value, min, max) {
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
};

exports.clamp = clamp;

var convertPosFromSizeToSize = function convertPosFromSizeToSize(x, y, displaySize, drawingSize) {
  return {
    x: Math.floor(x / displaySize.width * drawingSize.width),
    y: Math.floor(y / displaySize.height * drawingSize.height)
  };
}; // YOINKED off internet: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb


exports.convertPosFromSizeToSize = convertPosFromSizeToSize;

var hexToRgb = function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 255
  } : null;
};

exports.hexToRgb = hexToRgb;

var rgbToHex = function rgbToHex(rgb) {
  var r = ("00" + rgb.r.toString(16)).slice(-2);
  var g = ("00" + rgb.g.toString(16)).slice(-2);
  var b = ("00" + rgb.b.toString(16)).slice(-2);
  return "#".concat(r).concat(g).concat(b);
};

exports.rgbToHex = rgbToHex;
