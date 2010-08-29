// Global Namespace and shortcut Alias
var KNOCKOUT = NKO = {}

//= require "connection"

//= require "constants"

//= require "events"

//= require "user"

//= require "graphics"

KNOCKOUT.fighters = []

KNOCKOUT.create = function()
{
  KNOCKOUT.Connection.socket.on('message', function(data)
  {
    data = $.evalJSON(data)

    if(data.type == 'game.tick')
    {
      var graphics = KNOCKOUT.Renderer.graphics
      graphics.fillStyle = 'rgb(0,0,0)'
      graphics.fillRect(0,0,240,160)
      // Walk through the data.data<players> collection
      data.data.forEach(function(player)
      {
        graphics.fillStyle = player.color
        graphics.fillRect(player.x-5, player.y-5, 10, 10)
        graphics.fillText(player.name, player.x-5, player.y-15)
      })
      // Draw a circle for each player at their x and y and in their color
    }
  })
}

jQuery(function()
{
  KNOCKOUT.create();
})