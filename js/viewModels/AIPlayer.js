function AIPlayer(id, chips) {
	Player.apply(this, ['aiPlayer'+id, names.splice(Math.floor(Math.random()*names.length),1)[0]])
	var self = this;
	var savedChips = chips;
	var handEval = Math.random()*10;
	var raised = false;
	self.type = "AIPlayer";
	self.makeBet = function(bet) {
		if ( bet == 0 && handEval < 6 ){
			return 0;
		}
		if ( handEval < 3 ){
			return -1;
		}
		if ( handEval < 6 && bet < savedChips/4 ){
			return bet;
		}
		if ( handEval < 6 && bet > savedChips/4 ){
			return -1;
		}
		if ( handEval < 9 && bet < savedChips/2 ){
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
		if ( handEval < 9 && bet > savedChips/2 ){
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