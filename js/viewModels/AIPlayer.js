function AIPlayer(id, chips) {
	Player.apply(this, ['aiPlayer'+id, names.splice(Math.floor(Math.random()*names.length),1)[0]])
	var self = this;
	var savedChips = chips;
	self.handEval = -1;
	self.newRound = true;
	var raised = 0;
	var frugality = Math.random()*4 + 0.5;	//how much they're willing to bet, lower = more
	var confidence = Math.random()*3;	//boosts handEvaluation
	self.type = "AIPlayer";
	self.makeBet = function(bet, round) {
		console.log("HandEval: " + self.handEval);
		console.log("Confidence: " + confidence);
		console.log("Bet: " + bet);
		console.log("Frugality: " + frugality);
		var finalEval = self.handEval + confidence;
		if ( bet == 0 && finalEval < 1 ){
			return bet;
		}
		if ( finalEval < 1 ){
			if ( round == 0 && bet < savedChips/(frugality + 2) ){
				return bet;
			}
			else {
				return -1;
			}
		}
		if ( finalEval < 3 && bet < savedChips/frugality ){
			return bet;
		}
		if ( finalEval < 3 && bet > savedChips/frugality ){
			return -1;
		}
		if ( finalEval < 5 && bet < savedChips/(frugality/2) ){
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
		if ( finalEval < 5 && bet > savedChips/(frugality/2) ){
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
		//return bet;
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