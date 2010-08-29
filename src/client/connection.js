//= require <socket.io>

// What URL do we connect the socket to?
io.setPath('/')

// Tell Socket.io where our Flash proxy is
WEB_SOCKET_SWF_LOCATION = 'WebSocketMain.swf'

// Namespace this project's connecty-networky bits
KNOCKOUT.Connection = {}

KNOCKOUT.Connection.socket = new io.Socket(location.hostname);
KNOCKOUT.Connection.socket.connect();

KNOCKOUT.Connection.socket.on('message', function(data)
{
  if(data == "user.joined")
  {
    console.log('A new user joined.')
  } else {
    console.log("From server: "+data)
  }
  
  // data.type == "watchers.update"
  // data.type == "players.update"
})

// Send a message to the server
// KNOCKOUT.Connection.socket.send('some data');
// Listen to a message from the server
// KNOCKOUT.Connection.socket.on('message', function(data){
//   console.log('Data from the server: ' + data);
// });