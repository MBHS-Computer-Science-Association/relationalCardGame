var socket=io();

var pin = -2;

var games = [];

var users = [];

var me = {};

socket.on('pin', function(newPin){
	pin = newPin;
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

function getUser(){
	socket.emit('getUsers', function(me.gameID, newUsers){
		users = newUsers;
	});
}

function submitCards(cardIndex){
	socket.emit('submitCards', cardIndexArray);
}

function kaiserPick(index){
	socket.emit('kaiserPick', index);
}

function setBet(betArray){
	socket.emit('setBet', betArray);
}