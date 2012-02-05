//Audio player
//
var my_media = null;

// Play audio
//
function playAudio() {
	if(shouldPlayPlatformSpecificAudio == true){
		window.JSInterface.playAudio();
	}else{
		// Create Media object from src
		if(my_media == null){
			my_media = new Media(getAudioSource(), onAudioSuccess, onAudioError);
		}
		// Play audio
		my_media.play();
	}
}

//Pause audio
//
function pauseAudio() {
	if(shouldPlayPlatformSpecificAudio == true){
		window.JSInterface.pauseAudio();
	}else{
		if (my_media) {
			my_media.pause();
		}
	}
}

function getAudioSource(){
	console.log("device.platform.toLowerCase(): " + devicePlatform);
	if(devicePlatform == "android"){
		return "/android_asset/www/audio/birdies.mp3";
	}
	if(devicePlatform == "ios" || devicePlatform == "iphone"){
		//See local file example (notification.beep) on iphone quirks at http://docs.phonegap.com/en/1.4.0/phonegap_notification_notification.md.html#notification.beep 
		return "audio/birdies.mp3";
	}
	//Try this on other device platforms
	
}

// Stop audio
// 
function stopAudio() {
	if (my_media) {
		my_media.stop();
		my_media.release();
		my_media = null;
	}
}

// onSuccess Callback
//
function onAudioSuccess() {
	console.log("playAudio():Audio Success");
	my_media.seekTo(0);
	my_media.play();
}

// onError Callback 
//
function onAudioError(error) {
	alert('Error playing sound.\ncode: '    + error.code    + '\n' + 
			'message: ' + error.message + '\n');
}
