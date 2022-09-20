function loadUserInfo(host, { userName, email }) {
  // const host = "http://localhost:3000";
  // PASS your query parameters
  const queryParams = { userId: userName, email };
  // $("#currentUserId").text(userId);
  const socket = io(host, {
      path: "/pathToConnection",
      transports: ["websocket"],
      upgrade: false,
      query: queryParams,
      reconnection: false,
      rejectUnauthorized: false,
  });
  let users = [];
  socket.once("connect", () => {
      // USER IS ONLINE
      socket.on("online", (usersObj) => {
          users = [];
          console.log(usersObj, "Is Online!"); // update online status
          for (const key in usersObj) {
              console.log(`${key}: ${usersObj[key]}`);
              users.push({ userId: key, status: "Online"});
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
  $("#sendMessage").click(function () {
      const message = $("#inputMsg").val();
      console.log(message, "message===>")
      const data = { fromUser: userId, toUser: selectedUser, message };
      console.log(data, "sendMessage")
      socket.emit("message", data);
      const date = new Date();
      const time = date.getHours() + ":" + date.getMinutes(); // + ":" + date.getSeconds();
      const html = `<li class="sender">
                  <p> ${message}</p>
                  <span class="time">${time}</span>
                  </li>`;
      $("#UserMessage").append(html);
      $("#inputMsg").val('');
      saveMsgInDB({fromUser: queryParams.userId, toUser: selectedUser, message});
  })
}
function sendMessage() {
  const date = new Date();
  const time = date.getHours() + ":" + date.getMinutes(); // + ":" + date.getSeconds();
  const message = document.getElementById("messageTextBox").value;
  const data = { fromUser: queryParams.userId, toUser: userId, message };
  const html = `<div class="message-container"><div class="message-orange">
    <p class="message-content">${message}</p>
    <div class="message-timestamp-left">SMS ${time}</div>
</div></div>`;
  // document.getElementById("messages").innerHTML += html;
  document.getElementById(`${userId}_tab`).innerHTML += html;
  socket.emit("message", data);
  saveMsgInDB({fromUser: queryParams.userId, toUser: userId, message});

}
function saveMsgInDB({fromUser,toUser,message }){
  const reqBody={
    "email":UserEmailId,
    "fullName":fromUser,
    "from":fromUser,
    "to":toUser,
    "message":message,
    "type":"text"
}
  $.ajax({
    type: "POST", //rest Type
    url: "/api/user/saveMessages",
    async: true,
    data: JSON.stringify(reqBody),
    contentType: "application/json; charset=utf-8",
    success: function (response) {
        const { msg, status } = response;
        if (status == "OK") {
          console.log(msg, "saved message");
        }
        else {
            alert(msg);
        }
    },
});
}
function getUserId(event, id) {
  console.log(event);
  const element = document.getElementById(id);
  document.getElementById("messageTextBox").removeAttribute("disabled", false);
  document.getElementById("submitBtn").removeAttribute("disabled", false);
  element.classList.add("active");
  userId = id;
  createTabsOfUsers(id);
}
let userId = null;
let selectedUser= null;
let UserEmailId=null;
function bindUesrs(users) {
  let userOfflineHtml = "";
  let userOnLineHtml = "";
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    if (userId !== user.userId) {
      if (user.status == "Offline") {
        userOfflineHtml += `<a href="#" class="d-flex align-items-center" id="${user.userId}" onClick="chatToUser('${user.userId}')">
        <div class="flex-shrink-0">
            <img class="img-fluid"
                src="https://mehedihtml.com/chatbox/assets/img/user.png"
                alt="user img">
                <span class="${user.status=='Online'?"active":""}"></span>
        </div>
        <div class="flex-grow-1 ms-3">
            <h3 class="userName">${user.userId}</h3>
            <p class="recentMsg"><button>${user.status}</p>
        </div>
    </a>`;
      } else
      userOnLineHtml += `<a href="javascript:void(0)" class="d-flex align-items-center" id="${user.userId}" 
      onClick="chatToUser('${user.userId}')">
      <div class="flex-shrink-0">
          <img class="img-fluid"
              src="https://mehedihtml.com/chatbox/assets/img/user.png"
              alt="user img">
              <span class="${user.status=='Online'?"active":""}"></span>
      </div>
      <div class="flex-grow-1 ms-3">
          <h3 class="userName">${user.userId}</h3>
          <p class="recentMsg">${user.status}</p>
      </div>
  </a>`;
    }
  }
  document.getElementById("OnlineChatList").innerHTML = userOnLineHtml;
  document.getElementById("OfflineChatList").innerHTML = userOfflineHtml;
}
function chatToUser(userName){
  $("#chatName").html(selectedUser);
  $("#modalContent, #chatbox").show();
  selectedUser= userName;
  $("#MessageBody").show();
  $("#chatName").html(selectedUser);
  // $("#sendMessage").attr("data-name", userName)
  console.log(userName);
  $("#UserMessage").html("");// clear prev msg
  $("#inputMsg").val('');// clear prev text

}
// document.getElementById("host").innerHTML = host;
// document.getElementById("userId").innerHTML = queryParams.userId;
function createTabsOfUsers(user) {
  const lis = [
    ...document.getElementById("messagesUsers").getElementsByTagName("li"),
  ];
  console.log(lis);
  lis.forEach((ele) => {
    ele.classList.remove("active");
  });
  const selectedEle = document.getElementById(`${user}_tab`);
  if (!selectedEle) {
    const html = `<li id="${user}_tab" class="active userTabs"><div class="userTabWrapper"><h2>${user}</h2></div></li>`;
    document.getElementById("messagesUsers").innerHTML += html;
  } else {
    selectedEle.classList.add("active");
   
  }
}
function bindMessage({ fromUser, toUser, message }) {
  $("#chatName").html(toUser);
  $("#MessageBody").show();
  const date = new Date();
  const time = date.getHours() + ":" + date.getMinutes(); // + ":" + date.getSeconds();
  const html = `<li class="repaly">
  <p> ${message}</p>
  <span class="time">${time}</span>
</li>`;
$("#UserMessage").append(html);
  // document.getElementById(`UserMessage`).appendChild = html;
}
