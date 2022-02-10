const express = require('express');
const GroupMessage = require('../models/GroupMessage');
const app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http);

app.get('/gm/:room', async (req, res) => {
    const roomName = req.params.room;
    const groupMessages = await GroupMessage.find({room:roomName}).select("from_user message");
  
    try{
      if(groupMessages.length != 0){
        res.send(groupMessages);
      }else{
        res.send(false);
      }
    }catch(err){
        res.status(500).send(err);
      }
})

app.post('/gm', async (req, res) => {
  var gm = new GroupMessage(req.body);
  gm.save((err) => {
    if(err){
      console.log(err);
    }
    res.sendStatus(200);
  })
});

// groupMessageModel.create(
//     {
//         "from_user":"pritamworld",
//         "room":"covid19",
//         "message":"What about covid10 vaccine?"
//     }
// )

module.exports = app;