var collection = [];
var news_feed_user_content_container_parent_array = ['._5jmm'];
var news_feed_user_content_container_array = ['.userContent']
var news_anchor_array = ['._5pcq', '.uiStreamSponsoredLink'];

// chrome broadcast message receiver
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// check the passed message
    if(request.message === "grab_new_list") {
    	// get the list from the request and update current script COLLECTION variable
    	updateCollection(request.list);
    	// remove the contents from the feed as the list updates
    	// only call the method if the collection has any value
    	if(collection.length){
    		removeIfContainsInCollection();
    	}
    }
});

function updateCollection(storageCollection){
	// re initialize the variable to empty array
	collection = [];
	// loop upto the storage length - 1
	for (var i = 0; i < storageCollection.length; i++) {
		// get the text from passed array
		var text = storageCollection[i];
		// check if the variable is empty
		if(!text){
			// then continue
			continue;
		}
		// push to collection otherwise
		collection.push(text);
	}
}

// remove the contents from the facebook news feed based on the collection user has given
function removeIfContainsInCollection(){
	// get the list of nodes present in the news feed
	var availableNodes = $(document).find(joiner(news_feed_user_content_container_array));

	// loop through all the nodes
	availableNodes.each(function(){
		// get the current feed text
		var nodeText = $(this).text();
		// build the regex, case insensitive
		var re = new RegExp(collection.join("|"));
		// match the regex for the collection of filter text with the node text
		var key = nodeText.match(re);
		if (key !== null) {
			// get the root of the news
		    var root = $(this).closest(joiner(news_feed_user_content_container_parent_array));
		    // get the anchor tag of the news
		    var anchor = root.find(joiner(news_anchor_array));
		    // extract the url and get the absolute one
		    var url = getAbsoluteUrl(anchor.attr('href'));
		    // remove the feed entirely.
		    //root.remove();
		    // save the matched content with the url
		    saveData(key, url);
		}
	});
}

function joiner(list){
	return list.join(", ");
}

function getAbsoluteUrl (relative){

	var url = relative.indexOf("facebook.com") == -1 ? "http://facebook.com" + relative : relative;
	return url;
}

function save (key, url) {
	// send a broadcast to background
}