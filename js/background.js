// save the data to local storage
function saveData(key, value){
	window.localStorage[key] = JSON.stringify(value);
}

// get the current time using moment.js
function getCurrentTime(){
	return moment().format('MM-DD-YY hh:mm:ss');
}