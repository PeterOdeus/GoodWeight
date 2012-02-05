function numberToLeftPaddedArray(number, paddingChar, totalAmountOfCharacters,
		treatAsDecimalNumber) {
	if(treatAsDecimalNumber == false){
		number = Math.floor(number);
	}
	var stringVal = "" + number;
	if (treatAsDecimalNumber == true && stringVal.indexOf(".") < 0) {
		stringVal += ".0";
	}
	stringVal = stringVal.replace(".", "");
	var paddedString = padLeft(stringVal, paddingChar, totalAmountOfCharacters);
	return paddedString.split("").map(function(x) {
		return parseInt(x, 10);
	});
}

/*
 * Make eg. string "10" to "0010" by padLeft("10","0",2);
 * */
function padLeft(val, ch, num) {
	var re = new RegExp(".{" + num + "}$");
	var pad = "";
	if (!ch)
		ch = " ";
	do {
		pad += ch;
	} while (pad.length < num);
	return re.exec(pad + val)[0];
}

function arrayToNumber(intArray, treatAsDecimal){
	var arrayOfIntegers = intArray.slice();
	while(arrayOfIntegers.length > 1 && arrayOfIntegers[0] == 0){
		arrayOfIntegers.shift();
	}
	if(treatAsDecimal == true){
		var decimalInt = arrayOfIntegers.pop();
		arrayOfIntegers.push(".");
		arrayOfIntegers.push(decimalInt);
		return parseFloat(arrayOfIntegers.join(""));
	}else{
		return parseInt(arrayOfIntegers.join(""));
	}
	
}

//Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(
			window.location.href.indexOf('?') + 1).split('&');
	for ( var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}