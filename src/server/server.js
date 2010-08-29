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
users.count = 0;

users.create = function(client)
{
  var newUser = { id: users.count, name: 'anonymous', state: 'watching' }
  users.count += 1
  users.push( newUser )

  return newUser
}

users.broadcast = function(client)
{
  var payload = 
  { type: 'watchers.update'
  , data: users
  }

  client.send(JSON.stringify(payload))
}

/*users.findByClient = function(client)
{
  var userInQuestion;
  users.forEach(function(item)
  {
    if(item.client == client)
    {
      userInQuestion = item
    }
  })

  return userInQuestion
}*/

socket.on('connection', function(client){
  //client.broadcast('user.joined')

  // Create a new user for this client
  var user = users.create(client);
  // Alert everyone after a moment so this client hears it too
  setTimeout(function() { users.broadcast(client); }, 1000)

  client.on('message', function(message)
  {
    message = JSON.parse(message)

    if(message.type == 'user.rename')
    {
      user.name = message.data
      users.broadcast(client)
    }
  });
});

/*socket.on('disconnection', function(client)
{
  var user = users.findByClient(client)
  if(user)
  {
    users.splice(user.id, 1)
    users.broadcast(client)
  }
})*/

// Auto-redirect the root to the static index.html file
app.get('/', function(req, res){
  res.redirect('index.html');
});

// Listen on 3000
app.listen(80);
console.log('Server running at localhost on port 80')