// Require some modules
//= require <json2>
var express = require('express')
  , io      = require('socket.io');


// definitions
var app     = express.createServer();

// Use a configure block to tell Express how to act, generally
app.configure(function(){
  // Dunno what these do
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
  app.use(app.router);
  app.use(express.logger());
  // Statically serve anything in /public
  app.use(express.staticProvider(__dirname + '/public'));
  // Be verbose about errors, will move this into a specific environment later
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var socket = io.listen(app);

var users = [];
users.clientMap = {}
users.count = 0;

users.create = function(client)
{
  var newUser = { id: users.count, name: 'anonymous', state: 'watching' }
  users.clientMap[''+client.sessionId] = newUser
  users.count += 1
  users.push( newUser )

  users.broadcast()

  return newUser
}

users.remove = function(userToRemove)
{
  for(var i=0;i<users.length;i++)
  {
    var user = users[i]
    if(user == userToRemove)
    {
      users.splice(i, 1)
      break
    }
  }

  users.broadcast()
}

users.broadcastable = function()
{
  return JSON.stringify({ type: 'watchers.update', data: users })
}

users.broadcast = function()
{
  // Broadcast the players
  var players = users.getPlayers();
  var playerPayload = 
  { type: 'players.update'
  , data: players
  }
  socket.broadcast(JSON.stringify(playerPayload))

  // Broadcast the watchers
  var watchers = users.getWatchers();
  var watcherPayload = 
  { type: 'watchers.update'
  , data: watchers
  }
  socket.broadcast(JSON.stringify(watcherPayload))
}

users.getPlayers = function()
{
  var players = []
  users.forEach(function(user)
  {
    if(user.state == 'playing')
    {
      players.push(user)
    }
  })

  return players
}

users.getWatchers = function()
{
  var watchers = []
  users.forEach(function(user)
  {
    if(user.state == 'watching')
    {
      watchers.push(user)
    }
  })

  return watchers
}

users.findByClient = function(client)
{
  return users.clientMap[''+client.sessionId]
}

socket.on('connection', function(client){
  // Create a new user for this client
  var user = users.create(client);

  client.on('message', function(message)
  {
    console.log('received message: '+message)
    try
    {
      message = JSON.parse(message)
    } catch(e) {
      console.log('JSON.parse failed on: ' + message)
    }

    if(message.type == 'user.rename')
    {
      console.log("Renaming: "+user.name+" to "+message.data)
      user.name = message.data
      users.broadcast()
    }
    else if(message.type == 'game.join')
    {
      console.log('game.join')
      // Initialize the users x,y coordinates
      user.x = Math.floor(Math.random()*240)
      user.speedX = Math.random()*5 - 2.5
      user.speedY = Math.random()*5 - 2.5
      user.y = Math.floor(Math.random()*160)
      user.color = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')'
      // Set the user's state to playing
      user.state = 'playing'

      users.broadcast()
    }
  });
});

socket.on('clientDisconnect', function(client)
{
  var user = users.findByClient(client)
  if(user)
  {
    console.log('Removing User: '+user.name)
    users.remove(user)
  }
})

setInterval(function()
{
  var activePlayers = users.getPlayers()
  activePlayers.forEach(function(player)
  {
    player.x += player.speedX
    player.y += player.speedY

    if(player.x < 0)
    {
      player.speedX = Math.abs(player.speedX)
    }
    else if(player.x > 240)
    {
      player.speedX = -Math.abs(player.speedX)
    }

    if(player.y < 0)
    {
      player.speedY = Math.abs(player.speedY)
    }
    else if(player.y > 160)
    {
      player.speedY = -Math.abs(player.speedY)
    }
  })
  

  var payload = 
  { type: 'game.tick'
  , data: activePlayers
  }

  socket.broadcast(JSON.stringify(payload))

}, 100)

// Auto-redirect the root to the static index.html file
app.get('/', function(req, res){
  res.redirect('index.html');
});

// Listen on 3000
app.listen(80);
console.log('Server running at localhost on port 80')