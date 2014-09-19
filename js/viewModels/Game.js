function Game() {
	var self = this;
	self.activePlayers = ko.observableArray([]);
	self.inactivePlayers = ko.observableArray([]);
	self.hand = null;
}