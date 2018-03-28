(function(){
var pubnub = PUBNUB.init({publish_key:'demo',subscribe_key:'demo',ssl:true});
var box = PUBNUB.$('box'), input = PUBNUB.$('input'), channel = 'chat';
pubnub.subscribe({
    channel  : channel,
    callback : function(text) { 
    	var botTemp="helloooo";
    	$.ajax({
    url: 'https://api.wit.ai/message',
    type: "GET",
    data: {
    'q': text,
    'access_token' : '2JAQAPCI3ZSNLB5OZPIIO2CZVLB4HUDE'
  },
    dataType: "jsonp",
    success: function (data) {
        // alert(data.entities.about_bot[0].value);
        
        //check for empty result starts
        function isEmpty(obj) {
		    for(var prop in obj) {
		        if(obj.hasOwnProperty(prop))
		            return false;
		    }

		    return JSON.stringify(obj) === JSON.stringify({});
		}
		//check for empty result ends
        
        if(!isEmpty(data.entities)){
        	if(data.entities.intent == undefined){
        		if(data.entities.greetings[0].value == "true"){
        			if(data.entities.about_bot!=undefined){
        				botTemp=data.entities.about_bot[0].value;
        			}
        			else if(data.entities.object_to_grab!=undefined){
        				botTemp=data.entities.object_to_grab[0].value;
        			}
        			else{
        				botTemp=data._text;
        			}
        		}
        		else{
        			botTemp="Missing Intent";
        		}
        	}else{
	        	if(data.entities.intent[0].value == "bot_intro"){
	        		botTemp=data.entities.about_bot[0].value;
	        	}
	        	else if(data.entities.intent[0].value == "current_info"){
	        		botTemp=data.entities.datetime[0].value;
	        	}
        	}
        }else{
        	botTemp="sorry";
        }
        
        var botSays = botTemp;
			box.innerHTML = ('You: '+text).replace( /[<>]/g, '' ) + '<br>' + 'Bot: '+ botSays + '<hr>' + box.innerHTML;
    }
});
			 }
});
		
PUBNUB.bind( 'keyup', input, function(e) {
    (e.keyCode || e.charCode) === 13 && pubnub.publish({
        channel : channel, message : input.value, x : (input.value='')
    })
} )
})()