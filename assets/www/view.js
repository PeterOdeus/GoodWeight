function fireUpGui(){


	var lang = getUrlVars()["lang"];
	var numberWheelObject = { 0:'0', 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9'};
	var weightScrollerWheels = [ { 'Label0': numberWheelObject, 'Label1': numberWheelObject, 'Label2': numberWheelObject
		, 'decimalSeparator':true ,'Label3': numberWheelObject } ];
	$('#weightScroller').scroller({
		width: 50,
		rows: 2,
		wheels: weightScrollerWheels,
		targetSelector:'#weightScroller',
		lang: lang,
		onValuesSet: function(values) {
			console.log("weightScroller values:" + values);
			console.log("weightScroller arrayToNumberValues:" + arrayToNumber(values, true));
			weightModel.setTempWeight(arrayToNumber(values, true));
			ensureSaveWeightAndCharityPanelShowing();
		}
	});
	var charityScrollerWheels = [ { 'Label0': numberWheelObject, 'Label1': numberWheelObject
		, 'Label2': numberWheelObject, 'Label3': numberWheelObject} ];
	$('#charityScroller').scroller({
		width: 50,
		rows: 2,
		wheels: charityScrollerWheels,
		targetSelector:'#charityScroller',
		lang: lang,
		onValuesSet: function(values) {
			console.log("charityScroller values:" + values);
			ensureSaveWeightAndCharityPanelShowing();
			charityModel.setTempCharitySum(arrayToNumber(values,false));			
		}
	});	

	$("#btnSaveWeightAndCharity").click(saveWeightAndCharity);
	$("#btnCancelWeightAndCharity").click(cancelSavingWeightAndCharity);

	setWeightScrollerValue();
	resetCharityScrollerValue();

	setWeightExtendedInfo();
	setCharityExtendedInfo();
	
	$('#weightScroller').scroller("show");
	$('#charityScroller').scroller("show");


	$("#buttonTestSomething").click(function(){
		
//		$('.slow-food-icon').css('background-image', 'url(img/Play1Pressed.png)');
//		$('.slow-food-icon').fadeOut(800);
//		
//		$('.slow-food-icon').promise().done(function() {
//			$('.slow-food-icon').css('background-image', 'url(img/Stop1.png)');
//			$('.slow-food-icon').fadeIn(800);
//			$('.slow-food-icon').promise().done(function() {
//				recursiveSlowFoodToggleFn();
//			});
//		});
//		
		
//		$("#meterHolder").append('<div id="slowFoodMeter" class="meter"><span style="width: 99%"></span></div>');
//		$(".meter > span").each(function() {
//			$(this)
//				.data("origWidth", $(this).width())
//				.width(0)
//				.animate({
//					width: $(this).data("origWidth")
//				}, 12000);
//		});
		/*console.log("[0,1,0,0] ? " + numberToLeftPaddedArray(10, "0", 4, true));
		console.log("[0,1,0,0] ? " + numberToLeftPaddedArray(10.0, "0", 4, true));
		console.log("[0,1,0,1] ? " + numberToLeftPaddedArray(10.1, "0", 4, true));
		console.log("[0,0,0,0] ? " + numberToLeftPaddedArray(0, "0", 4, true));
		console.log("[0,0,0,0] ? " + numberToLeftPaddedArray(0, "0", 4, false));
		console.log("[9,9,9,0] ? " + numberToLeftPaddedArray(999, "0", 4, true));
		console.log("[0,9,9,9] ? " + numberToLeftPaddedArray(999, "0", 4, false));
		console.log("[9,9,9,0] ? " + numberToLeftPaddedArray(999.0, "0", 4, true));
		console.log("[0,9,9,9] ? " + numberToLeftPaddedArray(999.0, "0", 4, false));
		console.log("[9,9,9,0] ? " + numberToLeftPaddedArray(9999, "0", 4, true));
		console.log("[9,9,9,9] ? " + numberToLeftPaddedArray(9999, "0", 4, false));
		console.log("[9,9,9,9] ? " + numberToLeftPaddedArray(999.9, "0", 4, true));
		console.log("[0,9,9,9] ? " + numberToLeftPaddedArray(999.9, "0", 4, false));
//		console.log($('#charityScroller').scroller("getValue"));
		$('#charityScroller').scroller("setValue", numberToLeftPaddedArray("314", "0", 4, false));
		$('#charityScroller').scroller("scrollToSetValue");
		console.log("[0,3,1,4]? " + $('#charityScroller').scroller("getValue"));

		$('#weightScroller').scroller("setValue", numberToLeftPaddedArray("91.2", "0", 4, true));
		$('#weightScroller').scroller("scrollToSetValue");
		console.log("[0,9,1,2]? " + $('#weightScroller').scroller("getValue"));

		console.log("0 ? " + arrayToNumber([0,0], true));
		console.log("0 ? " + arrayToNumber([0,0], false));
		console.log("0.1 ? " + arrayToNumber([0,1], true));
		console.log("1 ? " + arrayToNumber([0,1], false));
		console.log("91.2 ? " + arrayToNumber([0,9,1,2], true));
		console.log("912 ? " + arrayToNumber([0,9,1,2], false));
		console.log("91.2 ? " + arrayToNumber([9,1,2], true));
		console.log("912 ? " + arrayToNumber([9,1,2], false));

		$(".transientlyActiveButton").removeClass("ui-btn-active");
		$("#divSaveWeight").hide().trigger("updatelayout");
		*/
	});
	
	$(".slow-food-icon").click(handleSlowFoodTimerClick);
	$(".toolbar-button").click(toolbarButtonClick);
	$("#buttonMe").addClass("ui-btn-active");
	$("#divMe").addClass("showing");
	
	$("#divSaveWeight").hide().trigger("updatelayout");

	hideLoadingOverlay();
}


var toolbarButtonClick = function() {
	cancelSavingWeightAndCharity();
	var buttonSelector = this.id;
	var divSelector = "#div" + buttonSelector.substring(6);
	if($(divSelector).hasClass("showing")){
		return;
	}
	if(buttonSelector == "buttonSound"){
		if($("#buttonSound").attr("data-icon") == "check") {
			showSoundEnabled(false);
			pauseAudio();
		}else {
			showSoundEnabled(true);
			playAudio();
		}
		if($("#divMe").css("display") != "none"){
			buttonSelector = "buttonMe";
		}
		if($("#divFacebook").css("display") != "none"){
			buttonSelector = "buttonFacebook";
		}
		if($("#divSlowFood").css("display") != "none"){
			buttonSelector = "buttonSlowFood";
		}
	}
	activateMutuallyExclusiveButton("#" + buttonSelector, ".toolbar-button");
	if(buttonSelector == "buttonMe"){
		toggleContentView("#divMe");
		$(".ui-body-c").css('background', 'url(img/oak.jpg)');
	}
	if(buttonSelector == "buttonFacebook"){
		toggleContentView("#divFacebook");
		$(".ui-body-c").css('background', 'url(img/oak.jpg)');
	} 
	if(buttonSelector == "buttonSlowFood"){
		toggleContentView("#divSlowFood");
		$(".ui-body-c").css('background', 'url(img/oak.jpg)');
	}

};

function showSoundEnabled(boolChoice){
	if(boolChoice == true){
		$("#buttonSound").attr("data-icon","check");
		$("#buttonSound").children().children().next().removeClass('ui-icon-delete').addClass('ui-icon-check');
	}else{
		$("#buttonSound").attr("data-icon","delete");
		$("#buttonSound").children().children().next().removeClass('ui-icon-check').addClass('ui-icon-delete');
	}
}


function toggleContentView(fadeInSelector){
	var selector = "#" + $(".showing")[0].id;
	$(".showing").each(function(){$(this).removeClass("showing");});
	$(selector).css("display", "none"); //fadeToggle("slow");
	$(selector).promise().done(function() {
		$(fadeInSelector).addClass("showing");
		//$(fadeInSelector).css({'display':'-webkit-box !important','display':'box !important'});
		$(fadeInSelector).css('display','-webkit-box');
		//$(fadeInSelector).fadeIn(2000);
	});
}

function activateMutuallyExclusiveButton(buttonSelector, buttonGroupSelector){
	$(buttonGroupSelector).removeClass("ui-btn-active");
	$(buttonSelector).addClass("ui-btn-active");
}