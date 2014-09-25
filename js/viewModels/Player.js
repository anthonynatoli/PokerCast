function Player(id, name) {
	var self = this;
	self.type = "Player";
	self.id = id;
	self.name = name || "";
	self.chips = ko.observable(0);
	self.cards = [];
	self.isTurn = ko.computed(function() {
		return game.hand() && game.hand().currentPlayer() && game.hand().currentPlayer().id === self.id;
	});
}