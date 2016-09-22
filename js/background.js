// get window local storaage 
function getWindowLocalStorage(){
	return window.localStorage;
}

// get the current time using moment.js
function getCurrentTime(){
	return moment().format('MM-DD-YY hh:mm:ss');
}

// receive broadcast message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// check, if the message is for updating the list
	if(request.message == "update_remove_list"){
		// get the key from the request
		var key = request.key;
		// get the url from the request
		var url = request.url;
		insertOrUpdateToLocalStorage(key, url);
	}
});

function insertOrUpdateToLocalStorage(key, url){
	// get the window local storage
	var localStorage = getWindowLocalStorage();
	// get the stored value by key
	var storedValue = localStorage[key];
	// get the data from the local storage for that  key
	var data = storedValue ? JSON.parse(storedValue) : false;
	if(data){
		// get the removed array
		var removed = data.removed;
	console.log(url);
	console.log(data);
		// if the url exists in removed array
		if(!(url in removed)){
			// push this into the array
			removed.push(url);
		}
		localStorage[key] = JSON.stringify({
			removed: removed
		});
	}
}