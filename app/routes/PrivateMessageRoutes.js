const express = require('express');
const PrivateMessage = require('../models/PrivateMessage');
const app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http);

app.get('/pm/:room/:user', async (req, res) => {
    const roomName = req.params.room;
    const user = req.params.user;
    const privateMessages = await PrivateMessage.find({to_user:roomName, from_user:user}).select("from_user message");
  
    try{
      if(privateMessages.length != 0){
        res.send(privateMessages);
      }else{
        res.send(false);
      }
    }catch(err){
        res.status(500).send(err);
      }
})

app.get('/pm/:room', async (req, res) => {
    const roomName = req.params.room;
    const privateMessages = await PrivateMessage.find({to_user:roomName}).select("from_user message");
  
    try{
      if(privateMessages.length != 0){
        res.send(privateMessages);
      }else{
        res.send(false);
      }
    }catch(err){
        res.status(500).send(err);
      }
})

app.post('/pm', async (req, res) => {
  var pm = new PrivateMessage(req.body);
  pm.save((err) => {
    if(err){
      console.log(err);
    }
    res.sendStatus(200);
  })
});

// privateMessageModel.create(
//     {
//         "from_user":"pritamworld",
//         "to_user":"moxdroid",
//         "message":"What about covid19 vaccine?"
//     }
// );

module.exports = app;