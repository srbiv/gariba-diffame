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
  var catImages = []
  var catImage1 = new Image()
  catImage1.src = 'img/cat1.png'
  catImages[1] = catImage1
  var catImage2 = new Image()
  catImage2.src = 'img/cat2.png'
  catImages[2] = catImage2

  KNOCKOUT.Connection.socket.on('message', function(data)
  {
    data = $.evalJSON(data)

    if(data.type == 'game.tick')
    {
      var graphics = KNOCKOUT.Renderer.graphics
      graphics.fillStyle = 'rgb(0,0,0)'
      graphics.fillRect(0,0,640, 480)
      // Walk through the data.data<players> collection
      data.data.forEach(function(player)
      {
        // Draw a cat and the user's name
        graphics.drawImage(catImages[player.cat], player.x - 16, player.y - 16)
        graphics.fillStyle = player.color
        graphics.fillText(player.name, player.x-16, player.y-23)
      })
    }
  })

  // Allow users to click to move
  $('#board').click(function(mouseClick)
  {
    var x = mouseClick.offsetX
    var y = mouseClick.offsetY
    
    var payload =
    { type: 'game.move_to'
    , data:
      { x: x
      , y: y
    } }

    console.log("Sending click info: "+x+","+y)
    KNOCKOUT.Connection.socket.send($.toJSON(payload))
  })
}

jQuery(function()
{
  KNOCKOUT.create();
})