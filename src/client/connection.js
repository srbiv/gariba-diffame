var socket = new io.Socket(location.host);
socket.connect();
socket.send('some data');
socket.on('message', function(data){
  console.log('got some data' + data);
});