import * as page from "./pageHandler.js";

let currentRoomId;

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

const joinRoom = (id) => {
    sendGet("/joinRoom?id=" + id, joinRoomHandler);
}

const joinRoomHandler = (xhr) => {
    const obj = JSON.parse(xhr.response);

    switch (xhr.status) {
        case 200:
            currentRoomId = obj.room.id;

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

export { getRoomList, createRoom, joinRoom };
