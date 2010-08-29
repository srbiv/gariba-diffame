function registerPrompt()
{ 
  var username = prompt("Please name your warrior/cat.","");
  KNOCKOUT.Connection.socket = send({ type:'set name', data: username})
}

function updatePlayers(users)
{
  
}

function updateWatchers(users)
{
  
}

