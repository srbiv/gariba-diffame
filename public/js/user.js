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
  var msg = { type:'user.rename', data: username};
  
  KNOCKOUT.Connection.socket.send($.toJSON(msg))
}

function updatePlayers(users)
{
  $('#fighting').empty();
  $.each(users, function(i, user)
  {
    $('#fighting').append('<li class="ui-state-default">'+user.name+'</li>')
  })
  $('#fighting-total').html(' ('+ $('#fighting li').length+ ')');
}

function updateWatchers(users)
{
  $('#watching').empty();
  $.each(users, function(i, user)
  {  
    $('#watching').append('<li class="ui-state-default">'+user.name+'</li>');
  })
  $('#watching-total').html(' ('+ $('#watching li').length+ ')');
}

