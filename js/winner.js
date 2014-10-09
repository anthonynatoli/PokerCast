var handRank = [
	"High Card",
	"One Pair",
	"Two Pair",
	"Three of a Kind",
	"Straight",
	"Flush",
	"Full House",
	"Four of a Kind",
	"Straight Flush",
	"Royal Flush"
];
/* Loops through each active player and
   checks their score against the previous player.
   Returns the player with the highest score */
function determineWinner(){
	// TODO: Implement TIES
	var bestScore = [ 0, 0, 0 ]; // {Rank, HighestUsedCard, HighCard}
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
	    game.activePlayers()[i].bestHand(handRank[score[0]]);

	    // If the rank (royal flush, straight, etc.) is higher
	    // than previous best then update score
	    if (score[0] > bestScore[0]) {
	    	updateScore = true;
	    } 
	    // If the rank is the same, compare highest used card
	    else if (score[0] == bestScore[0]) {
	    	if (score[1] > bestScore[1]) {
	    		updateScore = true;
	    	}
	    	// If the highest used card is the same, compare the high card
	    	else if (score[1] == bestScore[1]) {
	    		if (score[2] > bestScore[2])
	    			updateScore = true;
	    	}
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
	
	var score = null;

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
	var sortedCards = [];
	
	playerCards.forEach(function(card) {
		sortedCards.push(switchRoyalCard(card));
	});
	tableCards.forEach(function(card) {
		sortedCards.push(switchRoyalCard(card));
	});

	sortedCards.sort(function (card1, card2) {
		return card2.value - card1.value;
	});

	return sortedCards;
}

/* Changes all of the char values and k,q,j,A
   to comparable integers as a new object */
function switchRoyalCard(card) {
	var cardValue = card['value'];

	switch (card['value']) {
		case 'j': cardValue = 11;
			break;
		case 'q': cardValue = 12;
			break;
		case 'k': cardValue = 13;
			break;
		case '1': cardValue = 14;
			break;
	}

	return { value: parseInt(cardValue), suit: card['suit'] };
}
