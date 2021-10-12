import * as server from "./serverHandler.js";
import * as paintHandler from "./paintingHandler.js";
import * as drawingCanvas from "./drawingCanvas.js";

let menuDiv;
let loadingDiv;
let creatingDiv;
let paintingDiv;

// Setup all the page stuff, this is essentially what main.js would be.
// Pretty much just displays changes, and switches between the different states
const initialize = () => {
    menuDiv = document.querySelector("#menu");
    loadingDiv = document.querySelector("#loadingRoom");
    creatingDiv = document.querySelector("#createRoom");
    paintingDiv = document.querySelector("#paint");

    menuDiv.querySelector("#createNewRoomButton").onclick = clickCreateNewButton;
    menuDiv.querySelector("#refreshRoomListButton").onclick = clickRefreshRoomList;

    creatingDiv.querySelector("#returnToMenuButton").onclick = clickReturnToMenu;
    creatingDiv.querySelector("#createRoomButton").onclick = clickCreateRoom;

    paintingDiv.querySelector("#backToMenu").onclick = clickReturnToMenu;

    server.getRoomList();
}

// Refresh to rooms list
const clickRefreshRoomList = () => {
    server.getRoomList();

    let roomListHolder = menuDiv.querySelector("#roomList");
    while (roomListHolder.firstChild) {
        roomListHolder.removeChild(roomListHolder.firstChild);
    }
}

// Change everything so the main menu state is visible
const clickReturnToMenu = () => {
    menuDiv.className = "center";
    creatingDiv.className = "right";
    creatingDiv.className = "right";
    paintingDiv.className = "right";
}

// Change everything so the create room state is visible
const clickCreateNewButton = () => {
    menuDiv.className = "left";
    loadingDiv.className = "right";
    creatingDiv.className = "center";
    paintingDiv.className = "right";
    creatingDiv.style.visibility = "visible";
}

// Change the state to loading, and send off a create room request
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

// if loading fails go back to the createRoom with the error
const backToCreateRoom = (message) => {
    menuDiv.className = "left";
    loadingDiv.className = "right";
    creatingDiv.className = "center";
    paintingDiv.className = "right";

    creatingDiv.querySelector("#message").innerText = message;
}

// When you join a room, switch from loading to painting state, and set everything up
const onJoinedRoom = (roomInfo) => {
    menuDiv.className = "left";
    loadingDiv.className = "left";
    creatingDiv.className = "left";
    paintingDiv.className = "center";

    paintHandler.initialize({ width: parseInt(roomInfo.canvasSize), height: parseInt(roomInfo.canvasSize) });

    const changes = roomInfo.changes;

    for (let i = 0; i < changes.length; i++) {
        let change = changes[i].change;
        for (let j = 0; j < change.length; j++) {
            drawingCanvas.setPixelI(change[j].pixelIndex, change[j].toColor);
        }
    }
}

// Joined from main menu, so switch to loading and hide creating
const clickJoinRoom = (id) => {
    menuDiv.className = "left";
    loadingDiv.className = "center";
    creatingDiv.className = "right";
    creatingDiv.style.visibility = "hidden"
    paintingDiv.className = "right";

    // Send GET request to join the room
    server.joinRoom(id);
}

// Cause of funky things this is just the button click handler
// I could probably at this point update it but also...
// It works! Stuff like this is why I wanted a recode :(
const clickJoinRoomButton = (e) => {
    clickJoinRoom(e.target.name);
}

// Given a roomList update the rooms list
const updateRoomList = (roomList) => {
    let roomListHolder = menuDiv.querySelector("#roomList");
    while (roomListHolder.firstChild) {
        roomListHolder.removeChild(roomListHolder.firstChild);
    }

    let keys = Object.keys(roomList);

    if (keys === undefined) {
        console.dir("Room list is broken");
        return;
    }

    if (keys.length <= 0) {
        console.dir("Room list is empty for some reason");
        return;
    }

    for (let i = 0; i < keys.length; i++) {
        createButton(roomList[keys[i]].id, "Room Name: " + roomList[keys[i]].name + " | Id: " + keys[i], roomListHolder);
    }
}

// Display a room error message in place of the rooms list
const errorRoomList = (message) => {
    let roomListHolder = menuDiv.querySelector("#roomList");
    while (roomListHolder.firstChild) {
        roomListHolder.removeChild(roomListHolder.firstChild);
    }

    roomListHolder.innerText = message;
}

// Funky stuff with creating the rooms list and buttons
// Just all the stuff required to create a button on the DOM
const createButton = (name, displayText, holder) => {
    const b = document.createElement('input');
    b.type = "button";
    b.id = name;
    b.name = name;
    b.className = "button"
    b.value = displayText;
    b.onclick = clickJoinRoomButton;

    holder.append(b);
}

export { initialize, errorRoomList, updateRoomList, onJoinedRoom, backToCreateRoom };