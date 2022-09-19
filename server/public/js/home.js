
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
  $("#UserMessage").html("");
  $("#inputMsg").val('');

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
