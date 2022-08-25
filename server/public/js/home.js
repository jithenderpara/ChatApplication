var userName = "";
const socket = io();
$(document).ready(function () {
  console.log("ready!");
  getUser();

  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  socket.on("allUserNamesEmiter", getAllUsers);

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });
});
function getAllUsers(users) {
  console.log(users);
  var htmlContent = "";
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    const html = `<a href="#" class="d-flex align-items-center">
        <div class="flex-shrink-0">
            <img class="img-fluid"
                src="https://mehedihtml.com/chatbox/assets/img/user.png"
                alt="user img">
            <span class="active"></span>
        </div>
        <div class="flex-grow-1 ms-3">
            <h3>${element.userName}</h3>
            <p>${element.designation?element.designation:'Other'}</p>
        </div>
    </a>`;
    htmlContent += html;
  }
  $("#chatList").html(htmlContent);
}
function getUser() {
  $.ajax({
    type: "GET",
    url: "/getUserInfo",
    data: {},
    dataType: "text",
    success: function (resultData) {
      if (resultData) {
        console.log(resultData);
        const name = JSON.parse(resultData);
        socket.emit("newUserEmiter", {
          userName: name.userName,
          id: socket.id,
          designation: name.designation
        });
      }
    },
  });
}
