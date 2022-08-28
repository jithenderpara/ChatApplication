const _ = require("lodash");
const express = require('express');
const app = express();
var path = require("path");
const port = 3000; // define your port
const server = app.listen(port, () => {
  console.log(`We are Listening on port ${port}...`);
});

const io = require('socket.io')(server, {
  path: "/pathToConnection"
});
app.use("/static", express.static(path.join(__dirname, "public")));
// routes
app.get("/", (req, res) => {
  const indexFile = path.resolve("./views/index.html");
  res.status(200).sendFile(indexFile);
});
let users = {};
io.on('connection', (socket) => {

  let userId = socket.handshake.query.userId; // GET USER ID
  console.log("connected", userId)
  // CHECK IS USER EXHIST 
  if (!users[userId]) users[userId] = [];
  
  // PUSH SOCKET ID FOR PARTICULAR USER ID
  users[userId].push(socket.id);
   
  // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
  io.sockets.emit("online", users);
  console.log(userId, "Is Online!", socket.id);

 
  socket.on("message", (data)=>{
    console.log("in message");
    const { fromUser, toUser, message }= data;
    const socketId=users[toUser][0];
    if(socketId)
    io.to(socketId).emit('receivedMessage', {from: fromUser, to:toUser, message });
    // socketId.emit('receivedMessage', data)
  });

  // DISCONNECT EVENT
  socket.on('disconnect', (reason) => {

    // REMOVE FROM SOCKET USERS
    _.remove(users[userId], (u) => u === socket.id);
    if (users[userId].length === 0) {
      // ISER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
      io.sockets.emit("offline", userId);
      // REMOVE OBJECT
      delete users[userId];
    }
   
    socket.disconnect(); // DISCONNECT SOCKET

    console.log(userId, "Is Offline!", socket.id);

  });

});