$(CastFramework).ready(function() {
    CastFramework.start('urn:x-cast:com.pokercast.receiver');
    $(document.body).css("background-color", "#1693A5");
    $('#status').text("it's working! yay!");

    console.log( 'The deck: ' + JSON.stringify( cards ) );


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
                'host' : game.activePlayers.length == 1 && !game_started,
                'player_id': clientId,
                'name', content.name
            };

            CastFramework.sendMessage(clientId, "join", new_player);
        }
    });

    /*Signal from android that a turn is complete*/
    $( CastFramework ).on( 'my_turn', function( event, clientId, content ){
    	content = content || {};
    	
    	var previous_bet = content.bet;

        var current_index = 0;
        for( var x = 0; x < game.activePlayers().length; x++ ){ //get index of current player in array
            if( game.activePlayers()[x].id === clientId ){
                current_index = x;
                break;
            }
        }

        var num_players = game.activePlayers.length;
    	var next_player = game.activePlayers()[ (current_index + 1) % num_players ]; //get next player in order
		
		var new_turn = {
    			'last_bet' : previous_bet,
    			'player_id' : next_player.id
    	};
    	
    	game.activePlayers().forEach( function( player ) {  //send message to all active clients
            CastFramework.sendMessage( player.id, 'turn', new_turn );
    	});
    });

});