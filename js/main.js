$(CastFramework).ready(function() {
    CastFramework.start('urn:x-cast:com.pokercast.receiver');
    $(document.body).css("background-color", "#1693A5");
    $('#status').text("it's working! yay!");

    console.log( 'The deck: ' + JSON.stringify( cards ) );

    $(CastFramework).on("join", function(event, clientId, content) {
    	content = content || {};
		// add the player to the list of players (if they aren't already in it)
		var push = true;
		console.dir(game.players());
		game.players().forEach(function(player) {
			if(player.id === clientId) {
				push = false;
			}
		});
		if(push) {
			game.players.push(new Player(clientId, content.name || null));
		}
	 	CastFramework.sendMessage(clientId, "exampleCommand", "hello!");
	 });

    /*Signal from android that a turn is complete*/
    $( CastFramework ).on( 'my_turn', function( event, clientId, content ){
    	content = content || {};
    	
    	var previous_bet = content.bet;

        var current_index = 0;
        for( var x = 0; x < game.players().length; x++ ){ //get index of current player in array
            if( game.players()[x].id === clientId ){
                current_index = x;
                break;
            }
        }

        var num_players = game.players.length;
    	var next_player = game.players()[ (current_index + 1) % num_players ]; //get next player in order
		
		var new_turn = {
    			'last_bet' : previous_bet,
    			'player_id' : next_player.id
    	};
    	
    	game.players().forEach( function( player ) {  //send message to all clients
    		CastFramework.sendMessage( player.id, 'turn', new_turn );
    	});
    });

});