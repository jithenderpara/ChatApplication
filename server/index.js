var bodyParser = require('body-parser');
// var csrf = require('csurf');
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');
var path = require('path');

mongoose.connect('mongodb://localhost:27017/chatApplication');
const PORT = 3000;
var app = express();
var allUsers = [];
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('newUserEmiter', ({ userName, id }) => {
  console.log({ userName, id }, "new users")
    
    var foundIndex = allUsers.findIndex(item => userName == item.userName);
  console.log(foundIndex)
  console.log(allUsers)
    if (foundIndex>-1) {
      console.log("updated user")
      allUsers[foundIndex] = { userName, id, socket: client.id };
    } else{
      console.log("added user");
      allUsers.push({ userName, id, socket: client.id });
    }
    client.emit('allUserNamesEmiter', allUsers)
  })
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});


// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  cookieName: 'session',
  secret: 'keyboard cat',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
// app.use(csrf());
app.use('/static', express.static(path.join(__dirname, 'public')))

// routes
app.get("/", (req, res) => {
  const indexFile = path.resolve("./views/index.html");
  res.status(200).sendFile(indexFile);
})
app.get("/home", (req, res) => {
  const homeFile = path.resolve("./views/home.html");
  const user = req.session.user;
  res.status(200).sendFile(homeFile, { headers: JSON.stringify(user), lastModified: true, etag: false, user });
})
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
    designation
  };

  req.session.user = cleanUser;
  req.user = cleanUser;
  res.status(200).send({ userName, emailId });
})
app.get("/getUserInfo", (req, res) => {
  const { userName, emailId, designation } = req.session.user;
  res.status(200).send({ userName, emailId, designation });
})
/*****
 * 
 * 
 * end all post Methods
 */
server.listen(PORT, () => {
  console.log(`application is running on http://localhost:3000/`)
})