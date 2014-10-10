function Game() {
	var self = this;
	self.activePlayers = ko.observableArray([]);
	self.shownPlayers = ko.computed(function() {
		if(self.activePlayers().length < 6 || !self.hand() || !self.hand().currentPlayer()) {
			return self.activePlayers();
		}
		// display 5 players closest to current player
		var currentPlayerIndex = self.activePlayers().indexOf(self.hand().currentPlayer());
		return [
			self.activePlayers()[(currentPlayerIndex - 2 + self.activePlayers().length) % self.activePlayers().length],
			self.activePlayers()[(currentPlayerIndex - 1 + self.activePlayers().length) % self.activePlayers().length],
			self.hand().currentPlayer(),
			self.activePlayers()[(currentPlayerIndex + 1) % self.activePlayers().length],
			self.activePlayers()[(currentPlayerIndex + 2) % self.activePlayers().length]
		];
	});
	self.inactivePlayers = ko.observableArray([]);
	self.hand = ko.observable();
}