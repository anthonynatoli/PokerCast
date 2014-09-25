function Player(id, name) {
	var self = this;
	self.type = "Player";
	self.id = id;
	self.name = name || "";
	self.chips = 0;
	self.bet = 0;
	self.hadTurn = false;
	self.cards = [];
}