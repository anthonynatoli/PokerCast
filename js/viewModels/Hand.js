function Hand(deck, chipsPerPlayer, pot) {
	var self = this;
	self.deck = ko.observable(deck || []);
	self.chipsPerPlayer = chipsPerPlayer || 50;
	self.pot = ko.observable(pot || 0);
	self.round = ko.observable(0);
	self.cardsOnTable = ko.observableArray([]);
	self.currentPlayer = ko.observable();
	self.currentBet = 0;
	self.over = ko.computed(function() {
		return self.round() >= 4;
	});
	self.winner = ko.observable("Ben (duh!)");
	self.ante = ko.observable(0);
}