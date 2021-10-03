const rooms = {

};

const createRoom = (roomName, canvasSize) => {
    let room = {
        id: getRandomId(),
        name: roomName,
        canvasSize: canvasSize
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

const getRandomId = () => {
    return Math.round(Math.random() * 100000)
}

module.exports = {
    createRoom,
    getRoom,
    getRooms
};