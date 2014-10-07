function Player(id, name) {
	var self = this;
	self.type = "Player";
	self.id = id;
	self.name = name || "";
	self.bet = ko.observable(0);
	self.betRound = ko.observable(0);
	self.chips = ko.observable(0);
	self.hadTurn = false;
	self.cards = [];
	self.action = ko.observable("Waiting");
	self.isTurn = ko.computed(function() {
		return game.hand() && game.hand().currentPlayer() && game.hand().currentPlayer().id === self.id;
	});
}