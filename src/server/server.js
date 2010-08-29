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

socket.on('connection', function(client){
  client.broadcast('user.joined')

  client.on('message', function(message)
  {
    //var message = '';
    if(message.type == 'user.rename')
    {
      console.log('Setting name to:'+message.data)
      client.broadcast('A name has been changed to: '+message.data)
    } else {
      client.broadcast(message)
      console.log('Someone says '+message)
    }
  });

  setTimeout(function()
  {
    var users =
    [ { name: 'Stafford' }
    , { name: 'Lern' }
    , { name: 'Joyent' }
    , { name: 'Kitty' }
    , { name: 'Cat Killah' }
    , { name: '9 Lives' }
    ]

    var payload = 
    { type: 'watchers.update'
    , data: users
    }

    client.send(JSON.stringify(payload))
  },2000);

  setTimeout(function()
  {
    var activeUsers =
    [ { name: 'Banjo' }
    , { name: 'Special Pants' }
    , { name: 'Macaully' }
    ]

    var payload = 
    { type: 'players.update'
    , data: activeUsers
    }

    client.send(JSON.stringify(payload))
  },2000);
});

// Auto-redirect the root to the static index.html file
app.get('/', function(req, res){
  res.redirect('index.html');
});

// Listen on 3000
app.listen(80);
console.log('Server running at localhost on port 80')