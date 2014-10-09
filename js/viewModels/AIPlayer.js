function AIPlayer(id, chips) {
	Player.apply(this, ['aiPlayer'+id, names.splice(Math.floor(Math.random()*names.length),1)[0]])
	var self = this;
	var savedChips = chips;
	self.handEval = -1;
	self.newRound = true;
	var raised = false;
	self.type = "AIPlayer";
	self.makeBet = function(bet) {
		console.log(self.handEval);
		if (self.newRound){
			self.newRound = false;
			return self.handEval;
		}
		else {
			return bet;
		}
		if ( bet == 0 && self.handEval < 6 ){
			return 0;
		}
		if ( self.handEval < 3 ){
			return -1;
		}
		if ( self.handEval < 6 && bet < savedChips/4 ){
			return bet;
		}
		if ( self.handEval < 6 && bet > savedChips/4 ){
			return -1;
		}
		if ( self.handEval < 9 && bet < savedChips/2 ){
			if (raised == false){
				raised = true;
				console.log("Raised On: " + bet);
				return bet + 1;
			}
			else {
				raised = false;
				console.log("Not Raised: " + bet);
				return bet;
			}
		}
		if ( self.handEval < 9 && bet > savedChips/2 ){
			return -1;
		}
		else {
			if (raised == false){
				raised = true;
				console.log("Raised On: " + bet);
				return bet + 1;
			}
			else {
				raised = false;
				console.log("Not Raised: " + bet);
				return bet;
			}
		}
		//return bet; // always fold
		//return (savedChips/4);
	}
}

var names = [
	"Randy",
	"Ashley",
	"Garth",
	"Linda",
	"Susan",
	"Suzanne",
	"Mark",
	"Dinesh",
	"Doug",
	"Greg",
	"Mercedes",
	"LaKeisha",
	"DeMarcus",
	"Marcus",
	"Carlos",
	"Sophia",
	"Amanda",
	"Oluchi",
	"Maria",
	"Elvis Presley",
	"Sammy",
	"Izzy",
	"Bubba"
];