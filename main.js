var socket=io();

var pin = -2;

var games = [];
var game;
var me = {};

socket.on('pin', function(newPin){
	pin = newPin;
});

socket.on('showCards', function(gameID){
	if(gameID==me.gameID){
		revealcards();
	}
});

socket.on('update', function(gameID){
	if(gameID==me.gameID){
		socket.emit('getGame', function(gameIDPar, newGame){
			game = newGame;
			round();
		});
	}
});

function getGames(){
	socket.emit('getGames', function(newGames){
		games = newGames;
	});
}

function createGame(){
	socket.emit('createGame',0);
}

function joinGame(gameID){
	socket.emit('joinGame', gameID);
}

function getSelf(){
	socket.emit('getSelf', function(newMe){
		me = newMe;
	});
}

function getGame(){
	var gameIDPar = me.gameID;
	socket.emit('getGame', function(gameIDPar, newGame){
		game = newGame;
	});
}


function submitCards(cardIndexArray){
	socket.emit('submitCards', cardIndexArray);
}

function kaiserPick(index){
	socket.emit('kaiserPick', index);
}

function setBet(betArray){
	socket.emit('setBet', betArray);
}
