var userName = "";
const socket = io();
$(document).ready(function () {
  console.log("ready!");
  getUser();

  // client-side
  socket.on("connect", () => {
   // USER IS ONLINE
   socket.on("online", (userId) => {
    console.log(userId, "Is Online!"); // update online status
});
socket.on("online", getAllUsers);
  socket.on("allUserNamesEmiter", getAllUsers);
  socket.on("offline", (id)=>{
    console.log('offline', id)
  });


   
  });
  

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
            <img class="img-fluid userImgIcon"
                src="https://i.pravatar.cc/150?u=fake@${element.userName}"
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
        // socket.emit("login", {
        //   userName: name.userName,
        //   id: socket.id,
        //   designation: name.designation
        // });
        
      }
    },
  });
}
