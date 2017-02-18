var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 80;

var nextUserPin = 0;
var nextGamePin = 1;

var users = [];
/**
	pin
	score
	gameID
	cards
**/

var games = [];
/**
	pin
	users
	cardSetIndex
	currentCardLength
	question
**/

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var pin = nextUserPin;
  nextUserePin = nextUserPin + 2;
  socket.emit('pin', pin);

  socket.on('createGame', function(cardSetIndex){
  	var newGame = {};
  	newGame.pin = nextGamePin;
  	nextGamePin = nextGamePin + 2;
  	newGame.cardSetIndex = cardSEtIndex;
  	newGame.users = [];
  	newGame.users.push(getUserBYID(pin));
  });

  socket.on('getGames', function(callback){
  	callback(games);
  });

  socket.on('joinGame', function(gameID){
  	getGroupByID(gameID).users.push(getUserBYID(pin));
  });

  socket.on('getSelf', function(callback){
  	callback(getUsersByID(pin));
  });

  socket.on('getUsers', function(groupID, callback)){
  	callback(getGroupByID(groupID).users);
  }

  socket.on('submitCards', function(cardIndexArray){
  	if(cardIndexArray.length == getGroupByID(getUserByID(pin)).currentCardLength){
  		out:
	  	for(int i = getUsersByID(pin).cards.length-1; i>=0; i--){
	  		for(int k = 0; k<cardIndexArray.length; k++){
	  			if(cardIndexArray[k] == i){
	  				getUserByID(pin).cards.splice(i,1); // Yes this is idiotic and inefficiant, but you are a failure at life. 
	  				break out;
	  			}
	  		}
	  	}
  	}
  });

  socket.on('kaiserPick', function(index){

  });



});

function getUserByID(){

}

function getGroupByID(){

}

http.listen(port, function(){
  console.log('listening on *:'+port);
});
