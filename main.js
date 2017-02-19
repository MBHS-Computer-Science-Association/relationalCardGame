var socket=io();

var pin = -2;

var games = [];

var me = {};

socket.on('pin', function(newPin){
	pin = newPin;
});

socket.on('update', function(gameID){
	if(gameID==me.gameID){
		getGame();
	}
});

function getGames(){
	socket.emit('getGames', function(newGames){
		games = newGames;
	});
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
	socket.emit('getGame', function(gameIDPar, newGames){
		games = newGames;
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
