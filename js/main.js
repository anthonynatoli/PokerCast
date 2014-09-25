$(CastFramework).ready(function() {
    CastFramework.start('urn:x-cast:com.pokercast.receiver');
    $(document.body).css("background-color", "#1693A5");
    $('#status').text("it's working! yay!");

    $(CastFramework).on("join", function(event, clientId, content) {
    	content = content || {};

        // If the hand is not null, the game has started
        var game_started = game.hand != null;

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
            if (game_started)
                game.inactivePlayers.push(new Player(clientId, content.name || null));
            else
                game.activePlayers.push(new Player(clientId, content.name || null));

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
    			game.activePlayers().push(new AIPlayer(i));
    		}
    	}

        // create a Deck, a Hand, and give each player cards and chips
        game.hand = new Hand(new Deck(), content.chipsPerPlayer, startingPot);
        game.activePlayers().forEach(function(player) {
            // give each player two cards
            player.cards.push(game.hand.deck.getCard());
            player.cards.push(game.hand.deck.getCard());
            player.chips = game.hand.chipsPerPlayer;

            if(player.type != 'AIPlayer') {
                // AIPlayers don't have ids, so don't send them messages!
                CastFramework.sendMessage( player.id, 'hand', {
                    cards: player.cards,
                    chips: player.chips
                });
            }
        });
        console.dir(game.activePlayers());

        // put 3 cards on the table
        game.hand.cardsOnTable.push(game.hand.deck.getCard());
        game.hand.cardsOnTable.push(game.hand.deck.getCard());
        game.hand.cardsOnTable.push(game.hand.deck.getCard());

        // choose a player at random and start the betting loop
        var firstPlayer = game.activePlayers()[Math.floor(Math.random()*game.activePlayers().length)];
        newTurn(firstPlayer, 0);
    });

    /*Signal from android that a turn is complete*/
    $( CastFramework ).on( 'my_turn', function( event, clientId, content ){
    	content = content || {};
    	handleBet(clientId, content.bet);
    });

    function newTurn(player, bet) {
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
            handleBet(player.id, player.bet());
        }
    }

    function handleBet(id, bet) {
        var previous_bet = bet;

        // Add the current bet to the current hand's pot
        if (previous_bet != -1) 
            game.hand.pot += previous_bet;

        var current_index = 0;
        for( var x = 0; x < game.activePlayers().length; x++ ){ // Get index of current player in array
            if( game.activePlayers()[x].id === id ){
                current_index = x;
                break;
            }
        }

        var prev_player = game.activePlayers()[current_index];

        // Update the players total bet/chips amount
        if (previous_bet == -1) 
            prev_player.bet == -1; // Player folded
        else {
            prev_player.bet += previous_bet;
            prev_player.chips -= previous_bet;

            // TODO: Implement All-In functionality
            if (prev_player.chips == 0) {
                // All In??
            }
            // TODO: Implement Error Checking
            else if (prev_player.chips < 0) {
                // Throw Error
            }
        }
        
        prev_player.hadTurn = true;

        // Checks to see if the round is over
        if(checkRoundOver()) {
            if (++game.hand.round >= 4) { // Hand is over
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

            if (next_player.bet != -1)
                break;
        }

        /* This shouldn't happen
          (should be caught in checkRoundOver()) */
        if (next_player == null || next_player.bet == -1) {
            endHand();
            return;
        }
        
        newTurn(next_player, previous_bet);
    }

    /* Checks to see if the round is over by comparing
       all active players' current bets. If their bets match or 
       have folded (bet == -1), the round is over */
    function checkRoundOver() {
        var betToCompare = -1;

        game.activePlayers().forEach(function(player) {
            // Checks if a player has bet yet
            if (!player.hadTurn)
                return false;
            
            // Checks if a player has folded
            if (player.bet == -1)
                continue;

            // Gets the first player's bet amount and compare it with the others
            if (betToCompare == -1)
                betToCompare = player.bet;
            else if (betToCompare != player.bet)
                return false;
        });

        return true;
    }

    function endRound() {
        game.activePlayers().forEach(function(player) {
            player.hadTurn = false;
        })

        game.hand.cardsOnTable.push(game.hand.deck.getCard());
    }
     /* Check who won the hand
       and if the game is over */
    function endHand() {
        // TODO: IMPLEMENT ME
    }

});