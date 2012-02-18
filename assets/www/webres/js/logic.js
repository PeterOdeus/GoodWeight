document.addEventListener("deviceready", onDeviceReady, false);
var devicePlatform = null;
var shouldPlayPlatformSpecificAudio = false;
var isInBrowserModeOnly = true;

function onDeviceReady(){
	console.log("deviceReady");
	// Register the event listener
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	
	if(isInBrowserModeOnly == false){
		devicePlatform = device.platform.toLowerCase();
		onDeviceReadyPlatformSpecific();
	}
	onDeviceReady_db();
}

$(document).ready(function () {
	if(isInBrowserModeOnly == true){
		alert("isInBrowserModeOnly == true");
	}
	showLoadingOverlay();
	if(isInBrowserModeOnly == true){
		onDeviceReady();
	}
    goodWeightModelState.setHtmlBodyLoaded(true);
});

function onDeviceReadyPlatformSpecific(){
	if(devicePlatform == "ios" || devicePlatform == "iphone"){
		/*sound only available by user interaction, supposedly.
		 * Or mayme that's only when using html5 audio tag, which we're not using here...
		 * http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html
		 */
		//showSoundEnabled(false);
		//return;
	}
	//Let's try sound on all the rest of the device platforms
	playAudio();
}

function onPause() {
  console.log("I've been paused");
}

function onResume() {
  console.log("I've been resumed");
}

function onUnLoaded(){
	console.log("I'm unloading");
	stopAudio();
}

function ensureSaveWeightAndCharityPanelShowing(){
	var divSaveWeight = $("#divSaveWeight:hidden");
	console.log("inside ensureSaveWeightAndCharityPanelShowing(), #divSaveWeight:hidden=" + (divSaveWeight != null));
	$("#divSaveWeight:hidden").show().trigger("updatelayout");
	//$("#divSaveWeight").scroll();
}

function updateOrientation(){
	console.log("orientation change to: " + window.orientation);
	//$("body").trigger("updatelayout");
}

function hideSaveWeightAndCharityPanel(){
	$("#divSaveWeight").hide().trigger("updatelayout");
	$(".transientlyActiveButton").removeClass("ui-btn-active");
}

function cancelSavingWeightAndCharity(){
	weightModel.resetTempWeight();
	setWeightScrollerValue();
	charityModel.resetTempCharitySum();
	resetCharityScrollerValue();
	hideSaveWeightAndCharityPanel();
}


function saveWeightAndCharity(){
	var modelNameArray = [];
	
	hideSaveWeightAndCharityPanel();
	showLoadingOverlay();
	if(weightModel.isWeightChanged() == true){
		modelNameArray.push("weightModelReady");
	}
	if(charityModel.isTempCharitySumChanged() == true){
		modelNameArray.push("charityModelReady");
	}
	console.log("modelNameArray: " + modelNameArray);
	goodWeightModelState.addEventListener("onCharityAndWeightReadilySaved", modelNameArray,
		function(){
			console.log("onCharityAndWeightSaved in progress");
			goodWeightModelState.removeEventListener("onCharityAndWeightReadilySaved");
			hideLoadingOverlay();
		}
	);
	if(weightModel.isWeightChanged() == true){
		saveWeight();
	}
	if(charityModel.isTempCharitySumChanged() == true){
		saveCharity();
	}
}

function hideLoadingOverlay(){
	$('#divOverlay').hideLoading();
	$('#divOverlay').css('display', 'none');
}
function showLoadingOverlay(){
	//$('#divOverlay').css('display', 'block');
	$('#divOverlay').showLoading();
}

function saveCharity(){
	console.log("Saving charity sum to GoodWeight DB");
	goodWeightModelState.addEventListener("onCharitySumChanged", ["charityModel"],
		function(){
			console.log("onCharitySumChanged in progress");
			goodWeightModelState.removeEventListener("onCharitySumChanged");
			setCharityExtendedInfo();
			resetCharityScrollerValue();
			goodWeightModelState.setCharityModelReady(true);
		}
	);
	if(charityModel.isTempCharitySumChanged() == true){
		if(charityModel.totalSum == 0){
			insertCharitySum();
		}else{
			updateCharitySum();
		}
	}
}

function saveWeight(){
	console.log("Saving weight to GoodWeight DB");
	//var latestKnownToday = dateModel.today;
	goodWeightModelState.addEventListener("onWeightChanged", ["weightModel", "weightModel_weightDelta"],
		function(){
			console.log("onWeightChanged in progress");
			goodWeightModelState.removeEventListener("onWeightChanged");
			setWeightScrollerValue();
			setWeightExtendedInfo();
			goodWeightModelState.setWeightModelReady(true);
		}
	);
	goodWeightModelState.addEventListener("onSelectingDate", ["dateModel"],
		function(){
			goodWeightModelState.removeEventListener("onSelectingDate");
			console.log("dateModel.today: " + dateModel.today);
			//console.log("latestKnownToday: " + latestKnownToday);
			if(weightModel.weightSetInDb == false){
				//INSERT
				insertLatestWeight();
			}else{
				if(dateModel.today != weightModel.latestSampleDate){
					console.log("latest known weight was in the past. Inserting new.");
					//INSERT
					insertLatestWeight();
				}else{
					console.log("latest known weight was today. Updating.");
					//UPDATE
					updateLatestWeight();
				}
			}
		}
	);
	setTodaysDate();
}

function setWeightScrollerValue(){
	console.log("in function setWeightScrollerValue()");
	$('#weightScroller').scroller("setValue", numberToLeftPaddedArray(weightModel.latestWeight, "0", 4, true));
	$('#weightScroller').scroller("scrollToSetValue");
}

function resetCharityScrollerValue(){
	console.log("in function resetCharityScrollerValue()");
	$('#charityScroller').scroller("setValue", [0,0,0,0]);
	$('#charityScroller').scroller("scrollToSetValue");
}

function setWeightExtendedInfo(){
	$('#weightExtendedInfo').html('2-Week trend: <b>' + weightModel.getWeightDeltaToString() + '</b>');
}

function setCharityExtendedInfo(){
	$('#charityExtendedInfo').html('My Goodness: <b>' + charityModel.totalSum + '</b>');
}


// SlowFood Timer code
var continueSlowFoodToggling = true;
var startTime = null;
var handleSlowFoodTimerClick = function(){
	var slowFoodButton = $('.slow-food-icon');
	var imageFileName = slowFoodButton.css('background-image');
	if(imageFileName.indexOf("Play") >= 0){
		continueSlowFoodToggling = true;
		startTime = new Date();
		slowFoodButton.css('background-image', 'url(webres/img/Play1Pressed.png)');
		slowFoodButton.fadeOut(1000);
		
		$('#slowFoodMeter').fadeOut('fast');
		$('#slowFoodMeter').remove();
		
		slowFoodButton.promise().done(function() {
			slowFoodButton.css('background-image', 'url(webres/img/Stop1.png)');
			slowFoodButton.fadeIn(1000);
			slowFoodButton.promise().done(function() {
//				console.log("once a sec.");
//				recursiveSlowFoodToggleFn();
			});
		});
	}else{
		continueSlowFoodToggling = false;
		slowFoodButton.stop(true,true);
		var endTime = new Date();
		console.log("startTime: "+ startTime.getTime());
		console.log("endTime: "+ endTime.getTime());
		var totalTimeSecs = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
		console.log("totalsecs: "+ totalTimeSecs);
		var maxTimeSecs = 720;
		var totalTimePercentage;
		if(totalTimeSecs >= maxTimeSecs){
			totalTimePercentage = 100;
		}else{
			totalTimePercentage = Math.ceil((totalTimeSecs/maxTimeSecs) * 100);
		}
		console.log(totalTimePercentage);
		slowFoodButton.promise().done(function() {
			slowFoodButton.css('background-image', 'url(webres/img/Stop1Pressed.png)');
			slowFoodButton.css({opacity:1.0});
			
		});
		
		$("#meterHolder").append('<div id="slowFoodMeter" class="meter"><span style="width: ' + totalTimePercentage + '%"></span></div>');
		$(".meter > span").each(function() {
			$(this)
				.data("origWidth", $(this).width())
				.width(0)
				.animate({
					width: $(this).data("origWidth")
				}, 5000);
		});
		$(".meter > span").promise().done(function(){
			slowFoodButton.css('background-image', 'url(webres/img/Play1.png)');
		});
	}
};

var recursiveSlowFoodToggleFn = function(){
	try{
		var targetObj = $('.slow-food-icon');
		var fadeToValue;
		//console.log("opacity: " + targetObj.css('opacity'));
		if(targetObj.css('opacity') < 1.0){
			fadeToValue = 1.0;
		}else{
			fadeToValue = 0.7;
		}
		targetObj.fadeTo(2000, fadeToValue);
		$('.slow-food-icon').promise().done(function() {
		    if(continueSlowFoodToggling == true){
		    	recursiveSlowFoodToggleFn();
		    }
		});
	} catch(err){
		console.log("error in recursiveSlowFoodToggleFn: " + err);
	}
};
