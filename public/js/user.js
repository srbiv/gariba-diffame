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
  })
});

var username
function registerPrompt()
{ 
  if(!username)
  {
    username = prompt("Please name your warrior/cat.");
    var msg = { type:'user.rename', data: username};
    KNOCKOUT.Connection.socket.send($.toJSON(msg))
    _gaq.push(['_trackPageview', '/addName']);
  } 

  KNOCKOUT.Connection.socket.send($.toJSON({ type: 'game.join' }))
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

