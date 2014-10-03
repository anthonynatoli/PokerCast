
// ============ Global const variables ============
Rank = {
	RoyalFlush: 9,
	StraightFlush: 8,
	FourKind: 7,
	FullHouse: 6,
	Flush: 5,
	Straight: 4,
	ThreeKind: 3,
	TwoPair: 2,
	OnePair: 1,
	HighCard: 0
};

var H = 0, S = 1, C = 2, D = 3;

// ==============================================================================
// ================================= ALGORITHMS =================================
// ==============================================================================

// Royal Flush algorithm
function checkRoyalFlush(cards) {
	var suitCount = new Array(0,0,0,0);
	var highVal = new Array(0,0,0,0);
	var suitHolder = new Array(0,0,0,0);

	/* If the first (highest) card isn't
	   an Ace, return null */
	if (cards[0].value != 14)
		return null;

	for (var i = 0; i < cards.length; i++) {
		var currCard = cards[i];
		var suit = -1;

		/* Keep track of which suits have been hit
		  in the case of multiple suits of A,K,Q,J,10 */
		switch(currCard.suit) {
			case 'h': suit = H;
				break;
			case 's': suit = S;
				break;
			case 'c': suit = C;
				break;
			case 'd': suit = D;
				break;
		}

		/* If the suit hasn't been hit yet
		   and the first value is an ace */
		if (suitHolder[suit] == 0) {
			if (currCard.value == 14) {
				suitHolder[suit] = currCard.value;
				suitCount[suit] = 1;
				highVal[suit] = currCard.value;
			}
		} 
		// Check if the last value at this suit is 1 greater (ex: 14(A) is 1 greater than 13(K))
		else if (suitHolder[suit] == currCard.value + 1) {
			suitHolder[suit] = currCard.value;
			if (++suitCount[suit] >= 5) {
				return new Array(Rank.RoyalFlush, highVal[suit], highVal[suit]);
			}
		}
	}
	return null;
}

// Straight Flush algorithm
function checkStraightFlush(cards) {
	var suitCount = new Array(0,0,0,0);
	var highVal = new Array(0,0,0,0);
	var suitHolder = new Array(0,0,0,0);

	for (var i = 0; i < cards.length; i++) {
		var currCard = cards[i];
		var suit = -1;

		/* Keep track of which suits have been hit
		  in the case of multiple suits of A,K,Q,J,10 */
		switch(currCard.suit) {
			case 'h': suit = H;
				break;
			case 's': suit = S;
				break;
			case 'c': suit = C;
				break;
			case 'd': suit = D;
				break;
		}

		/* If the suit hasn't been hit yet
		   add it */
		if (suitHolder[suit] == 0) {
			suitCount[suit] = 1;
			highVal[suit] = currCard.value;
		} 
		// Check if the last value at this suit is 1 greater (ex: 14(A) is 1 greater than 13(K))
		else if (suitHolder[suit] == currCard.value + 1) {
			if (++suitCount[suit] >= 5) {
				return new Array(Rank.StraightFlush, highVal[suit], highVal[suit]);
			}
		} 
		// Reset the suit's counter
		else {
			highVal[suit] = currCard.value;
			suitCount[suit] = 1;
		}

		suitHolder[suit] = currCard.value;
	}
	return null;
}

// Four of a kind algorithm
function checkFourKind(cards) {
	var prevCard = cards[0];
	var highUsedValue = prevCard.value;
	var highValue = prevCard.value;
	var numInRow = 1;

	for (var i = 1; i < cards.length; i++) {
		var currCard = cards[i];

		/* If the last card == the current card increase the count
		   and check if it's the 4th matching */
		if (prevCard.value == currCard.value) {
			if (++numInRow >= 4) {
				highUsedValue = currCard.value; // It's the same number as the other 3
				/* If the current highValue is the same as the current card
				   we must find the next highest unused value */
				if (highValue == currCard.value && i != cards.length - 1)
					highValue = cards[i+1].value;

				return new Array(Rank.FourKind, highUsedValue, highValue);
			}
		}
		// Reset counter and set the highcard to the first card
		else {
			highValue = cards[0].value;
			numInRow = 1;
		}

		prevCard = currCard;
	}
	return null;
}

// Full House algorithm
function checkFullHouse(cards) {
	var prevCard = cards[0];
	var highUsedValue = 0;
	var twoValue = threeValue = cards[0].value;
	var twoHit = threeHit = false;
	var numInRow = 1;

	for (var i = 1; i < cards.length; i++) {
		var currCard = cards[i];

		if (prevCard.value == currCard.value) {

			/* If we have a match (two equal cards) we know
			   that the value will be used in the full house
			   so the highest value is the first matched card */
			if (highUsedValue == 0)
				highUsedValue = currCard.value;

			/* If there are already 3 matching cards
			   we know another match must be the 2 matching */
			if (threeHit) {
				twoHit = true;
			}
			/* If we have already matched two cards
			   we check to see if there is another
			   for the three match */
			else if (twoHit) {
				if (++numInRow == 3) {
					threeValue = currCard.value;
					threeHit = true;

					/* If the two matching value is equal
					   to the three matching value we must
					   reset the two calculation */
					if (threeValue == twoValue)
						twoHit = false;
				}
			}
			// If this card is the third match
			else if (++numInRow == 3) {
				threeValue = currCard.value;
				threeHit = true;
			}
			// We know at least we have a two match
			else {
				twoValue = currCard.value;
				twoHit = true;
			}

			// Check if there is a full house
			if (threeHit && twoHit)
				return new Array(Rank.FullHouse, highUsedValue, highUsedValue);

		}
		/* Reset the count of same values
		   if the card values aren't equal */
		else {
			numInRow = 1;
		}

		prevCard = currCard;
	}

	return null;
}

function checkFlush(cards) {

	return null;
}

function checkStraight(cards) {

	return null;
}

function checkThreeKind(cards) {

	return null;
}

function checkTwoPair(cards) {

	return null;
}

function checkOnePair(cards) {

	return null;
}

function getHighCard(cards) {

	return null;
}
