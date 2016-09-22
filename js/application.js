// method for getting the window local storage variable
function getWindowLocalStorage(){
	return window.localStorage;
}


// save the new text as key
function saveToLocalStorage(key){
	// get the local storage
	var localStorage = getWindowLocalStorage();
	// check if the key exists in local storage already
	var data = localStorage[key];
	// if the data exists
	if(data){
		// ask user for permission
		var answer = confirm("Already exists, would like remove previous data?");
		// if he cancels, return
		if(!answer){
			return;
		}
	}
	// set an object with empty array of links
	// for the key, that is going to be stored
	localStorage[key] = JSON.stringify({
		removed: []
	});
	return;
}

var Application = Vue.extend({
	template: '#application',
	data () {
		return {
			tab: 'home',
			githubUrl: 'https://github.com/ssi-anik/oopsifier/issues',
			rows: []
		};
	},
	methods: {
		submitIssueToSource: function(){
			chrome.tabs.create({ url: this.githubUrl });
		}
	}
});

var Home = Vue.extend({
	template: '#home',
	data () {
		return {
			text: '',
		};
	},
	props: ['rows'],
	methods: {
		fetchList: function(){
			// remove all the previous data
			this.rows = [];
			// get the local storage variable
			var localStorage = getWindowLocalStorage();
			// length of the local storage rows
			var length = localStorage.length;
			// loop through
			for(var i = 0; i < length; ++i){
				// get the key of current row
				var key = localStorage.key(i);
				// get the data by key
				var data = localStorage[key];
				// parse the data
				var keyObject = JSON.parse(data);
				// push the data into the rows array
				this.rows.push({
					key: key,
					removed: keyObject.removed
				});
				
			}
			return this.rows;
		}
	},
	ready: function(){
		this.fetchList();
	}
});

var Log = Vue.extend({
	template: '#log',
	data () {
		return {};
	},
	props: ['rows'],
	computed: {
		showReport: function(){
			/*var number_of_links = this.rows.map(function(row){
				return row.removed.length;
			});
			console.log(number_of_links.reduce((p, c) => p+c));
			return false;*/
			return this.rows.map(function(row){
				return row.removed.length;
			}).reduce(function(previousValue, currentValue){
				return previous+current;
			});
		}
	}
});

var SearchBar = Vue.extend({
	template: '#search-bar',
	data () {
		return {};
	},
	props: ['filterText'],
	methods: {
		addItemToList: function(){
			// add a new text to the local storage
			// trim the string
			var key = this.filterText.trim();
			// if the string is empty
			if(!key){
				// show alert and return
				alert("FFS, Remove spaces and enter some chars.");
				return;
			}
			// pass to the method to save the text as key
			saveToLocalStorage(key);
			// re initialize the model value
			this.filterText = "";
			// fetch the filter list rows
			var lists = this.$parent.fetchList();
			vm.broadcastMessage(lists);
		}
	}
});

var FilterList = Vue.extend({
	template: "#filter-list",
	data () {
		return {};
	},
	props: ['rows', 'filterText'],
	computed: {
		filteredRows: function () {
			// computed property for 
			// showing the not found message on any search
			return this.filterText ? this.rows.filter(function(row){
				return row.key.indexOf(this.filterText) > -1;
			}.bind(this)) : this.rows;
		}
	}
});

var UserCollection = Vue.extend({
	template: "#user-collection",
	data () {
		return {
			// the text that'll be used to update the value, as key
			newFilterText: '',
			// the value, what was saved, if the new filter text is changed relative to this
			// show user a message to manually update the key by clicking or pressing enter.
			previousText: ''
		};
	},
	props: ['row'],
	methods: {
		updateItem: function(key){
			// trim the new text 
			var newText = this.newFilterText.trim();
			// check if the new text and the previous text is same
			if(newText == this.previousText){
				// nothing to do, return
				return;
			}
			// check if the new text is empty
			if(!newText){
				// show alert and return
				alert("FFS, Remove spaces and enter some chars.");
				return;
			}
			// ask user to delete the previous entry
			if(!confirm("Are you sure you want to update?")){
				// user didn't permit to update
				return;
			}
			// get the local storage variable
			var localStorage = getWindowLocalStorage();
			// get the data with the new text as key
			var data = localStorage[newText];
			// if the data exists already
			if(data){
				// ask user for permission
				var answer = confirm("Already exists, would like remove previous data?");
				// if he cancels, return
				if(!answer){
					return;
				}
			}
			// user permitted to delete the previous entry
			this.deleteItem(key);
			// add new entry
			// set an object with empty array of links
			// for the key, that is going to be stored
			localStorage[newText] = JSON.stringify({
				removed: []
			});
			// fetch the list again,
			// as it's updated, 
			// it's in parent => parent => method
			var lists = this.$parent.$parent.fetchList();
			// initialize the previous text variable
			this.initializePreviousText();
			vm.broadcastMessage(lists);
		},
		deleteItem: function(key){
			// get the window local storage and remove the item
			getWindowLocalStorage().removeItem(key);
			// fetch the list again with new data, as data is now removed
			var lists = this.$parent.$parent.fetchList();
			//vm.broadcastMessage(lists);
		},
		initializePreviousText: function(){
			// initialize the previous text with the new filter text,
			// as the help-block is going to show a message if the 
			// value of new filter text changes while typing something new
			this.previousText = this.newFilterText;
		}
	},
	ready: function () {
		// initialize the previous text value with new filter text
		this.initializePreviousText();
	}
});

var Report = Vue.extend({
	template: "#report",
	data () {
		return {};
	},
	props: ['row'],
	methods: {
		openUrl: function(url){
			chrome.tabs.create({ url: url });
		}
	}
})

Vue.component('application', Application);
Vue.component('home', Home);
Vue.component('log', Log);
Vue.component('search-bar', SearchBar);
Vue.component('filter-list', FilterList);
Vue.component('user-collection', UserCollection);
Vue.component('report', Report);

var vm = new Vue({
	el: '#app',
	data: {
		page: "home"
	},
	methods: {
		// broadcast a message to content script
		broadcastMessage: function (rows) {
			// map through all the rows
			rows = rows.map(function(row){
				// if object, return the key only,
				if(typeof row == "object"){
					return row.key;
				}
				return row;
			});
			var message = "grab_new_list";
			chrome.tabs.query({url: "*://*.facebook.com/*"}, function(tabs) {
				tabs.forEach(function(tab) {
					chrome.tabs.sendMessage(tab.id, {
						message: message,
						list: rows
					}, function(response) {
						
				    });
				});
			});
		}
	}
});