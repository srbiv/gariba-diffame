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

users.broadcast = function(message)
{
  var payload = message || JSON.stringify({ type: 'watchers.update', data: users })

  socket.clients.forEach(function(client)
  {
    client && client.send(payload)
  })
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
      users.broadcast(message)
    }

    if(message.type == 'user.rename')
    {
      console.log("Renaming: "+user.name+" to "+message.data)
      user.name = message.data
      users.broadcast()
    }
  });
});

socket.on('clientDisconnect', function(client)
{
  console.log('removing user for client '+client.sessionId)
  var user = users.findByClient(client)
  if(user)
  {
    console.log('user found, removing '+user.name)
    users.remove(user)
  }
})

// Auto-redirect the root to the static index.html file
app.get('/', function(req, res){
  res.redirect('index.html');
});

// Listen on 3000
app.listen(80);
console.log('Server running at localhost on port 80')