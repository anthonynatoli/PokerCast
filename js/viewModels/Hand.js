function Hand(deck, chipsPerPlayer, pot) {
	var self = this;
	self.deck = ko.observable(deck || []);
	self.chipsPerPlayer = chipsPerPlayer || 50;
	self.pot = ko.observable(pot || 0);
	self.round = 1;
	self.cardsOnTable = ko.observableArray([]);
	self.currentPlayer = ko.observable();
}