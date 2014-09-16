function Player(id, name, chips) {
	var self = this;
	self.id = id;
	self.name = name || "";
	self.chips = chips || 50;
}