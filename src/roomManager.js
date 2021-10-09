// Start the rooms object empty!
// I almost wanted to make a default room but that would be kind of a pain
// considering if I wanted there to be changes on the room it would be MASSIVE
const rooms = {};

// Just a method to get a random ID in the format im using,
// typically I think UUID stuff would be used here
const getRandomId = () => Math.round(Math.random() * 100000);

// Creates a room on the rooms object given a room name, and canvasSize
const createRoom = (roomName, canvasSize) => {
  const room = {
    id: getRandomId(),
    name: roomName,
    canvasSize,
    players: [],
    changes: [],
  };

  rooms[room.id] = room;
  return room;
};

// Gets a room from the rooms list given an ID
const getRoom = (id) => {
  if (rooms[id]) { return rooms[id]; }

  return null;
};

// Gets the list of rooms
const getRooms = () => rooms;

// Adds a player to a given room
const addPlayer = (roomId) => {
  // Gets a random ID for that player that the room does not already contain
  let id = getRandomId();
  while (rooms[roomId].players.includes(id)) {
    id = getRandomId();
  }

  rooms[roomId].players.push({ id, position: { mousePosX: -100, mousePosY: -100 }, color: '#FFFFFFFF' });
  return id;
};

// Updates a players stats inside a given roomId and playerId
const updatePlayerPosition = (roomId, playerId, mousePosX, mousePosY, playerColor) => {
  const rId = parseInt(roomId, 10);
  const pId = parseInt(playerId, 10);

  const room = rooms[rId];

  // Got a weird return format so that if there are any issues updating player data we are good.
  // I could probably avoid this by using like getRoom and such in responses.js
  // BUT I implemented this as a question to see if this was an acceptable method...
  // ... But then I forgot to ask and now I want to keep it cause its funny
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

// Cleans the given rooms playerlist, before I had it actually
// removing players from the list if they were too old but
// then with the fading out and lerping it caused issues so I should just rename the method but...
// ... Well I suck at coming up with names so im moving on
const cleanPlayerList = (room) => {
  const { players } = room;
  const pList = [];

  const tNow = Date.now();
  for (let i = players.length - 1; i >= 0; i--) {
    const age = tNow - players[i].lastUpdated;

    let { color } = players[i];

    if (age < 5000) {
      const alpha = parseInt(((1 - (age / 5000)) * 255), 10);
      color = color.slice(0, color.length - 2);
      color += (`00${alpha.toString(16)}`).slice(-2);
      players[i].color = color;
    }

    pList.push(players[i]);
  }

  return pList;
};

// Gets a list of players on a room given a roomId
const getPlayerList = (roomId) => {
  if (!rooms[roomId]) { return []; }

  const room = rooms[roomId];
  const playerList = cleanPlayerList(room);

  return playerList;
};

// Cleans up the rooms change histroy
// Same with playerListCleanup I just cant come up with a better name
// I guess maybe sanitizing?
// All it does is sort the list by the timestamp,
// which I dont even know if I did right but hey it functions
const cleanRoomChanges = (roomId) => {
  const room = rooms[roomId];

  room.changes.sort((a, b) => a.timestamp > b.timestamp);
};

// Adds a change to a given rooms change list
const addChange = (roomId, change, timestamp) => {
  const room = rooms[roomId];

  room.changes.push({ timestamp, change });
};

// Gets a given rooms change history, filtered based off a given timestamp
// Only returns changes that occured after the timestamp
// This did not have any issues in my breif testing and that terrifies me...
const getChanges = (roomId, timestamp) => {
  const room = rooms[roomId];
  const changes = [];

  if (room === undefined) { return changes; }

  cleanRoomChanges(roomId);

  for (let i = 0; i < room.changes.length; i++) {
    const change = room.changes[i];
    if (change.timestamp > timestamp) {
      changes.push(change);
    }
  }

  return changes;
};

module.exports = {
  createRoom,
  getRoom,
  getRooms,
  addPlayer,
  updatePlayerPosition,
  getPlayerList,
  addChange,
  getChanges,
};
