/*
    http://www.JSON.org/json2.js
    2010-08-25

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:


            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/



if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];


        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }


        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':


            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':


            return String(value);


        case 'object':


            if (!value) {
                return 'null';
            }


            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === '[object Array]') {


                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }


                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }


            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {


                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }


            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }


    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {


            var i;
            gap = '';
            indent = '';


            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }


            } else if (typeof space === 'string') {
                indent = space;
            }


            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }


            return str('', {'': value});
        };
    }



    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {


            var j;

            function walk(holder, key) {


                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }



            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }



            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');


                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }


            throw new SyntaxError('JSON.parse');
        };
    }
}());
var express = require('express')
  , io      = require('socket.io');


var app     = express.createServer();

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
  app.use(app.router);
  app.use(express.logger());
  app.use(express.staticProvider(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var socket = io.listen(app);

var colliding = function(x1, y1, x2, y2)
{
  var xCollision = false
  var yCollision = false

  var xDiff = x1 - x2
  if(xDiff > -20 && xDiff < 20) { xCollision = true}
  var yDiff = y1 - y2
  if(yDiff > -20 && yDiff < 20) { yCollision = true}

  return xCollision && yCollision
}

var catnip = { x: 320, y: 240, showing: true }

var users = [];
users.clientMap = {}
users.destinationMap = {}
users.count = 0;

users.create = function(client)
{
  var newUser = { id: users.count, name: 'Cat Enthusiast', state: 'watching' }
  users.clientMap[''+client.sessionId] = newUser
  users.count += 1
  users.push( newUser )

  users.broadcast()

  return newUser
}

users.setDestinationFor = function(aUser, destX, destY)
{
  users.destinationMap[aUser.id] = { x: destX, y: destY }
}

users.setPlaying = function(player)
{
  player.x = Math.floor(Math.random()*640)
  player.y = Math.floor(Math.random()*480)
  player.speedX = 0
  player.speedY = 0
  player.cat = Math.ceil(Math.random()*2) // We have 2 cat images right now
  player.color = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')'
  player.state = 'playing'
  users.destinationMap[player.id] = { x: player.x, y: player.y }

  users.broadcast()
}

users.tick = function()
{
  var activePlayers = users.getPlayers()
  activePlayers.forEach(function(player)
  {
    player.x += player.speedX
    player.y += player.speedY

    var maxSpeed = player.jackedUp ? 15 : 10
    var destination = users.destinationMap[player.id]

    var directionX     = destination.x - player.x
    var distanceX      = Math.abs(directionX)
    var directionY     = destination.y - player.y
    var distanceY      = Math.abs(directionY)
    var totalDistance  = distanceX+distanceY

    if(totalDistance <= maxSpeed)
    {
      player.speedX = 0
      player.speedY = 0
      player.x = destination.x
      player.y = destination.y
    } else {
      player.speedX      = (maxSpeed*directionX)/totalDistance
      player.speedY      = (maxSpeed*directionY)/totalDistance
    }

    if(player.jackedUp)
    {
      var anyEaten = false
      activePlayers.forEach(function(targetCat)
      {
        if(targetCat == player) { return }
        if(colliding(player.x, player.y, targetCat.x, targetCat.y)) // Cat collision!
        {
          targetCat.state = 'watching'
          anyEaten = true
        }
      })

      anyEaten && users.broadcast()
    }
    else // Otherwise look for drugs
    {
      if(catnip.showing && colliding(player.x, player.y, catnip.x, catnip.y)) // If you collide with the catnip
      {
        player.jackedUp = true    // set your jackedUp flag
        catnip.showing  = false   // remove the drugs
        setTimeout(function()
        {
          player.jackedUp = false
          catnip.x = Math.floor(Math.random()*640)
          catnip.y = Math.floor(Math.random()*480)
          catnip.showing = true
        }, 10000) // Respawn the catnip randomly in 10 seconds
      }
    }



/*    if(player.x < 0)
    {
      player.speedX = Math.abs(player.speedX)
    }
    else if(player.x > 240)
    {
      player.speedX = -Math.abs(player.speedX)
    }

    if(player.y < 0)
    {
      player.speedY = Math.abs(player.speedY)
    }
    else if(player.y > 160)
    {
      player.speedY = -Math.abs(player.speedY)
    }
*/
  })
}

users.remove = function(userToRemove)
{
  for(var i=0;i<users.length;i++)
  {
    var user = users[i]
    if(user == userToRemove)
    {
      users.splice(i, 1)
      break
    }
  }

  users.broadcast()
}

users.broadcastable = function()
{
  return JSON.stringify({ type: 'watchers.update', data: users })
}

users.broadcast = function()
{
  var players = users.getPlayers();
  var playerPayload =
  { type: 'players.update'
  , data: players
  }
  socket.broadcast(JSON.stringify(playerPayload))

  var watchers = users.getWatchers();
  var watcherPayload =
  { type: 'watchers.update'
  , data: watchers
  }
  socket.broadcast(JSON.stringify(watcherPayload))
}

users.getPlayers = function()
{
  var players = []
  users.forEach(function(user)
  {
    if(user.state == 'playing')
    {
      players.push(user)
    }
  })

  return players
}

users.getWatchers = function()
{
  var watchers = []
  users.forEach(function(user)
  {
    if(user.state == 'watching')
    {
      watchers.push(user)
    }
  })

  return watchers
}

users.findByClient = function(client)
{
  return users.clientMap[''+client.sessionId]
}

socket.on('connection', function(client){
  var user = users.create(client);

  client.on('message', function(message)
  {
    var parsedMessage
    try
    {
      parsedMessage = JSON.parse(message)
    } catch(e) {
      console.log('JSON.parse failed on: ' + message)
    }

    if(parsedMessage.type == 'user.rename')
    {
      console.log("Renaming: "+user.name+" to "+parsedMessage.data)
      user.name = parsedMessage.data
      users.broadcast()
    }
    else if(parsedMessage.type == 'game.join')
    {
      console.log('game.join')
      users.setPlaying(user)
    }
    else if(parsedMessage.type == 'game.move_to')
    {
      console.log('game.move_to: '+parsedMessage.data.x+", "+parsedMessage.data.y)
      users.setDestinationFor(user, parsedMessage.data.x, parsedMessage.data.y)
    }
    else
    {
      console.log('unknown message received: '+message)
    }
  });
});

socket.on('clientDisconnect', function(client)
{
  var user = users.findByClient(client)
  if(user)
  {
    console.log('Removing User: '+user.name)
    users.remove(user)
  }
})

setInterval(function()
{
  users.tick()

  var playerData = users.getPlayers()
  catnip.showing && playerData.push( { x:     catnip.x
                                     , y:     catnip.y
                                     , name:  'Catnip'
                                     , color: 'rgb(255,0,0)'
                                     , cat:   3 })

  var payload =
  { type: 'game.tick'
  , data: playerData
  }

  socket.broadcast(JSON.stringify(payload))

}, 50)

app.get('/', function(req, res){
  res.redirect('index.html');
});

app.listen(80);
console.log('Server running at localhost on port 80')
