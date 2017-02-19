var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");

var port = 80;

var nextUserPin = 0;
var nextGamePin = 1;
var maxCards = 10;

var users = [];
/**
	pin
	score
	isKaiser
	gameID
	bets
	cards
**/

var games = [];
/**
	pin
	users
	cards (text / pin)
	winningCard
	cardSetIndex
	currentCardLength
	question
	kaiserPickIndex
**/

app.get(/^(.+)$/, function(req, res){
  res.sendFile(__dirname + '' + req.params[0]);
});

io.on('connection', function(socket){
  var pin = nextUserPin;
  nextUserPin = nextUserPin + 2;
  socket.emit('pin', pin);
  var newUser = {};
  newUser.pin = pin;
  newUser.score = 5;
  newUser.isKaiser = false;
  newUser.gameID = 1;
  newUser.bets = [];
  newUser.cards = [];
  users.push(newUser);


  socket.on('createGame', function(cardSetIndex, callback){
  	var newGame = {};
  	newGame.pin = nextGamePin;
  	nextGamePin = nextGamePin + 2;
  	newGame.cardSetIndex = cardSetIndex;
  	newGame.users = [];
  	newGame.cards = [];
  	games.push(newGame);
  	getUserByID(pin).isKaiser = true;
  	newGame.users.push(getUserByID(pin));
  	callback(newGame.pin);
  });

  socket.on('getGames', function(callback){
  	callback(games);
  });

  socket.on('joinGame', function(gameID, callback){
  	getGameByID(gameID).users.push(getUserByID(pin));
  	getUserByID(pin).gameID = gameID;
  	refreshCards(gameID);
  	callback();
  });

  socket.on('getSelf', function(callback){
  	callback(getUserByID(pin));
  });

  socket.on('getGame', function(callback){
  	callback(getGameByID(getUserByID(pin).gameID));
  });

  socket.on('submitCards', function(cardIndexArray){
  	var game = getGameByID(getUserByID(pin).gameID);
  	if(cardIndexArray.length == game.currentCardLength){
  		out:
	  	for(var i = game.cards.length-1; i>=0; i--){
	  		for(var k = 0; k<cardIndexArray.length; k++){
	  			if(cardIndexArray[k] == i){
	  				var ans = getUserbyID(pin).cards[i];
	  				game.cards.push(ans);
	  				if(game.cards.length==game.users.length-1){
	  					io.push('showCards', game.pin);
	  				}
	  				getUserByID(pin).cards.splice(i,1); // Yes this is idiotic and inefficiant, but you are a failure at life. 
	  				break out;
	  			}
	  		}
	  	}	
  	}	
  });	

  socket.on('setBet', function(betArray){
  	getUserByID(pin).bets = betArray;
  });

  socket.on('kaiserPick', function(cardIndex){
  	getGameByID(getUserByID(pin).gameID).winningCardIndex = cardIndex;
  	evaluateGame(getUserByID(pin).gameID);
  	io.emit('update', gameID);
  });


});

function getUserByID(pin){
	for(var i = 0; i<users.length; i++){
		if(users[i].pin == pin){
			return users[i];
		}
	}
}

function evaluateGame(gameID){
	var game = getGameByID(gameID);
	var totalPot = 0;
	var totalWinPot = 0;
	for(var i = 0; i<game.users.length; i++){
		var user = game.users[i];
		for(var k = 0; k < user.bets.length; k++){
			var amnt = user.bets[k];
			user.score = user.score - amnt;
			totalPot = totalPot + amnt;
			if(k == game.kaiserPick){
				totalWinPot = totalWinPot + amnt;
			}
		}
	}
	for(var i = 0; i<game.users.length; i++){
		var user = game.users[i];
		for(var k = 0; k < user.bets.length; k++){
			var amnt = user.bets[k];
			user.bets[k] = 0;
			if(k == game.kaiserPick){
				user.score = user.score + ((amnt+0.0)/totalWinPott) * totalPot;
			}
		}
	}
	refreshCards(gameID);
	var data = fs.readFileSync("data/0a.txt", "utf8");
	var dataArr = data.split("\n");
	var dataPoint = dataArr[Math.floor(Math.random()*dataArr.length)];
	game.question = dataPoint;
}

function refreshCards(gameID){
	var game = getGameByID(gameID);
	for(var i = 0; i<game.users.length; i++){
		var user = game.users[i];
		while(user.cards.length<maxCards){
			var data = fs.readFileSync("data/0a.txt", "utf8");
			var dataArr = data.split("\n");
			var dataPoint = dataArr[Math.floor(Math.random()*dataArr.length)];
			user.cards.push(dataPoint);
		}
	}
}

function getGameByID(pin){
	for(var i = 0; i<games.length; i++){
		if(games[i].pin == pin){
			return games[i];
		}
	}
}

http.listen(port, function(){
  console.log('listening on *:'+port);
});


