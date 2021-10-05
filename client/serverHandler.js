import * as page from "./pageHandler.js";
import * as colorSelection from "./colorSelection.js";
import * as utils from "./utils.js";
import * as drawingCanvas from "./drawingCanvas.js"

let currentRoomId;
let playerColor = "#FF00FF";
let playerId = 0;
let playerList = [];
let lastGotChanges;

const sendGet = (url, responseHandler) => {
    const xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => responseHandler(xhr);
    xhr.send();
}

const sendPost = (url, responseHandler, contentType, content) => {
    const xhr = new XMLHttpRequest();
    xhr.open("post", url);

    xhr.setRequestHeader('Content-type', contentType);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => responseHandler(xhr);

    xhr.send(content);
}

const roomListHandler = (xhr) => {
    switch (xhr.status) {
        case 204:
            return page.errorRoomList("There are no rooms yet!");
        case 404:
            page.errorRoomList("For some reason server braindead... Or its creator is...");
            break;
        default:
            page.errorRoomList("I dont know what the fork happened here!");
            break;
    }

    const obj = JSON.parse(xhr.response);
    page.updateRoomList(obj.rooms);
}

const getRoomList = () => {
    sendGet("/roomList", roomListHandler);
}

const createRoom = (roomName, canvasSize) => {
    const data = `roomName=${roomName}&canvasSize=${canvasSize}`;
    sendPost("/createRoom", createRoomHandler, 'application/x-www-form-urlencoded', data);
}

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
            page.backToCreateRoom("I dont know what the fork happened here!");
            break;
    }
}

const updatePlayer = (mousePos) => {
    sendPost('/updatePlayer', updatePlayerHandler, 'application/x-www-form-urlencoded',
        `roomId=${currentRoomId}&playerId=${playerId}&mousePosX=${mousePos.x}&mousePosY=${mousePos.y}&color=${playerColor}`
    );
}

const updatePlayerHandler = (xhr) => {
    // Pretty much do nothing, just dont want to see an error
    switch (xhr.status) {
        case 204:
            // The player position updated sucessfully!
            break;
        case 400:
            console.error("The data sent to the server was incorrect!");
            break;
        case 404:
            console.error(obj.message);
            break;
        default:
            console.error("I dont know what the fork happened here!");
            break;
    }
}

const getPlayerList = () => {
    sendGet(`/getPlayers?roomId=${currentRoomId}`, handleGetPlayers);
}

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
            console.error("I dont know what the fork happened here!");
            break;
    }
}

const joinRoom = (id) => {
    sendGet("/joinRoom?id=" + id, joinRoomHandler);
}

const joinRoomHandler = (xhr) => {
    const obj = JSON.parse(xhr.response);

    switch (xhr.status) {
        case 200:
            currentRoomId = obj.room.id;
            playerColor = utils.rgbToHex(colorSelection.asColor(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255));
            playerId = obj.playerId;

            page.onJoinedRoom(obj.room);
            break;
        case 400:
            page.errorRoomList(obj.message);
            break;
        case 404:
            page.errorRoomList("Something has gone wrong real bad");
            break;
        default:
            page.backToCreateRoom("I dont know what the fork happened here!");
            break;
    }
}

const sendChange = (change) => {
    change.roomId = currentRoomId;
    sendPost("/sendChange", handleChangeResponse, 'application/json', JSON.stringify(change));
}

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
            page.backToCreateRoom("I dont know what the fork happened here!");
            break;
    }
}

const getChanges = () => {
    if (lastGotChanges === undefined)
        lastGotChanges = Date.now();

    sendGet("/getChanges?roomId=" + currentRoomId + "&timeStamp=" + lastGotChanges, handleGetChanges);
}

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
            page.backToCreateRoom("I dont know what the fork happened here!");
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
