$(CastFramework).ready(function() {
    CastFramework.start('urn:x-cast:com.pokercast.receiver');

    $(CastFramework).on("join", function(event, clientId, content) {
    	content = content || {};

        // If the hand is not null, the game has started
        var game_started = game.hand() != null;

		// add the player to the list of players (if they aren't already in it)
		var push = true;

		console.dir(game.activePlayers());
        console.dir(game.inactivePlayers());

        if (game_started) {
            // Game has started
            game.inactivePlayers().forEach(function(player) {
                if(player.id === clientId) {
                    push = false;
                }
            });
        } 
        else {
            // Game hasn't started yet
            game.activePlayers().forEach(function(player) {
                if(player.id === clientId) {
                    push = false;
                }
            });
        }
		
		if(push) {
            if (game_started){
                game.inactivePlayers.push(new Player(clientId, content.name || null));
            }
            else{
                game.activePlayers.push(new Player(clientId, content.name || null));
            }
            // Sends them a message letting them know if they have
            // successfully joined and if they are the host
            var new_player = {
                'success' : !game_started,
                'host' : game.activePlayers().length == 1 && !game_started,
                'player_id': clientId,
                'name': content.name
            };

            CastFramework.sendMessage(clientId, "join", new_player);
        }
    });

    $(CastFramework).on("start_hand", function(event, clientId, content) {
    	content = content || {};

        var startingPot = 0;

        // create AIPlayers
    	if(content.aiPlayers) {
    		for(var i = 0; i < content.aiPlayers; i++) {
    			game.activePlayers.push(new AIPlayer(i, content.chipsPerPlayer));
    		}
    	}
        
        // create a Deck and a Hand
        game.hand(new Hand(new Deck(), content.chipsPerPlayer, startingPot));
        
        //send out ante amount and subtract amount from chip count
        game.hand().ante( 1 ); //set ante at 1 for now, can enable host to set ante if we want
        var ante_amount = game.hand().ante();

        //take ante from each player and put it in the pot
        game.activePlayers().forEach( function( player ){
            player.chips( player.chips() - ante_amount );
            game.hand().pot( game.hand().pot() + ante_amount );
        });

        
        //give each player cards and chips
        game.activePlayers().forEach(function(player) {
            // give each player two cards
            player.cards.push(game.hand().deck().getCard());
            player.cards.push(game.hand().deck().getCard());
            player.chips(game.hand().chipsPerPlayer);

            if(player.type != 'AIPlayer') {
                // AIPlayers don't have ids, so don't send them messages!
                CastFramework.sendMessage( player.id, 'hand', {
                    card1: ""+player.cards[0].suit+player.cards[0].value,
                    card2: ""+player.cards[1].suit+player.cards[1].value,
                    chips: player.chips() - ante_amount
                });
            }
	    else {
		    var AIplayerCards = player.cards.sort(function (card1, card2) {
			return card2.value - card1.value;
		    });
		    var score = determineHand(player.cards);
		    console.log(score);
		    player.handEval = score[0];
	    }
        });
        console.dir(game.activePlayers());
    });

    var received = false;
    $(CastFramework).on("hand_received", function(event, clientId, content) {
        // choose a player at random and start the betting loop
        if(!received) {
            received = true;
            var firstPlayer = game.activePlayers()[Math.floor(Math.random()*game.activePlayers().length)];
	        totalBetForRound = 0;
            newTurn(firstPlayer, 0);
        }
    });

    /*Signal from android that a turn is complete*/
    $( CastFramework ).on( 'my_turn', function( event, clientId, content ){
    	content = content || {};
    	handleBet(clientId, content.bet);
    });

    $(CastFramework).on("disconnect", function(event, clientId) {
        game.activePlayers().forEach(function(player) {
            if (player.id == clientId) {
                player.bet(-1);
                return false;
            }
        });

        if (game.hand().currentPlayer() && (game.hand().currentPlayer().id == clientId)) {
            handleBet(clientId, -1);
        }
    });

    function newTurn(player, bet) {
        // update whose turn it is
        game.hand().currentPlayer(player);

        // create a new turn message
        var new_turn = {
                'last_bet' : bet,
                'player_id' : player.id
        };
        console.dir(new_turn);
        // send it to everyone
        CastFramework.broadcastMessage( 'turn', new_turn );

        // if the player is an AI player, then make them bet
        if(player.type == 'AIPlayer') {
            window.setTimeout(function() {
                handleBet(player.id, player.makeBet(bet, game.hand().round()));
            }, 2000);
        }
    }

    var firstPlayer = true;
    function handleBet(id, bet) {
        var previous_bet = bet;

        // Add the current bet to the current hand's pot
        if (previous_bet != -1) {
            game.hand().pot(game.hand().pot()+previous_bet);
        }
        
        var current_index = 0;
        for( var x = 0; x < game.activePlayers().length; x++ ){ // Get index of current player in array
            if( game.activePlayers()[x].id === id ){
                current_index = x;
                break;
            }
        }

        var prev_player = game.activePlayers()[current_index];

        // Update the players total bet/chips amount
        if (previous_bet == -1) {
            prev_player.bet(-1); // Player folded
            prev_player.action("Fold");
        } else {
            prev_player.betRound(prev_player.betRound()+previous_bet);
            if(prev_player.betRound() > totalBetForRound) {
                if(firstPlayer) {
                    prev_player.action("Bet");
                } else {
                    prev_player.action("Raise");
                }
            } else {
                if(firstPlayer) {
                    prev_player.action("Check");
                } else {
                    prev_player.action("Call");
                }
            }
            firstPlayer = false;

            prev_player.bet(prev_player.bet()+previous_bet);
            game.hand().currentBet = prev_player.bet();
            prev_player.chips(prev_player.chips()-previous_bet);

            if (previous_bet > totalBetForRound){
                totalBetForRound = previous_bet;
            }

            // TODO: Implement All-In functionality
            if (prev_player.chips() == 0) {
                // All In??
            }
            // TODO: Implement Error Checking
            else if (prev_player.chips() < 0) {
                // Throw Error
            }
        }
        
        prev_player.hadTurn = true;

        // Checks to see if the round is over
        if(checkRoundOver()) {
            game.hand().round(game.hand().round()+1);
            if (game.hand().round() >= 4) { // Hand is over
                endHand();
                return;
            }

            endRound();
            previous_bet = 0;
        }

        var num_players = game.activePlayers().length;
        var next_player = null;  

        // Get next player in order (who hasn't folded)
        for (var x = 1; x < num_players; x++) {
            next_player = game.activePlayers()[ (current_index + x) % num_players ];

            if (next_player.bet() != -1){
                break;
            }
        }

        /* This shouldn't happen
          (should be caught in checkRoundOver()) */
        if (next_player == null || next_player.bet == -1) {
            endHand();
            return;
        }
        
        newTurn(next_player, totalBetForRound - next_player.betRound());
    }

    /* Checks to see if the round is over by comparing
       all active players' current bets. If their bets match or 
       have folded (bet == -1), the round is over */
    function checkRoundOver() {
        var betToCompare = -1;

        for(var i = 0; i < game.activePlayers().length; i++) {
            var player = game.activePlayers()[i];
            // Checks if a player has bet yet
            if (!player.hadTurn){
                return false;
            }
            
            // Checks if a player has folded/has equal bets
            if (player.bet() == -1){
            }
            else if (betToCompare == -1){
                betToCompare = player.bet();
            }
            else if (betToCompare != player.bet()){
                return false;
            }
        }

        return true;
    }

    function endRound() {
        var num_folds = 0;
	    totalBetForRound = 0;
        game.activePlayers().forEach(function(player) {
	       player.betRound(0);
            if(player.bet() != -1) {
                player.action("Waiting");
                player.hadTurn = false;
                firstPlayer = true;
            }
            else{
                num_folds++;
            }
        });

        //if all but one player has folded, hand ends
        if( num_folds === game.activePlayers().length-1 ){
            endHand();
        }
        //otherwise hand continues
        else{
            if(game.hand().cardsOnTable().length == 0) {
            // first time, put 3 cards out
                game.hand().cardsOnTable.push(game.hand().deck().getCard());
                game.hand().cardsOnTable.push(game.hand().deck().getCard());
            }
            // always put one card out
            game.hand().cardsOnTable.push(game.hand().deck().getCard());
	    game.activePlayers().forEach(function(player) {
	    if (player.type == 'AIPlayer'){
		var AIplayerCards = sortCards(player.cards, game.hand().cardsOnTable());
		var score = determineHand(AIplayerCards);
		console.log(score);
		player.handEval = score[0];
		player.newRound = true;
	    }
	});
        }

    }

     /* Check who won the hand
       and if the game is over */
    function endHand() {
        var winner = determineWinner();
        game.hand().winner(winner.name);
        var pot_value = emptyPot();
        firstPlayer = true;

    	game.activePlayers().forEach(function(player) {
    		if (player.type == 'AIPlayer'){
    			player.resetRandoms();
    		}
    	});

        var winnings = {
            'winner_id': winner.id,
            'winner_name': winner.name,
            'pot_value': pot_value
        };

        // TODO: Implement check for if the game is over

        CastFramework.broadcastMessage( 'end_hand', winnings );

        setTimeout(function() {
            nextHand(winner)
        }, 30000);
    }

    function nextHand(winner) {
        //add pot to chip count of hand winner
        var winner_chips = winner.chips() + pot_value;
        winner.chips( winner_chips );

        //check if game ends
        var num_eligible_players = 0;
        var startNewHand = false;

        if( game.inactivePlayers().length > 0 ){
            startNewHand = true;
        }

        game.activePlayers().forEach( function( player ){
            if( player.chips() > 0 ){ //if a player has chips, they are eligible for next hand
                num_eligible_players++;
                if( num_eligible_players > 1 ){ 
                    //if more than one player is eligible, start a new hand
                    startNewHand = true;
                }
            }
        });
        if( startNewHand ){
            newHand();
        }
    }

    function newHand(){
        //kick players with 0 chips, add players waiting in queue
        //give new players designated chip count, maintain chip count for old players
        var kick_players = [];
        var x = 0;
        var temp_player = null;
        var chipsPerPlayer = game.hand().chipsPerPlayer;
        var startingPot = 0;

        //remove ineligible players from activePlayer list
        for( x = game.activePlayers().length - 1; x >= 0; x-- ){
            temp_player = game.activePlayers()[x];
          
            if( temp_player.chips() <= 0 ){
                kick_players.push( temp_player );
                game.activePlayers().splice( x, 1 );
            }
        }
        
        //add queued players to active player list
        for( x = game.inactivePlayers().length - 1; x >= 0; x-- ){
            temp_player = game.inactivePlayers()[x];
            temp_player.chips( chipsPerPlayer );

            game.activePlayers().push( temp_player );
            game.inactivePlayers.splice( x, 1 );
        }

        received = false; //set global variable to false
        //I don't see why the received variable is necessary

        // create a Deck and a Hand
        game.hand(new Hand(new Deck(), chipsPerPlayer, startingPot));

        //distribute cards to players
        game.activePlayers().forEach( function( player ){
            player.bet( 0 );
            player.cards = [];
            player.cards.push(game.hand().deck().getCard());
            player.cards.push(game.hand().deck().getCard());
        
            if(player.type != 'AIPlayer') {
                // AIPlayers don't have ids, so don't send them messages!
                CastFramework.sendMessage( player.id, 'hand', {
                    card1: ""+player.cards[0].suit+player.cards[0].value,
                    card2: ""+player.cards[1].suit+player.cards[1].value,
                    chips: player.chips()
                });
            }
        });
    }

    function emptyPot() {
        var val = game.hand().pot();
        game.hand().pot(0);
        return val;
    }

});