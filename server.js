var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const userRouter = require('./routes/UserRoutes.js');
const groupMessageRouter = require('./routes/GroupMessageRoutes.js');
const privateMessageRouter = require('./routes/PrivateMessageRoutes.js');

var app = express();
var http = require('http').Server(app);
var cors = require('cors');
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(userRouter);
app.use(groupMessageRouter);
app.use(privateMessageRouter);
app.use(cors());

io.on('connection', (socket) => {
    
    console.log(`A NEW user is connected: ${socket.id}`)

    //check sign up information and send validation
    socket.on("signUp", (data) => {
        if(data.users == true){
            socket.emit("signUpValid", false);
        }else{
            socket.emit("signUpValid", true);
        }
    })

    //check login information and send validation
    socket.on("logIn", (data) => {
        if(data.users == false){
            socket.emit("logInValid", false);
        }else{
            data.users.forEach((user) => {
                if((data.username == user.username) && (data.password == user.password)){
                    socket.emit("logInValid", {username: data.username});
                }
            })
        }
    })

    //check sign up information and send validation
    socket.on("checkUser", (data) => {
        if(data.users == true){
            socket.emit("checkUserValid", data.username);
        }else{
            socket.emit("checkUserValid", false);
        }
    })
    
    //join room
    socket.on('joinRoom', (data) => {
        if(socket.currentRoom != null){
            socket.leave(socket.currentRoom);
        }
        socket.currentRoom = data.room;
        socket.join(data.room);
        console.log(socket.rooms);
    })

    socket.on("room_message", (data) => {
        var msg = {
            message:data.message,
            from_user:data.from_user
        }
        socket.broadcast.to(data.room).emit('newMessage', msg);
    })

    socket.on("userTyping", (data) => {
        socket.broadcast.to(data.room).emit('showChatUI', data.username);
    })

    socket.on('leaveRoom', () =>{
        socket.leave(socket.currentRoom);
        socket.currentRoom = null;
        console.log(socket.rooms);
    })

    socket.on("logOut", () => {
        socket.disconnect();
        console.log("Socket disconnected");
    })

})

mongoose.connect('mongodb+srv://rhosegueta:Stinkle0375@cluster0.euo3i.mongodb.net/101282411_lab_test1_chat_app?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, (err) => {
      if(err){
          console.log('Error connecting: ', err);
      }else{
          console.log('MongoDB successfully connected');
      }
});

var server = http.listen(8081, () =>{
    console.log('Server is running on port', server.address().port);
});