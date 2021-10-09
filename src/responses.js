const roomManager = require('./roomManager.js');

// These top three just came right from my API II homework and class examples
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

// Gets the room list from the room manager and sends it back to the user
const getRooms = (request, response) => {
  const responseJSON = {
    message: 'Sucessfully got rooms',
  };

  // Checks if any rooms were gotten from the roommanager
  const rooms = roomManager.getRooms();
  if (rooms === undefined || Object.keys(rooms).length <= 0) {
    responseJSON.message = 'The rooms you requested was missing!';
    responseJSON.id = 'notFound';

    return respondJSONMeta(request, response, 204);
  }

  responseJSON.rooms = rooms;
  responseJSON.id = 'getRooms';

  return respondJSON(request, response, 200, responseJSON);
};

// Gets the content type of the room
const getRoomsMeta = (request, response) => respondJSONMeta(request, response, 200);

// Given characteristics create a room in the room manager.
// If the roomname or size is invalid return error codes.
// Otherwise we make it through and return the created room.
// It also joins the current user to the room
const createJoinRoom = (request, response, body) => {
  const responseJSON = {
    message: 'Sucessfully created room!',
  };

  // Check if the roomname gotten is valid.
  const roomname = body.roomName;
  if (roomname === '' || roomname.length > 25) {
    responseJSON.message = 'The room name must not be empty, and must be less then 25 characters!';
    responseJSON.id = 'badRequest';

    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if the canvas size is valid.
  const size = parseInt(body.canvasSize, 10);
  if (size <= 0 || size > 600) {
    responseJSON.message = 'The room must be greater then 0 and less then 600!';
    responseJSON.id = 'badRequest';

    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if we sucessfully created the room
  const room = roomManager.createRoom(body.roomName, size);
  if (room === null) {
    responseJSON.message = 'Something went wrong creating the room!';
    responseJSON.id = 'serverError';

    return respondJSON(request, response, 500, responseJSON);
  }

  // Check if we joined the player to the created room
  const playerId = roomManager.addPlayer(room.id);
  if (playerId === undefined) {
    responseJSON.message = 'Something went wrong creating the room!';
    responseJSON.id = 'serverError';

    return respondJSON(request, response, 500, responseJSON);
  }

  responseJSON.room = room;
  responseJSON.id = 'createRoom';
  responseJSON.playerId = playerId;

  return respondJSON(request, response, 201, responseJSON);
};

const joinRoom = (request, response, parsedUrl) => {
  const responseJSON = {
    message: 'Sucessfully joined room!',
  };

  const { query } = parsedUrl;

  // Check if the query was correct
  if (query.id === '') {
    responseJSON.message = 'Bad Room ID!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if the room queried was correct
  const room = roomManager.getRoom(query.id);
  if (room === null) {
    responseJSON.message = 'The room with this ID does not exist!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 404, responseJSON);
  }

  // Check if we joined the player to the created room
  const playerId = roomManager.addPlayer(room.id);
  if (playerId === undefined) {
    responseJSON.message = 'Something went wrong creating the room!';
    responseJSON.id = 'serverError';

    return respondJSON(request, response, 500, responseJSON);
  }

  responseJSON.room = room;
  responseJSON.id = 'joinedRoom';
  responseJSON.playerId = playerId;

  return respondJSON(request, response, 200, responseJSON);
};

const joinRoomMeta = (request, response) => respondJSONMeta(request, response, 200);

// Updates the stored player position in the room.
const updatePlayer = (request, response, body) => {
  const responseJSON = {
    message: 'Sucessfully got player positions!',
  };

  // Check if the roomId from the user is correct
  if (body.roomId === '') {
    responseJSON.message = 'Bad Room ID!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if the playerId from the user is correct
  if (body.playerId === '') {
    responseJSON.message = 'Bad Player ID!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if the mousePosX from the user is correct
  if (body.mousePosX === '') {
    responseJSON.message = 'Bad MousePosX!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if the mousePosY from the user is correct
  if (body.mousePosY === '') {
    responseJSON.message = 'Bad MousePosY!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if the color from the user is correct
  if (body.mousePosY === '') {
    responseJSON.message = 'Bad Color!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Update the player on the room manager
  const updatedPlayer = roomManager.updatePlayerPosition(
    body.roomId,
    body.playerId,
    body.mousePosX,
    body.mousePosY,
    body.color,
  );

  // The room manager had some issues updating the player so send that back
  if (updatedPlayer.type === 404) {
    responseJSON.message = updatedPlayer.message;
    responseJSON.id = 'notFound';

    return respondJSON(request, response, 404, responseJSON);
  }

  return respondJSONMeta(request, response, 204);
};

// Gets the list of players from the roomManager in a given room
const getPlayers = (request, response, parsedUrl) => {
  const responseJSON = {
    message: 'successfully pulled the playerlist',
  };

  const { query } = parsedUrl;
  const { roomId } = query;

  // Check if roomId is valid
  if (roomId === '') {
    responseJSON.message = 'invalid id';
    responseJSON.id = 'badRequest';

    return respondJSON(request, response, 400, responseJSON);
  }

  responseJSON.id = 'getPlayerList';
  responseJSON.players = roomManager.getPlayerList(roomId);

  return respondJSON(request, response, 200, responseJSON);
};

const getPlayersMeta = (request, response) => respondJSONMeta(request, response, 200);

// Adds a change to the rooms changelist
const addChange = (request, response, body) => {
  const responseJSON = {
    message: 'Successfully added changes',
  };

  const { roomId } = body;
  const { changes } = body;
  const timeStamp = body.time;

  // Check if the gotten stuff from the user is correct
  if (roomId === undefined || changes === undefined || timeStamp === undefined) {
    responseJSON.message = 'The change must contain a roomId, change, and timestamp!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if we can get the room from the roomManager
  const room = roomManager.getRoom(roomId);
  if (room === null) {
    responseJSON.message = 'The room with this ID does not exist!';
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  roomManager.addChange(roomId, changes, timeStamp);
  return respondJSONMeta(request, response, 204);
};

// Gets the changelist of the given room.
// Is filter by the timestamp as it does not get any changes from before it.
const getChanges = (request, response, parsedUrl) => {
  const responseJSON = {
    message: 'Successfully got changes',
  };

  const { query } = parsedUrl;

  // check if the query roomId is given
  if (query.roomId === '') {
    responseJSON.message = 'You must provide a room ID to get room changes!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Check if the query timestamp is given... I feel like these comments are useless
  if (query.timeStamp === undefined) {
    responseJSON.message = 'You must provide a timestamp to get room changes!';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  const changes = roomManager.getChanges(query.roomId, query.timeStamp);
  responseJSON.changes = changes;

  return respondJSON(request, response, 200, responseJSON);
};

const getChangesMeta = (request, response) => respondJSONMeta(request, response, 200);

module.exports = {
  notFound,
  getRooms,
  getRoomsMeta,
  createJoinRoom,
  joinRoom,
  joinRoomMeta,
  updatePlayer,
  getPlayers,
  getPlayersMeta,
  addChange,
  getChanges,
  getChangesMeta,
};
