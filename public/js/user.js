$(document).ready(function()
{
  KNOCKOUT.Connection.socket.on('message', function(data)
  {
    data = $.evalJSON(data);
    
    if(data.type == 'watchers.update')
    {
      updateWatchers(data.data)
    }
    else if(data.type == 'players.update')
    {
      updatePlayers(data.data);
    }
    else{
      console.log(data)
    }
  })
});


function registerPrompt()
{ 
  var username = prompt("Please name your warrior/cat.");
  alert('hello ' + username);
  var msg = { type:'user.rename', data: username};
  
  KNOCKOUT.Connection.socket.send($.toJSON(msg))
}

function updatePlayers(users)
{
  $.each(users, function(i, user)
  {
    $('#fighting').append('<li class="ui-state-default">'+user.name+'</li>')
  }) 
}

function updateWatchers(users)
{
  $.each(users, function(i, user)
  {
    $('#watching').append('<li class="ui-state-default">'+user.name+'</li>')
  })
}

