function Hand(deck, chipsPerPlayer, pot) {
	var self = this;
	self.deck = deck || [];
	self.chipsPerPlayer = chipsPerPlayer || 50;
	self.pot = pot || 0;
	self.cardsOnTable = ko.observableArray([]);

}