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
    $(CastFramework).on( 'my_turn', function( event, clientId, content ){
    	content = content || {};
    	
    	var previous_bet = content.bet;
    	var next_player = ; //get next player in order to bet

    	//send message to all clients
    	var new_turn = {
    		'last_bet' : previous_bet,
    		'player_id' : next_player
    	};
    	CastFramework.sendMessage( allIds, 'turn', new_turn );
    });
});