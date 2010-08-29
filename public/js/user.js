$(document).ready(function() {
  updatePlayers();
  console.log('tacos')
});


function registerPrompt()
{ 
  var username = prompt("Please name your warrior/cat.");
  alert('hello ' + username);
  var msg = { type:'user.rename', data: username};
  
  KNOCKOUT.Connection.socket.send($.toJSON(msg))
}

function updatePlayers()
{
  var users = [
    {name:'tacos'},
    {name:'reef'},
    {name:'banjo'},
    {name:'medicine'}
  ];
  $.each(users, function(i, user)
  {
    $('#fighting').append('<li>'+user.name+'</li>')
  }) 
}

function updateWatchers(users)
{
  
}

