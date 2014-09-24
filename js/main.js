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

        // create AIPlayers
    	if(content.aiPlayers) {
    		for(var i = 0; i < content.aiPlayers; i++) {
    			game.activePlayers().push(new AIPlayer(i));
    		}
    	}

        // create a Deck, a Hand, and give each player cards and chips
        game.hand = new Hand(new Deck(), content.chipsPerPlayer);
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
        game.cardsOnTable.push(game.hand.deck.getCard());
        game.cardsOnTable.push(game.hand.deck.getCard());
        game.cardsOnTable.push(game.hand.deck.getCard());

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

        var current_index = 0;
        for( var x = 0; x < game.activePlayers().length; x++ ){ //get index of current player in array
            if( game.activePlayers()[x].id === id ){
                current_index = x;
                break;
            }
        }

        var num_players = game.activePlayers().length;
        var next_player = game.activePlayers()[ (current_index + 1) % num_players ]; //get next player in order
        
        newTurn(next_player, previous_bet);
    }

});