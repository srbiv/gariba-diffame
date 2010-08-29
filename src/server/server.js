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
users.destinationMap = {}
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

users.setDestinationFor = function(aUser, destX, destY)
{
  users.destinationMap[aUser.id] = { x: destX, y: destY }
}

users.setPlaying = function(player)
{
  // Initialize the users x,y coordinates
  player.x = Math.floor(Math.random()*640)
  player.y = Math.floor(Math.random()*480)
  player.speedX = 0
  player.speedY = 0
  player.cat = Math.ceil(Math.random()*2) // We have 2 cat images right now
  player.color = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')'
  // Set the user's state to playing
  player.state = 'playing'
  // Initialize the user's destination
  users.destinationMap[player.id] = { x: player.x, y: player.y }

  users.broadcast()
}

users.tick = function()
{
  var activePlayers = users.getPlayers()
  activePlayers.forEach(function(player)
  {
    player.x += player.speedX
    player.y += player.speedY

    var maxSpeed = 10
    var destination = users.destinationMap[player.id]

    // Adjust speed to be optimal towards destination
    var directionX     = destination.x - player.x
    var distanceX      = Math.abs(directionX)
    var directionY     = destination.y - player.y
    var distanceY      = Math.abs(directionY)
    var totalDistance  = distanceX+distanceY

    if(totalDistance <= 5)
    {
      player.speedX = 0
      player.speedY = 0
      player.x = destination.x
      player.y = destination.y
    } else {
      player.speedX      = (maxSpeed*directionX)/totalDistance
      player.speedY      = (maxSpeed*directionY)/totalDistance
    }

    // Scale speed to match distance to destination

/*    if(player.x < 0)
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
*/  })
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
    var parsedMessage
    try
    {
      parsedMessage = JSON.parse(message)
    } catch(e) {
      console.log('JSON.parse failed on: ' + message)
    }

    if(parsedMessage.type == 'user.rename')
    {
      console.log("Renaming: "+user.name+" to "+parsedMessage.data)
      user.name = parsedMessage.data
      users.broadcast()
    }
    else if(parsedMessage.type == 'game.join')
    {
      console.log('game.join')
      users.setPlaying(user)
    }
    else if(parsedMessage.type == 'game.move_to')
    {
      console.log('game.move_to: '+parsedMessage.data.x+", "+parsedMessage.data.y)
      users.setDestinationFor(user, parsedMessage.data.x, parsedMessage.data.y)
    }
    else
    {
      console.log('unknown message received: '+message)
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
  users.tick()

  var payload = 
  { type: 'game.tick'
  , data: users.getPlayers()
  }

  socket.broadcast(JSON.stringify(payload))

}, 50)

// Auto-redirect the root to the static index.html file
app.get('/', function(req, res){
  res.redirect('index.html');
});

// Listen on 3000
app.listen(80);
console.log('Server running at localhost on port 80')