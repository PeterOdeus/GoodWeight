var goodWeightDB = null;

document.addEventListener("deviceready", onDeviceReady_db, false);

function onInitialDatabasePopulation() {
	console.log("onInitialDatabasePopulation");
	goodWeightModelState.removeEventListener("onInitialDatabasePopulation");
	fireUpGui();
}

// PhoneGap is ready

function onDeviceReady_db() {
	getDB().transaction(createDbTables, errorInTransaction,
			successCreatingDbTables);
}

function setTodaysDate(){
	console.log("inside function setTodaysDate()");
	getDB().transaction(queryDateToday, errorInTransaction);
}

function insertLatestWeight(){
	console.log("inside function insertLatestWeight()");
	getDB().transaction(insertWeight, errorInTransaction);
}

function updateLatestWeight(){
	console.log("inside function updateLatestWeight()");
	getDB().transaction(updateWeight, errorInTransaction);
}

function insertCharitySum(){
	console.log("inside function insertCharitySum()");
	getDB().transaction(insertCharity, errorInTransaction);
}

function updateCharitySum(){
	console.log("inside function updateCharitySum()");
	getDB().transaction(updateCharity, errorInTransaction);
}

function getAverageWeightChange(){
	console.log("inside function getAverageWeightChange");
	getDB().transaction(queryAverageWeight, errorInTransaction);
}

// Populate the database

function createDbTables(tx) {
	//tx.executeSql('DROP TABLE IF EXISTS WEIGHT');
	tx.executeSql('CREATE TABLE IF NOT EXISTS WEIGHT (id unique, sample_date TEXT, weight NUMERIC)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS CHARITY (id unique, sum NUMERIC)');
	
	/*tx.executeSql('INSERT INTO WEIGHT (id, sample_date, weight) VALUES (1, "2012-01-23", 95.2)');
	tx.executeSql('INSERT INTO WEIGHT (id, sample_date, weight) VALUES (2, "2012-01-29", 94.3)'); //avg = 94.75
	tx.executeSql('INSERT INTO WEIGHT (id, sample_date, weight) VALUES (3, "2012-01-30", 94.0)');
	tx.executeSql('INSERT INTO WEIGHT (id, sample_date, weight) VALUES (4, "2012-02-05", 93.2)'); //avg = 93.6 -> 93.6 - 94.75 = -1.151 ~ 1.2 :)
	*/
	// tx.executeSql('INSERT INTO WEIGHT (id, sample_date, weight) VALUES (2,
	// "2012-01-06", 95.1)');
	// tx.executeSql('INSERT INTO WEIGHT (id, sample_date, weight) VALUES (3,
	// "2012-01-07", 95.0)');
}
//Average Weight query
//
//
function queryAverageWeight(tx) {
	tx.executeSql("SELECT ROUND((first_week.avg_weight - second_week.avg_weight),1) AS weight_delta FROM "
			+"(SELECT AVG(weight) as avg_weight FROM WEIGHT WHERE sample_date BETWEEN (SELECT date('now','start of day','-6 day')) AND (SELECT date('now'))"
			+ ") AS first_week"
			+", (SELECT AVG(weight) as avg_weight FROM WEIGHT WHERE sample_date BETWEEN (SELECT date('now','start of day','-14 day')) AND (SELECT date('now','start of day','-7 day'))"
			+ ") AS second_week"
			+ ";", [],
			function (tx, results) {
				// the number of rows returned by the select statement
				console.log("SELECT average weight row length: " + results.rows.length);
				if (results.rows.length != 0) {
					console.log("Average WEIGHT: " + results.rows.item(0).weight_delta);
					weightModel.setWeightDelta(results.rows.item(0).weight_delta);
				}
				goodWeightModelState.setWeightDeltaPopulated(true);
			},
			function (err) {
				console.log("Error querying average weight: " + err);
			}
	);
}
// Transaction success callback

function successCreatingDbTables() {
	console.log("Succeeded creating GoodWeight DB");
	goodWeightModelState.addEventListener("onInitialDatabasePopulation", [
			"dateModel", "weightModel", "weightModel_weightDelta", "charityModel", "htmlBody" ],
			onInitialDatabasePopulation);
	getDB().transaction(queryDateToday, errorInTransaction);
	getDB().transaction(queryTopDateWeight, errorInTransaction);
	getDB().transaction(queryCharitySum, errorInTransaction);
	getDB().transaction(queryAverageWeight, errorInTransaction);
}

// Transaction error callback
function errorInTransaction(err) {
	console.log("Error in GoodWeight DB transaction: " + err);
	alert("Error in GoodWeight DB transaction. Sorry :(: " + err);
}

// Charity sum query

function queryCharitySum(tx) {
	tx.executeSql("SELECT * FROM CHARITY;", [], 
			function (tx, results) {
				// the number of rows returned by the select statement
				console.log("SELECT * FROM CHARITY. Row count = "
						+ results.rows.length);
				if (results.rows.length != 0) {
					console.log("SELECT * FROM CHARITY. Data: \n"
									+ results.rows.item(0).id + "\t"
									+ results.rows.item(0).sum);
					charityModel.setValues(results.rows.item(0).sum);
				}else{
					charityModel.setValues(0);
				}
				goodWeightModelState.setCharityModelPopulated(true);
			}, 
			function (err) {
				console.log("Error querying charity sum: " + err);
				alert("Error querying charity sum: " + err);
			}
	);
}

//Insert Charity
//
//
function insertCharity(tx) {
	var tempTotalSum = charityModel.tempCharitySum;
	tx.executeSql('INSERT INTO CHARITY (id, sum) VALUES (?,?);',
			[0, tempTotalSum], 
			function () {
				console.log("Insert Charity successful");
				charityModel.setValues(tempTotalSum);
				goodWeightModelState.setCharityModelPopulated(true);
			},
			function (err) {
				console.log("Error inserting charity sum: " + err);
				alert("Error inserting charity sum: " + err);
			}
	);
}

//Update Charity
//
//
function updateCharity(tx) {
	var tempTotalSum = charityModel.tempCharitySum + charityModel.totalSum;
	tx.executeSql('UPDATE CHARITY SET SUM=? WHERE ID=0;',
			[tempTotalSum], 
			function () {
				console.log("Update charity sum successful");
				charityModel.setValues(tempTotalSum);
				goodWeightModelState.setCharityModelPopulated(true);
			},
			function (err) {
				console.log("Error updating charity sum: " + err);
				alert("Error updating charity sum: " + err);
			}
	);
}



// Insert Weight
//
//
function insertWeight(tx) {
	tx.executeSql('INSERT INTO WEIGHT (id, sample_date, weight) VALUES (?,?,?);',
			[weightModel.latestId + 1, dateModel.today, weightModel.tempWeight], 
			function () {
				console.log("Insert Weight successful");
				weightModel.setValues(weightModel.latestId + 1, dateModel.today, weightModel.tempWeight);
				goodWeightModelState.setWeightModelPopulated(true);
				getDB().transaction(queryAverageWeight, errorInTransaction);
			},
			function (err) {
				console.log("Error inserting weight: " + err);
				alert("Error inserting weight: " + err);
			}
	);
}

//Update Weight
//
//
function updateWeight(tx) {
	tx.executeSql('UPDATE WEIGHT SET WEIGHT=? WHERE ID=?;',
			[weightModel.tempWeight, weightModel.latestId], 
			function () {
				console.log("Update Weight successful");
				weightModel.setValues(weightModel.latestId, dateModel.today, weightModel.tempWeight);
				goodWeightModelState.setWeightModelPopulated(true);
				getDB().transaction(queryAverageWeight, errorInTransaction);
			},
			function (err) {
				console.log("Error updating weight: " + err);
				alert("Error updatiing weight: " + err);
			}
	);
}

// Top Date Weight query
//
//
function queryTopDateWeight(tx) {
	tx.executeSql("SELECT * FROM WEIGHT ORDER BY sample_date DESC LIMIT 1;", [],
			function (tx, results) {
				// the number of rows returned by the select statement
				console.log("SELECT * FROM WEIGHT. Row count = " + results.rows.length);
				if (results.rows.length != 0) {
					console.log("SELECT * FROM WEIGHT. Data: \n" + results.rows.item(0).id
							+ "\t" + results.rows.item(0).sample_date + "\t"
							+ results.rows.item(0).weight);
					weightModel.setValues(results.rows.item(0).id,
							results.rows.item(0).sample_date, results.rows.item(0).weight);
				}
				goodWeightModelState.setWeightModelPopulated(true);
			},
			function (err) {
				console.log("Error querying top date weight: " + err);
			}
	);
}



// Today's date query
//
//
function queryDateToday(tx) {
	tx.executeSql("SELECT date('now') AS today;", [], 
			function (tx, results) {
				// the number of rows returned by the select statement
				console.log("SELECT date('now'). Row count = " + results.rows.length
						+ ". Data: " + results.rows.item(0).today);
				dateModel.setToday(results.rows.item(0).today);
				goodWeightModelState.setDateModelPopulated(true);
			},
			function (err) {
				console.log("Error querying today\'s date : " + err);
			}
	);
}


function getDB() {
	if(goodWeightDB == null){
		goodWeightDB = window.openDatabase("GoodWeightDB", "1.0", "GoodWeight DB", 1000000);
	}
	return goodWeightDB;
}