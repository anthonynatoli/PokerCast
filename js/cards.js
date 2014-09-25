function Deck() {
	var self = this;
	self.cards = [

		{ 'value' : '2', 'suit' : 'clubs' },
		{ 'value' : '2', 'suit' : 'diamonds' },
		{ 'value' : '2', 'suit' : 'hearts' },
		{ 'value' : '2', 'suit' : 'spades'},

		{ 'value' : '3', 'suit' : 'clubs' },
		{ 'value' : '3', 'suit' : 'diamonds' },
		{ 'value' : '3', 'suit' : 'hearts' },
		{ 'value' : '3', 'suit' : 'spades'},

		{ 'value' : '4', 'suit' : 'clubs' },
		{ 'value' : '4', 'suit' : 'diamonds' },
		{ 'value' : '4', 'suit' : 'hearts' },
		{ 'value' : '4', 'suit' : 'spades'},

		{ 'value' : '5', 'suit' : 'clubs' },
		{ 'value' : '5', 'suit' : 'diamonds' },
		{ 'value' : '5', 'suit' : 'hearts' },
		{ 'value' : '5', 'suit' : 'spades'},

		{ 'value' : '6', 'suit' : 'clubs' },
		{ 'value' : '6', 'suit' : 'diamonds' },
		{ 'value' : '6', 'suit' : 'hearts' },
		{ 'value' : '6', 'suit' : 'spades'},

		{ 'value' : '7', 'suit' : 'clubs' },
		{ 'value' : '7', 'suit' : 'diamonds' },
		{ 'value' : '7', 'suit' : 'hearts' },
		{ 'value' : '7', 'suit' : 'spades'},

		{ 'value' : '8', 'suit' :'clubs' },
		{ 'value' : '8', 'suit' :'diamonds' },
		{ 'value' : '8', 'suit' :'hearts' },
		{ 'value' : '8', 'suit' :'spades'},

		{ 'value' : '9', 'suit' :'clubs' },
		{ 'value' : '9', 'suit' :'diamonds' },
		{ 'value' : '9', 'suit' :'hearts' },
		{ 'value' : '9', 'suit' :'spades'},

		{ 'value' : '10', 'suit' : 'clubs' },
		{ 'value' : '10', 'suit' : 'diamonds' },
		{ 'value' : '10', 'suit' : 'hearts' },
		{ 'value' : '10', 'suit' : 'spades'},

		{ 'value' : 'jack', 'suit' : 'clubs' },
		{ 'value' : 'jack', 'suit' : 'diamonds' },
		{ 'value' : 'jack', 'suit' : 'hearts' },
		{ 'value' : 'jack', 'suit' : 'spades'},

		{ 'value' : 'queen', 'suit' : 'clubs' },
		{ 'value' : 'queen', 'suit' : 'diamonds' },
		{ 'value' : 'queen', 'suit' : 'hearts' },
		{ 'value' : 'queen', 'suit' : 'spades'},

		{ 'value' : 'king', 'suit' : 'clubs' },
		{ 'value' : 'king', 'suit' : 'diamonds' },
		{ 'value' : 'king', 'suit' : 'hearts' },
		{ 'value' : 'king', 'suit' : 'spades'},

		{ 'value' : 'ace', 'suit' : 'clubs' },
		{ 'value' : 'ace', 'suit' : 'diamonds' },
		{ 'value' : 'ace', 'suit' : 'hearts' },
		{ 'value' : 'ace', 'suit' : 'spades'}

	];
	self.getCard = function() {
		return self.cards.splice(Math.floor(Math.random()*self.cards.length),1)[0];
	};
}