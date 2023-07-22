const port = 8000;
const websocketserver = require("websocket").server;
const http = require("http");

// let the web socket server answer the http requests
const server = http.createServer();
server.listen(port);
console.log("Listening on port 8000");

const webServer = new websocketserver({
  httpServer: server,
});

const clients = {};

// generate unique id for every user
const getUniqueID = () => {
  const uid = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  return uid() + uid() + "-" + uid();
};

webServer.on("request", function (request) {
  // creating the request
  var userID = getUniqueID();
  console.log("Reqqq");
  console.log(
    new Date() +
      "Received a new connection from origin " +
      request.origin +
      "."
  );

  // Accepting the requests from the origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  );

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("received Message: ", message.utf8Data);

      const dataFromClient = JSON.parse(message.utf8Data);

      if (dataFromClient.type === "message") {
        const dataToSend = JSON.stringify({
          type: "message",
          msg: dataFromClient.msg,
          user: dataFromClient.user,
        });

        // Broadcasting the message to all the clients
        for (key in clients) {
          clients[key].sendUTF(dataToSend);
          console.log("Sent message to: ", clients[key]);
        }
      }
    }
  });
});