if (document.getElementById('logoutHeader'))
	document.getElementById('logoutHeader').addEventListener('click',function(){
    	 sendMessageToBackground({'logout':'logout'});
});