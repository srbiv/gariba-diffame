# NodeBoard

A Node gameboard. Kill your friends! Or just watch.

by [Stafford Brooke](http://github.com/srbiv)
and [Loren Norman](http://github.com/lorennorman)

# Developer Installation

## Dependencies

Right now the system requires a developer to do a few things manually to develop on it.

### NPM & Packages

Install npm

Then install the required packages like this:

    npm install [package name]

...where [package name] is each of these:
* express
* jade (currently not in use)

I think we can do away with this by using a package.json file?

### Sprockets

If you intend to alter the client-side javascript code, you'll need [Sprockets](http://getsprockets.org).

Sprockets is a command-line Javascript concatenation tool written in Ruby. Make sure you can run:

    sprocketize -v

...from the command line and you know you've installed it correctly.

We should probably start using Jake for all of our pre-processing tasks, but this works for now.

## Building

Once your dependencies are in order, you build the client-side project with:

    script/build

This outputs knockout.js into public/, ready to be included by the main template file.

## Running the Tests

You are writing tests, aren't you?

* Client Tests: /ClientSpec.html
* Server Tests: /ServerSpec.html

And add your new specs to spec/client and spec/server as need. You'll also need to add more Javascript include statements to the above .html files for each new spec file you add.

## Running the Server

Ready to actually run the thing? Easy:

    node server.js

## Using the app

Hit [your local server](http://localhost:3000/index.html) and interact with the app.







