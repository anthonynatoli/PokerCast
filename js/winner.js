
/* Loops through each active player and
   checks their score against the previous player.
   Returns the player with the highest score */
function determineWinner(){

	var bestScore = {0, 0, 0}; // {Rank, HighestUsedCard, HighCard}
	var winner_index = 0;
	var updateScore = false;
	var cardsOnTable = game.hand().cardsOnTable();

	for (var i = 0; i < game.activePlayers().length; i++) {
		var player = game.activePlayers()[i];
		updateScore = false;

		// Sort all cards in descending order
		var cards = sortCards(player.cards, cardsOnTable);
		
		// Score is an arry in the form of {Rank, HighestUsedCard, HighCards
	    var score = determineHand(cards);

	    if (score[0] > bestScore[0] || score[1] > bestScore[1] || score[2] > bestScore[2]) {
    		updateScore = true;
	    }

	    if (updateScore) {
	    	bestScore[0] = score[0];
	    	bestScore[1] = score[1];
	    	bestScore[2] = score[2];
	    	winner_index = i;
	    }

	}

	return game.activePlayers()[winner_index];
}

/* Checks the passed in cards (should be 7)
   and checks each rank from the best hand to
   the worst. The success of a function returns
   a score array: {Rank, HighestUsedCard, HighCard} */
function determineHand(cards){
	
	var score = {0, 0, 0};

	score = checkRoyalFlush(cards);			// Royal Flush (9)
	if (score != null)
		return score;

	score = checkStraightFlush(cards);		// Straight Flush (8)
	if (score != null)
		return score;

	score = checkFourKind(cards);			// Four of a Kind (7)
	if (score != null)
		return score;

	score = checkFullHouse(cards);			// Full House (6)
	if (score != null)
		return score;

	score = checkFlush(cards);				// Flush (5)
	if (score != null)
		return score;

	score = checkStraight(cards);			// Straight (4)
	if (score != null)
		return score;

	score = checkThreeKind(cards);			// Three of a Kind (3)
	if (score != null)
		return score;

	score = checkTwoPair(cards);			// Two Pair (2)
	if (score != null)
		return score;

	score = checkOnePair(cards);			// One Pair (1)
	if (score != null)
		return score;

	score = getHighCard(cards);				// User sucks, must use high card (0)
	return score;
}

// Sorts all 7 cards in descending order
function sortCards(playerCards, tableCards) {
	//TODO: IMPLEMENT
	var sortedCards = [];

	return sortedCards;
}
