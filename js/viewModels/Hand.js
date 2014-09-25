function Hand(deck, chipsPerPlayer) {
	var self = this;
	self.deck = deck || [];
	self.chipsPerPlayer = chipsPerPlayer || 50;
	self.cardsOnTable = ko.observableArray([]);
	self.currentPlayer = ko.observable();
}