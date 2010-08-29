KNOCKOUT.Renderer = {}

jQuery(function()
{
  var canvas = document.getElementById('board')
  // Extract the default 2D graphics context
  KNOCKOUT.Renderer.graphics = canvas.getContext("2d")
})