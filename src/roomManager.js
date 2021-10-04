const rooms = {

};

const getRandomId = () => Math.round(Math.random() * 100000);

const createRoom = (roomName, canvasSize) => {
  const room = {
    id: getRandomId(),
    name: roomName,
    canvasSize,
    players: [],
  };

  rooms[room.id] = room;
  return room;
};

const getRoom = (id) => {
  if (rooms[id]) { return rooms[id]; }

  return null;
};

const getRooms = () => rooms;

const addPlayer = (roomId) => {
  let id = getRandomId();
  while (rooms[roomId].players.includes(id)) {
    id = getRandomId();
  }

  rooms[roomId].players.push({ id, position: { mousePosX: -100, mousePosY: -100 }, color: '#FFFFFFFF' });
  return id;
};

const updatePlayerPosition = (roomId, playerId, mousePosX, mousePosY, playerColor) => {
  const rId = parseInt(roomId, 10);
  const pId = parseInt(playerId, 10);

  const room = rooms[rId];

  if (room === undefined) {
    return { type: 404, message: 'The room was not found!' };
  }

  const player = room.players.find((p) => p.id === pId);

  if (player === undefined) {
    return { type: 404, message: 'The player was not found!' };
  }

  player.position = { mousePosX, mousePosY };
  player.color = `${playerColor}FF`;
  player.lastUpdated = Date.now();
  return { type: 204, message: 'The player was updated sucessfully!' };
};

const cleanPlayerList = (room) => {
  const { players } = room;
  const pList = [];

  const tNow = Date.now();
  for (let i = players.length - 1; i >= 0; i--) {
    const age = tNow - players[i].lastUpdated;

    let { color } = players[i];
    const alpha = parseInt(((1 - (age / 5000)) * 255), 10);
    color = color.slice(0, color.length - 2);
    color += (`00${alpha.toString(16)}`).slice(-2);
    players[i].color = color;

    pList.push(players[i]);
  }

  return pList;
};

const getPlayerList = (roomId) => {
  if (!rooms[roomId]) { return []; }

  const room = rooms[roomId];
  const playerList = cleanPlayerList(room);

  return playerList;
};

module.exports = {
  createRoom,
  getRoom,
  getRooms,
  addPlayer,
  updatePlayerPosition,
  getPlayerList,
};
