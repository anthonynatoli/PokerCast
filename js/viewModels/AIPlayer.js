function AIPlayer(id, chips) {
	Player.apply(this, ['aiPlayer'+id, names.splice(Math.floor(Math.random()*names.length),1)[0]])
	var self = this;
	var savedChips = chips;
	self.handEval = -1;
	self.newRound = true;
	var raised = 0;
	var confidence = Math.random()*4 + 0.1;
	self.type = "AIPlayer";
	self.makeBet = function(bet, round) {
		//console.log("HandEval: " + self.handEval);
		//console.log("Bet: " + bet);
		console.log("Confidence: " + confidence);
		//var finalEval = self.handEval + confidence;
		if ( bet == 0 && self.handEval < 1 ){
			return bet;
		}
		if ( self.handEval < 1 && round != 0){
			return -1;
		}
		if ( self.handEval < 2 && bet < savedChips/confidence ){
			return bet;
		}
		if ( self.handEval < 2 && bet > savedChips/confidence ){
			return -1;
		}
		if ( self.handEval < 4 && bet < savedChips/(confidence/2) ){
			if (self.newRound){
				self.newRound = false;
				console.log("Raised On: " + bet);
				return bet + 1;
			}
			else {
				console.log("Not Raised: " + bet);
				return bet;
			}
		}
		if ( self.handEval < 4 && bet > savedChips/(confidence/2) ){
			return -1;
		}
		else {
			if (self.newRound){
				self.newRound = false;
				console.log("Raised On: " + bet);
				return bet + 1;
			}
			else {
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