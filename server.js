// Get the bundled libraries into scope:
require('./vendor');

// Require some modules
var express = require('express');

// definitions
var app     = express.createServer();

// Use a configure block to tell Express how to act, generally
app.configure(function(){
  // Dunno what these do
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
  app.use(app.router);
  app.use(express.logger());
  // Statically serve anything in /public
  app.use(express.staticProvider(__dirname + '/public'));
  // Be verbose about errors, will move this into a specific environment later
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Screw Jade for now, will figure it out later
/*app.register('.html', require('jade'));
app.set('view engine', 'jade');
*/

// Auto-redirect the root to the static index.html file
app.get('/', function(req, res){
  res.redirect('index.html');
});

// Listen on 3000
app.listen(80);
console.log('Server running at localhost on port 80')