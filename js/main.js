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

    $(CastFramework).on("start_hand", function(event, clientId, content) {
        console.log("MOUSE!");
    	content = content || {};
    	if(content.aiPlayers) {
    		for(int i = 0; i < content.aiPlayers; i++) {
    			game.players().push(new AIPlayer(i));
    		}
    	}
    	console.dir(game.players());
    });

});