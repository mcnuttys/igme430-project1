const rooms = {

};

const createRoom = (roomName, canvasSize) => {
    let room = {
        id: getRandomId(),
        name: roomName,
        canvasSize: canvasSize,
        players: []
    };

    rooms[room.id] = room;
    return room;
}

const getRoom = (id) => {
    if (rooms[id])
        return rooms[id];

    return null;
}

const getRooms = () => {
    return rooms;
}

const addPlayer = (roomId) => {
    let id = getRandomId();
    while (rooms[roomId].players.includes(id)) {
        id = getRandomId();
    }

    rooms[roomId].players.push({ id, position: { mousePosX: -100, mousePosY: -100 } });
    return id;
}

const updatePlayerPosition = (roomId, playerId, mousePosX, mousePosY, playerColor) => {
    const rId = parseInt(roomId);
    const pId = parseInt(playerId);

    const room = rooms[rId];

    if (room === undefined) {
        return { type: 404, message: "The room was not found!" };;
    }

    const player = room.players.find((p) => p.id === pId);

    if (player === undefined) {
        return { type: 404, message: "The player was not found!" };
    }

    player.position = { mousePosX, mousePosY };
    player.color = playerColor;
    return { type: 204, message: "The player was updated sucessfully!" };
}

const getPlayerList = (roomId) => {
    if (!rooms[roomId])
        return [];

    const room = rooms[roomId];

    return room.players;
}

const getRandomId = () => {
    return Math.round(Math.random() * 100000)
}

module.exports = {
    createRoom,
    getRoom,
    getRooms,
    addPlayer,
    updatePlayerPosition,
    getPlayerList
};