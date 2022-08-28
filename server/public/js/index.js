const host = "http://localhost:3000";
// PASS your query parameters
const queryParams = { userId: window.location.href.split("?name=")[1] };
const socket = io(host, {
  path: "/pathToConnection",
  transports: ["websocket"],
  upgrade: false,
  query: queryParams,
  reconnection: false,
  rejectUnauthorized: false,
});
let users = [];
let userId = null;
function sendMessage() {
    const date = new Date();
    const time = date.getHours() + ":" + date.getMinutes(); // + ":" + date.getSeconds();
  const message = document.getElementById("messageTextBox").value;
  const data = { fromUser: queryParams.userId, toUser: userId, message };
  const html = `<div class="message-container"><div class="message-orange">
    <p class="message-content">${message}</p>
    <div class="message-timestamp-left">SMS ${time}</div>
</div></div>`;
document.getElementById("messages").innerHTML += html;
  socket.emit("message", data);
}
function getUserId(event, id) {
  console.log(event);
  const element = document.getElementById(id);
  document.getElementById("messageTextBox").removeAttribute("disabled", false);
  document.getElementById("submitBtn").removeAttribute("disabled", false);
  element.classList.add("active");
  userId = id;
}
function bindUesrs(users) {
  let userHtml = "";
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    if (queryParams.userId !== user.userId) {
      if (user.status == "Offline") {
        userHtml += `<div><button class="userName" disabled id="${user.userId}" onClick="getUserId(event, '${user.userId}')"> ${user.userId}
      Is ${user.status} !</button> </div>`;
      } else
        userHtml += `<div><button class="userName" id="${user.userId}" onClick="getUserId(event, '${user.userId}')"> ${user.userId}
      Is ${user.status} !</button> </div>`;
    }
  }
  document.getElementById("logs").innerHTML = userHtml;
}
document.getElementById("host").innerHTML = host;
document.getElementById("userId").innerHTML = queryParams.userId;

socket.once("connect", () => {
  document.getElementById("connection").innerHTML = "connected";
  // USER IS ONLINE
  socket.on("online", (usersObj) => {
    users = [];
    console.log(usersObj, "Is Online!"); // update online status
    for (const key in usersObj) {
      console.log(`${key}: ${usersObj[key]}`);
      users.push({ userId: key, status: "Online" });
    }
    bindUesrs(users);
  });

  // USER IS OFFLINE
  socket.on("offline", (userId) => {
    console.log(userId, "Is Offline!"); // update offline status
    var findUser = users.filter((user) => user.userId == userId);
    if (findUser.length > 0) {
      findUser[0].status = "Offline";
    }
    bindUesrs(users);
    // document.getElementById("logs").innerHTML +=
    //   "<div class='users'>" + userId + " Is Offline! </div>";
  });

  // ==== SUPPORTIVES

  socket.on("connect_error", (err) => {
    document.getElementById("connection").innerHTML =
      "Connect Error - " + err.message;
    console.log(err.message);
  });
  socket.on("connect_timeout", () => {
    document.getElementById("connection").innerHTML =
      "Conection Time Out Please Try Again.";
  });
  socket.on("reconnect", (num) => {
    document.getElementById("connection").innerHTML = "Reconnected - " + num;
  });
  socket.on("reconnect_attempt", () => {
    document.getElementById("connection").innerHTML = "Reconnect Attempted.";
  });
  socket.on("reconnecting", (num) => {
    document.getElementById("connection").innerHTML = "Reconnecting - " + num;
  });
  socket.on("reconnect_error", (err) => {
    document.getElementById("connection").innerHTML =
      "Reconnect Error - " + err.message;
  });
  socket.on("reconnect_failed", () => {
    document.getElementById("connection").innerHTML = "Reconnect Failed";
  });
  // receivedMessage
  socket.on("receivedMessage", function (data) {
    console.log("receivedMessage=>", data);
    bindMessage({
      fromUser: data.from,
      toUser: data.to,
      message: data.message,
    });
  });
});

function bindMessage({ fromUser, toUser, message }) {
    const date = new Date();
    const time = date.getHours() + ":" + date.getMinutes(); // + ":" + date.getSeconds();
  const html = `<div class="message-container"><div class="username">${fromUser}</div><div class="message-blue">
    <p class="message-content">${message}</p>
    <div class="message-timestamp-left">SMS ${time}</div>
</div></div>`;
  //   const html = `<div class="container">
  //     <div class="username">${fromUser}</div>
  //     <div class="messagebox">
  //     <div class="arrow">

  //       <div class="outer"></div>
  //       <div class="inner"></div>
  //     </div>
  //     <div class="message-body">
  //       <p>${message}</p>
  //     </div>
  //     </div>
  //   </div>`;
  document.getElementById("messages").innerHTML += html;
}
