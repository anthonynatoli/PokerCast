
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
	var suit = -1;

	/* If the first (highest) card isn't
	   an Ace, return null */
	if (cards[0].value != 14)
		return null;

	for (var i = 0; i < cards.length; i++) {
		var currCard = cards[i];

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
	var suit = -1;

	for (var i = 0; i < cards.length; i++) {
		var currCard = cards[i];

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
				// It's the only used value
				highUsedValue = currCard.value; 

				// If the high card is a match card, we set it to the next card
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

// Flush algorithm
function checkFlush(cards) {
	var suitCount = new Array(0,0,0,0);
	var highestValCount = new Array(0,0,0,0);
	var suit = -1;

	for (var i = 0; i < cards.length; i++) {
		var currCard = cards[i];

		/* Keep track of which suits have been hit
		  in the case of multiple suits of A,K,Q,J,10 */
		switch (currCard.suit) {
			case 'h': suit = H;
			break;
			case 's': suit = S;
			break;
			case 'c': suit = C;
			break;
			case 'd': suit = D;
			break;
		}

		// Store the highest value of each suit
		if (currCard.value > highestValCount[suit])
			highestValCount[suit] = currCard.value;

		// If there is a flush
		if (++suitCount[suit] >= 5) {
			return new Array(Rank.Flush, highestValCount[suit], highestValCount[suit]);
		}
	}
	return null;
}

// Straight algorithm
function checkStraight(cards) {
	var prevCard = cards[0];
	var highUsedValue = cards[0].value;
	var numInRow = 1;

	/* Since an Ace can wrap around (A,2,3,4,5) OR (10,J,Q,K,A),
       if there is an ace, we also want to add a card to the very
       	end of the cards array (the value 1) */
	var addCard = highUsedValue == 14 ? 1 : 0;

	for (var i = 1; i < cards.length + addCard; i++) {

		/* if we are at the end of the array, we know we must test the low value
		   of the ace. So we add a new card with the value 1 (suit doesn't matter) */
		var currCard = i != cards.length ? cards[i] : { value: 1, suit: 'x'};

		/* Check if the last value is 1 greater than the 
		  current value ex: 14(A) is 1 greater than 13(K)) */
		if (prevCard.value == currCard.value + 1) {
			if (++numInRow == 5)
				return new Array(Rank.Straight, highUsedValue, highUsedValue);
		}
		// There could be duplicate values that we want to skip
		else if (prevCard.value != currCard.value) {
			numInRow = 1;
			highUsedValue = currCard.value;
		}

		prevCard = currCard;
	}

	return null;
}

// Three of a kind algorithm
function checkThreeKind(cards) {
	var prevCard = cards[0];
	var highUsedValue = highValue = cards[0].value;
	var numInRow = 1;

	for (var i = 1; i < cards.length; i++) {
		var currCard = cards[i];

		if (prevCard.value == currCard.value) {
			if (++numInRow == 3) {
				// The highest value in the 3 set is the matching value
				highUsedValue = currCard.value;

				// If the high card is a match card, we set it to the next card
				if (highValue == currCard.value && i != cards.length - 1)
					highValue = cards[i+1].value;

				return new Array(Rank.ThreeKind, highUsedValue, highValue);
			}
		}
		else {
			// We know the first (highest) value in the
			// array isn't in the 3-set.
			highValue = cards[0].value;
			numInRow = 1;
		}

		prevCard = currCard;
	}

	return null;
}

// Two pair algorithm
function checkTwoPair(cards) {
	var prevCard = cards[0];
	var highUsedValue = highValue = 0;
	var matches = 0;

	for (var i = 1; i < cards.length; i++) {
		var currCard = cards[i];

		if (prevCard.value == currCard.value) {
			// The first match is the highest used value
			highUsedValue = highUsedValue == 0 ? currCard.value : highUsedValue;

			if (++matches == 2) {
				// If the high card is a match card, we set it to the next card
				if (highValue == currCard.value && i != cards.length - 1)
					highValue = cards[i+1].value;

				return new Array(Rank.TwoPair, highUsedValue, highValue);
			}
		}
		// If the high card hasn't been set yet
		else if (highValue == 0) {

			/* If the first card isn't a match, set that as 
			  highest value; else set it as the current value */
			highValue = i == 1 ? prevCard.value : currCard.value;
		}

		prevCard = currCard;
	}

	return null;
}

// One pair algorithm
function checkOnePair(cards) {
	var prevCard = cards[0];
	var highValue = cards[0].value;
	var highestValue = 0;

	for (var i = 1; i < cards.length; i++) {
		var currCard = cards[i];

		if (prevCard.value == currCard.value) {
			// The highest value card is the matching card
			highUsedValue = currCard.value;

			// If the high card is a match card, we set it to the next card
			if (highValue == currCard.value && i != cards.length - 1)
				highValue = cards[i+1].value;

			return new Array(Rank.OnePair, highUsedValue, highValue);
		}

		prevCard = currCard;
	}
	return null;
}

function getHighCard(cards) {

	return null;
}
