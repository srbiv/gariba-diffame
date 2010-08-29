function registerPrompt()
{ 
  var username = prompt("Please name your warrior/cat.");
  alert('hello ' + username);
  KNOCKOUT.Connection.socket.send({ type:'user.rename', data: username})
}

function updatePlayers(users)
{
  
}

function updateWatchers(users)
{
  
}

