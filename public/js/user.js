function registerPrompt()
{ 
  var username = prompt("Please name your warrior/cat.");
  alert('hello ' + username);
  var msg = { type:'user.rename', data: username};
  
  KNOCKOUT.Connection.socket.send($.toJSON(msg))
}

function updatePlayers(users)
{
  
}

function updateWatchers(users)
{
  
}

