// const _ = require("lodash");
import _ from "lodash";
// const express = require("express");
import express from "express";
const app = express();
import { resolve } from "path";

// var path = require("path");
// var session = require("client-sessions");
import session from "client-sessions";

// var bodyParser = require("body-parser");
import bodyParser from "body-parser";
import routes from "./src/routes/index.js";
import routerFile from "./src/routes/uploadFiles.js";
//

// app.use(require('./routes/main'));
//
import { connect } from "./src/config/index.js";
const port = 3000; // define your port
const server = app.listen(port, () => {
  console.log(`We are Listening on port ${port}...`);
});

// middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, keepExtensions: true, uploadDir: "uploads" }));
// parse application/json
app.use(bodyParser.json());

app.use(
  session({
    cookieName: "session",
    secret: "keyboard cat",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);
// app.use(csrf());
// const io = require("socket.io")
import { Server } from "socket.io";
const io = new Server(server, {
  path: "/pathToConnection",
});
connect();
// routes
app.use('/api', routes);
app.use('/api', routerFile);
app.use("/static", express.static(resolve("public")));
// routes
app.get("/", (req, res) => {
  const indexFile = resolve("./src/views/signin.html");
  res.status(200).sendFile(indexFile);
});
app.get("/home", (req, res) => {
  if(req.session && req.session.user){
    const {emailId, userName } = req.session.user;
    const indexFile = resolve("./src/views/home.html");
    res.header('userName',userName);
    res.status(200).sendFile(indexFile);
  }else{
    res.redirect('/logout');
  }
  
});
app.get('/logout', function (req, res) {
  if (req.session) {
      req.session.reset();
  }
  res.redirect('/');
});
/** start socket */
let users = {};
io.on("connection", (socket) => {
  let userId = socket.handshake.query.userId; // GET USER ID
  let email = socket.handshake.query.email; // GET USER ID
  console.log("connected", userId);
  // CHECK IS USER EXHIST
  if (!users[userId]) users[userId] = [];

  // PUSH SOCKET ID FOR PARTICULAR USER ID
  users[userId].push(socket.id);
  // users[userId].push(email);
  // users[userId].push({id:socket.id, email:emailId});

  // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
  io.sockets.emit("online", users);
  console.log(userId, "Is Online!", socket.id);

  socket.on("message", (data) => {
    console.log("in message");
    const { fromUser, toUser, message } = data;
    console.log(users)
    const socketId = users[toUser][0];
    if (socketId)
      io.to(socketId).emit("receivedMessage", {
        from: fromUser,
        to: toUser,
        message,
      });
    // socketId.emit('receivedMessage', data)
  });

  // DISCONNECT EVENT
  socket.on("disconnect", (reason) => {
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
/** End socket */
/*****
 *
 *
 * all post Methods
 */

app.post("/login", (req, res) => {
  const { userName, emailId, password, designation } = req.body;
  var cleanUser = {
    userName: userName,
    password: password,
    email: emailId,
    designation,
  };

  req.session.user = cleanUser;
  req.user = cleanUser;
  res.status(200).send({ userName, emailId });
});
app.get("/getUserInfo", (req, res) => {
  const { userName, emailId, designation } = req.session.user;
  res.status(200).send({ userName, emailId, designation });
});
