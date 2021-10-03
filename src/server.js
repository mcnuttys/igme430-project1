const http = require('http');
const url = require('url');
const query = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/styles.css': htmlHandler.getCSS,
  '/bundle.js': htmlHandler.getBundle,
  '/roomList': responseHandler.getRooms,
  '/createRoom': responseHandler.createRoom,
  '/joinRoom': responseHandler.joinRoom,
  '/updatePlayer': responseHandler.updatePlayer,
  '/getPlayers': responseHandler.getPlayers,
  notFound: responseHandler.notFound,
};

const postHandler = (request, response, parsedUrl) => {
  const res = response;

  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    urlStruct[parsedUrl.pathname](request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);

  if (urlStruct[parsedUrl.pathname]) {
    if (request.method === 'POST') {
      postHandler(request, response, parsedUrl);
    } else {
      urlStruct[parsedUrl.pathname](request, response, parsedUrl);
    }
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

/*

--- Back-End code plan! --

server.js
    onRequest(request, response)
        - handle responses passing into the urlStruct
        - differentiate between the accepted headers stuff
            and talk to either the jsonResponses or xmlResponses
            although if im careful I might be able to simply get
            away with at responses and just use a xmlParse thing

htmlResponses.js
    getIndex()
        - returns the index
    getCSS()
        - returns the css
    getBundle()
        - Returns the javascript

jsonResponses.js
    - TODO!

--- Possible Behavior ---
    To figure out what im doing I am going to quickly set up a chat
    server.

    Other then that:
        - CreateRoom(roomName, canvasSizeX, canvasSizeY)
            - Creates and adds a room to the rooms array, might give it
                some uuid. Regardless it is going to have the list of changes
                it recieves and sends back
        - JoinRoom()
            - Gets the current drawing which is just what the server sees

        - AddChange(roomId, timestamp, changedPixesl[])
            - Adds to the given room the changes pixels and gives each the timestamp.
                Will likely compare the pixel at the position and if this one is newer change it
                otherwise dont bother.

*/
