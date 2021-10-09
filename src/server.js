const http = require('http');
const url = require('url');
const query = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/styles.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/roomList': responseHandler.getRooms,
    '/joinRoom': responseHandler.joinRoom,
    '/getPlayers': responseHandler.getPlayers,
    '/getChanges': responseHandler.getChanges,
  },
  HEAD: {
    '/roomList': responseHandler.getRoomsMeta,
    '/joinRoom': responseHandler.joinRoomMeta,
    '/getPlayers': responseHandler.getPlayersMeta,
    '/getChanges': responseHandler.getChangesMeta,
  },
  POST: {
    '/createRoom': responseHandler.createJoinRoom,
    '/updatePlayer': responseHandler.updatePlayer,
    '/sendChange': responseHandler.addChange,
  },

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
    if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      urlStruct.POST[parsedUrl.pathname](request, response, bodyParams);
    }

    if (request.headers['content-type'] === 'application/json') {
      const content = JSON.parse(Buffer.concat(body));

      urlStruct.POST[parsedUrl.pathname](request, response, content);
    }
  });
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);

  if (urlStruct[request.method] && urlStruct[request.method][parsedUrl.pathname]) {
    if (request.method === 'POST') {
      postHandler(request, response, parsedUrl);
    } else {
      urlStruct[request.method][parsedUrl.pathname](request, response, parsedUrl);
    }
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
