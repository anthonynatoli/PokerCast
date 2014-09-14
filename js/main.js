$(CastFramework).ready(function() {
    CastFramework.start('urn:x-cast:com.pokercast.receiver');
    $(document.body).css("background-color", "#1693A5");
    $('#status').text("it's working! yay!");

    $(CastFramework).on("join", function(event, clientId, content) {
	 	CastFramework.sendMessage(clientId, "exampleCommand", "hello!");
	 });

});