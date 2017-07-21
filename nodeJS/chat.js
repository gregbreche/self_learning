var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){

	res.sendFile( 'C:/wamp/www/test/chat.html');

});

// ------- Gestion du namespace nsp
var nsp = io.of( '/nsp' );

nsp.on( 'connection' , function( socket ) {

	// ------- Message de connexion
	nsp.emit( 'connection message' , 'A user just connected to nsp !' );

	// ------- A la réception d'un message on l'envoi à tout le monde
	socket.on('chat message', function( msg , nickname ){

    	nsp.emit('chat message', nickname + ' : ' + msg);
    	//socket.broadcast.emit( 'chat message' , nickname + ' : ' + msg );

  	});

	// ------- Message de déconnexion
	socket.on( 'disconnect' , function() {

		nsp.emit( 'chat message' , ' A user just disconnected =(' );

	});

});

// -------- Gestion de la socket mère
io.on( 'connection' , function( socket ) {

	io.emit( 'chat message' , 'A user just connected !');

	socket.on('chat message', function(msg){

    	io.emit('chat message', msg);

  	});

	socket.on( 'disconnect' , function() {

		io.emit( 'chat message' , 'A user just disconnected =(' );

	});

});

http.listen(3000, function(){

	console.log('listening on *:3000');

});