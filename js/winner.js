function determineWinner(){
	//do stuff to determine winner
	//call algorithms to determine hand strength
	winner_id = game.activePlayers()[0].id;

	return winner_id;
}

//could use a determineBestHand function or have player choose the 5 cards they want to use?

function determineHand( hand_cards, table_cards ){
	//determine what kind of hand each player has
	//could take 2 arrays of cards
	//hand_cards could be an array of the cards that MUST be played
	//pick best 5 from table_cards

	var hand_value = 0; //value assigned to each hand type
	if( isRoyalFulsh() ){
		return 7; //or whatever
	}
	//....
	else{	//nothing
		return 0;
	}
}

function determineHandValue( arrayOfCards ){
	//determine total value of hand (second value in array of determining winner)

	var value = 0;

	return value;
}

function determineHighCard( arrayOfCards ){
	//determine high card (third value in array)

	var value = 0; //value of high card

	return value;
}