const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/user', (req, res) => {
  User.find({},(err, users)=> {
    res.send(users);
  })
})

app.get('/user/:username', async (req, res) => {
  const username = req.params.username;
  const users = await User.find({username:username});

  try{
    if(users.length != 0){
      res.send(true);
    }else{
      res.send(false);
    }
  }catch(err){
    res.status(500).send(err);
  }
})

app.get('/user/login/:username', async (req, res) => {
  const uname = req.params.username;
  const users = await User.find({username:uname}).select("username password");

  try{
    if(users.length != 0){
      res.send(users);
    }else{
      res.send(false);
    }
  }catch(err){
      res.status(500).send(err);
    }
})

app.post('/user', async (req, res) => {
  var user = new User(req.body);
  user.save((err) => {
    if(err){
      console.log(err);
    }
    res.sendStatus(200);
  })
});


// userModel.create(
//     {
//         "username":"pritamworld",
//         "firstname":"pritesh",
//         "lastname":"patel",
//         "password":"What about covid19 vaccine?"
//     }
// );

module.exports = app;