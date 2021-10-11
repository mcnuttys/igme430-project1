import * as page from "./pageHandler.js";
import * as colorSelection from "./colorSelection.js";
import * as utils from "./utils.js";
import * as drawingCanvas from "./drawingCanvas.js"

let currentRoomId;
let playerColor = "#FF00FF";
let playerId = 0;
let playerList = [];
let lastGotChanges;

// Send a xhr get request, and onload use the given response handler
const sendGet = (url, responseHandler) => {
    const xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => responseHandler(xhr);
    xhr.send();
}

// Send a xhr post request, and onload use the given response handler
const sendPost = (url, responseHandler, contentType, content) => {
    const xhr = new XMLHttpRequest();
    xhr.open("post", url);

    xhr.setRequestHeader('Content-type', contentType);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => responseHandler(xhr);

    xhr.send(content);
}

// Send a get request for the room list.
const getRoomList = () => {
    sendGet("/roomList", roomListHandler);
}

// response handler for getrooms, if its a success then parse the roomlist and display
// otherwise display the error message.
const roomListHandler = (xhr) => {
    switch (xhr.status) {
        case 204:
            return page.errorRoomList("There are no rooms yet!");

        case 404:
            page.errorRoomList("For some reason server braindead... Or its creator is...");
            break;
            
        default:
            page.errorRoomList("I dont know what happened here!");
            break;
    }

    const obj = JSON.parse(xhr.response);
    page.updateRoomList(obj.rooms);
}

// Send a createRoom post request, given data in format 'application/x-www-form-urlencoded'
const createRoom = (roomName, canvasSize) => {
    const data = `roomName=${roomName}&canvasSize=${canvasSize}`;
    sendPost("/createRoom", createRoomHandler, 'application/x-www-form-urlencoded', data);
}

// Create room response handler, if successful create code join the room created, otherwise error with message
const createRoomHandler = (xhr) => {
    const obj = JSON.parse(xhr.response);

    switch (xhr.status) {
        case 201:
            currentRoomId = obj.room.id;
            playerColor = utils.rgbToHex(colorSelection.asColor(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255));
            playerId = obj.playerId;

            page.onJoinedRoom(obj.room);
            break;
        case 400:
            page.backToCreateRoom(obj.message);
            break;
        case 404:
            page.backToCreateRoom(obj.message);
            break;
        default:
            page.backToCreateRoom("I dont know what happened here!");
            break;
    }
}

// Update player post request, given data in 'application/x-www-form-urlencoded'
const updatePlayer = (mousePos) => {
    sendPost('/updatePlayer', updatePlayerHandler, 'application/x-www-form-urlencoded',
        `roomId=${currentRoomId}&playerId=${playerId}&mousePosX=${mousePos.x}&mousePosY=${mousePos.y}&color=${playerColor}`
    );
}

// This method COULD do something but seeing as I have nothing visual to display the sucessfully updated mouse position its nothing
// But it does serve to send error messages to the console if something has failed 
const updatePlayerHandler = (xhr) => {
    // Pretty much do nothing, just dont want to see an error
    switch (xhr.status) {
        case 204:
            // The player position updated sucessfully!
            break;
        case 400:
            console.error(obj.message);
            break;
        case 404:
            console.error(obj.message);
            break;
        default:
            console.error("I dont know what happened here!");
            break;
    }
}

// Get request for the playerlist of the room your in
const getPlayerList = () => {
    sendGet(`/getPlayers?roomId=${currentRoomId}`, handleGetPlayers);
}

// Response handler for the getplayers request
const handleGetPlayers = (xhr) => {
    const obj = JSON.parse(xhr.response);

    switch (xhr.status) {
        case 200:
            playerList = [];

            playerList = obj.players;
            break;
        case 400:
            console.error("The data sent to the server was incorrect!");
            break;
        case 404:
            console.error(obj.message);
            break;
        default:
            console.error("I dont know what happened here!");
            break;
    }
}

// Join room get request
const joinRoom = (id) => {
    sendGet("/joinRoom?id=" + id, joinRoomHandler);
}

// Join room response handler, if success join the room and have everything initialize
const joinRoomHandler = (xhr) => {
    const obj = JSON.parse(xhr.response);

    switch (xhr.status) {
        case 200:
            currentRoomId = obj.room.id;
            playerColor = utils.rgbToHex(colorSelection.asColor(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255));
            playerId = obj.playerId;

            if (obj.room.changes.length > 0)
                lastGotChanges = obj.room.changes[obj.room.changes.length - 1].timeStamp;

            page.onJoinedRoom(obj.room);
            break;
        case 400:
            page.errorRoomList(obj.message);
            break;
        case 404:
            page.errorRoomList("Something has gone wrong real bad");
            break;
        default:
            page.backToCreateRoom("I dont know what happened here!");
            break;
    }
}

// Send a change post request, sends a given change in format 'application/json' to the server
const sendChange = (change) => {
    change.roomId = currentRoomId;
    sendPost("/sendChange", handleChangeResponse, 'application/json', JSON.stringify(change));
}

// Response handler for sending changes to the server, does nothing except give errors when things go wrong
// Like with update mouse I dont have anything that displays its success but like if I had a loading gif or
// something it could disable. Thats for the recode
const handleChangeResponse = (xhr) => {
    switch (xhr.status) {
        case 204:
            // Do nothing I think?
            break;
        case 400:
            page.errorRoomList(obj.message);
            break;
        case 404:
            page.errorRoomList("Something has gone wrong real bad");
            break;
        default:
            page.backToCreateRoom("I dont know what happened here!");
            break;
    }
}

// Get request for changes in a room after a given timestamp
const getChanges = () => {
    if (lastGotChanges === undefined)
        lastGotChanges = Date.now();

    sendGet("/getChanges?roomId=" + currentRoomId + "&timeStamp=" + lastGotChanges, handleGetChanges);
}

// Response handler for getting changes in a room.
// If success apply those changes to the canvas
const handleGetChanges = (xhr) => {
    const obj = JSON.parse(xhr.response);

    switch (xhr.status) {
        case 200:
            let changes = obj.changes;

            if (changes.length > 0)
                lastGotChanges = changes[changes.length - 1].timeStamp;

            for (let i = 0; i < changes.length; i++) {
                let change = changes[i].change;
                for (let j = 0; j < change.length; j++) {
                    drawingCanvas.setPixelI(change[j].pixelIndex, change[j].toColor);
                }
            }
            drawingCanvas.applyCanvasData();
            break;
        case 400:
            page.errorRoomList(obj.message);
            break;
        case 404:
            page.errorRoomList("Something has gone wrong real bad");
            break;
        default:
            page.backToCreateRoom("I dont know what happened here!");
            break;
    }
}

export {
    getRoomList,
    createRoom,
    joinRoom,
    updatePlayer,
    getPlayerList,
    sendChange,
    getChanges,
    playerId,
    playerColor,
    playerList
};
