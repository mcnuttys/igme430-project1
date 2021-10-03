const roomManager = require('./roomManager.js');

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you were looking for was not found.',
        id: 'notFound',
    };

    respondJSON(request, response, 404, responseJSON);
};

const getRooms = (request, response) => {
    const rooms = roomManager.getRooms();

    const responseJSON = {
        message: "Sucessfully got rooms",
    }

    if (rooms === undefined || Object.keys(rooms).length <= 0) {
        responseJSON.message = "The room you requested was missing!";
        responseJSON.id = "notFound";

        // Not really sure what the error code is here but I think 204 is right
        // There is no data to be sent back... I suspect im gonna need to do the 
        // Meta
        return respondJSONMeta(request, response, 204);
    }

    responseJSON.rooms = rooms;
    responseJSON.id = "getRooms";

    return respondJSON(request, response, 200, responseJSON);
}

const createRoom = (request, response, body) => {
    const responseJSON = {
        message: "Sucessfully created room!"
    };

    if (body.roomName === '' || body.roomName.length > 25) {
        responseJSON.message = "The room name must not be nothing and must be less then 25 chars!";
        responseJSON.id = "badRequest";

        return respondJSON(request, response, 400, responseJSON);
    }

    let size = parseInt(body.canvasSize);
    if (size <= 0 || size > 600) {
        responseJSON.message = "The room must be greater then 0 and less then 600!";
        responseJSON.id = "badRequest";

        return respondJSON(request, response, 400, responseJSON);
    }

    const room = roomManager.createRoom(body.roomName, body.canvasSize);
    responseJSON.room = room;
    responseJSON.id = "createRoom";
    responseJSON.playerId = roomManager.addPlayer(room.id);

    return respondJSON(request, response, 201, responseJSON);
}

const joinRoom = (request, response, parsedUrl) => {
    let query = parsedUrl.query;

    const room = roomManager.getRoom(query.id);
    const responseJSON = {
        message: "Sucessfully joined room!"
    }

    if (query.id === '') {
        responseJSON.message = "Bad Room ID!";
        responseJSON.id = "badRequest";
        return respondJSON(request, response, 400, responseJSON);
    }

    if (room === null) {
        responseJSON.message = "The room with this ID does not exist!";
        responseJSON.id = "badRequest";
        return respondJSON(request, response, 404, responseJSON);
    }

    responseJSON.room = room;
    responseJSON.id = "joinedRoom";
    responseJSON.playerId = roomManager.addPlayer(room.id);

    respondJSON(request, response, 200, responseJSON)
}

const updatePlayer = (request, response, body) => {
    const responseJSON = {
        message: "Sucessfully got player positions!"
    }

    if (body.roomId === '') {
        responseJSON.message = "Bad Room ID!";
        responseJSON.id = "badRequest";
        return respondJSON(request, response, 400, responseJSON);
    }

    if (body.playerId === '') {
        responseJSON.message = "Bad Room ID!";
        responseJSON.id = "badRequest";
        return respondJSON(request, response, 400, responseJSON);
    }

    const updatePlayer = roomManager.updatePlayerPosition(body.roomId, body.playerId, body.mousePosX, body.mousePosY, body.color);

    if (updatePlayer.type === 404) {
        responseJSON.message = updatePlayer.message;
        responseJSON.id = "notFound";

        return respondJSON(request, response, 404, responseJSON);
    }

    return respondJSONMeta(request, response, 204);
}

const getPlayers = (request, response, parsedUrl) => {
    let query = parsedUrl.query;

    const roomId = query.roomId;
    const responseJSON = {
        message: "successfully pulled the playerlist"
    };

    if (roomId === '') {
        responseJSON.message = "invalid id";
        responseJSON.id = "badRequest";

        return respondJSON(request, response, 400, responseJSON);
    }

    responseJSON.id = "getPlayerList";
    responseJSON.players = roomManager.getPlayerList(roomId);

    return respondJSON(request, response, 200, responseJSON);
}

module.exports = {
    notFound,
    createRoom,
    getRooms,
    joinRoom,
    updatePlayer,
    getPlayers
};
