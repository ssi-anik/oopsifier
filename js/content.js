var collection = [];
var news_feed_user_content_container_parent_array = ['._5jmm'];
var news_feed_user_content_container_array = ['.userContent']

function getWindowLocalStorage(){
	return window.localStorage;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.message === "grab_new_list") {
    	updateCollection(request.list);
    	removeIfContainsInCollection();
    	//sendResponse({'message': 'list_updated'});
    }
});

function updateCollection(storageCollection){
	collection = [];
	for (var i = 0; i < storageCollection.length; i++) {
		var text = storageCollection[i].text;
		collection.push(text);
	}
}

function removeIfContainsInCollection(){
	var availableNodes = $(document).find(joiner(news_feed_user_content_container_array));

	availableNodes.each(function(){
		var nodeText = $(this).text();
		if (new RegExp(collection.join("|"), 'i').test(nodeText)) {
		    $(this).closest(joiner(news_feed_user_content_container_parent_array)).remove();
		}
	});
}

function joiner(list){
	return list.join(", ");
}