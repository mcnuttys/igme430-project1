import * as server from "./serverHandler.js";
import * as paintHandler from "./paintingHandler.js";

let menuDiv;
let loadingDiv;
let creatingDiv;
let paintingDiv;

const initialize = () => {
    menuDiv = document.querySelector("#menu");
    loadingDiv = document.querySelector("#loadingRoom");
    creatingDiv = document.querySelector("#createRoom");
    paintingDiv = document.querySelector("#paint");

    menuDiv.querySelector("#createNewRoomButton").onclick = clickCreateNewButton;
    menuDiv.querySelector("#refreshRoomListButton").onclick = clickRefreshRoomList;

    creatingDiv.querySelector("#returnToMenuButton").onclick = clickReturnToMenu;
    creatingDiv.querySelector("#createRoomButton").onclick = clickCreateRoom;

    server.getRoomList();
}

const clickCreateNewButton = () => {
    menuDiv.className = "left";
    loadingDiv.className = "right";
    creatingDiv.className = "center";
    paintingDiv.className = "right";
}

const clickRefreshRoomList = () => {
    server.getRoomList();

    let roomListHolder = menuDiv.querySelector("#roomList");
    while (roomListHolder.firstChild) {
        roomListHolder.removeChild(roomListHolder.firstChild);
    }
}

const clickReturnToMenu = () => {
    menuDiv.className = "center";
    creatingDiv.className = "right";
    creatingDiv.className = "right";
    paintingDiv.className = "right";
}

const clickCreateRoom = () => {
    menuDiv.className = "left";
    loadingDiv.className = "center";
    creatingDiv.className = "left";
    paintingDiv.className = "right";

    const roomName = creatingDiv.querySelector("#roomName").value;
    const canvasSize = creatingDiv.querySelector("#canvasSize").value;

    // Send POST request to the server (/createRoom?roomName={roomName}&canvasSize={canvasSize}), 
    // then send GET request (/joinRoom?id={roomId})
    server.createRoom(roomName, canvasSize);
}

const backToCreateRoom = (message) => {
    menuDiv.className = "left";
    loadingDiv.className = "right";
    creatingDiv.className = "center";
    paintingDiv.className = "right";

    creatingDiv.querySelector("#message").innerText = message;
}

const onJoinedRoom = (roomInfo) => {
    menuDiv.className = "left";
    loadingDiv.className = "left";
    creatingDiv.className = "left";
    paintingDiv.className = "center";

    paintHandler.initialize({ width: parseInt(roomInfo.canvasSize), height: parseInt(roomInfo.canvasSize) });
}

const clickJoinRoom = (id) => {
    menuDiv.className = "left";
    loadingDiv.className = "center";
    creatingDiv.className = "right";
    creatingDiv.style.visibility = "hidden"
    paintingDiv.className = "right";

    // Send GET request to join the room
    server.joinRoom(id);
}

const clickJoinRoomButton = (e) => {
    clickJoinRoom(e.target.name);
}

const updateRoomList = (roomList) => {
    let roomListHolder = menuDiv.querySelector("#roomList");
    while (roomListHolder.firstChild) {
        roomListHolder.removeChild(roomListHolder.firstChild);
    }

    let keys = Object.keys(roomList);

    if (keys === undefined) {
        console.dir("null");
        return;
    }

    if (keys.length <= 0) {
        console.dir("empty");
        return;
    }

    for (let i = 0; i < keys.length; i++) {
        createButton(roomList[keys[i]].id, roomList[keys[i]].name, roomListHolder);
    }
}
const errorRoomList = (message) => {
    let roomListHolder = menuDiv.querySelector("#roomList");
    while (roomListHolder.firstChild) {
        roomListHolder.removeChild(roomListHolder.firstChild);
    }

    roomListHolder.innerText = message;
}

const createButton = (name, displayText, holder) => {
    const b = document.createElement('input');
    b.type = "button";
    b.id = name;
    b.name = name;
    b.value = displayText;
    b.onclick = clickJoinRoomButton;

    holder.append(b);
}

export { initialize, errorRoomList, updateRoomList, onJoinedRoom, backToCreateRoom };