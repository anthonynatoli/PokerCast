function Game() {
	var self = this;
	self.players = ko.observableArray([]);
	self.hand = null;
}