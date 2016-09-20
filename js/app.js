function getWindowLocalStorage(){
	return window.localStorage;
}

var UserCollection = Vue.extend({
	template: '#user-collection',
	data () {
		return {
			newCollectionText: ''
		};
	},
	props: ['row'],
	methods: {
		updateCollectionText: function (key) {
			var text = this.newCollectionText.trim();
			if(!text){
				alert('Must enter a something');
				return;
			}
			this.$parent.saveToLocalStorage(text, key);
			this.$parent.getStoredList();
		},
		deleteText: function(key){
			getWindowLocalStorage().removeItem(key);
			this.$parent.getStoredList();
			this.$parent.broadcastMessage();
		}
	}
});

Vue.component('user-collection', UserCollection);

var application = new Vue({
	el: "#app",
	data:{
		rows: [],
		text: ""
	},
	methods: {
		moment: function () {
			return moment();
		},
		getStoredList: function () {
			this.rows = [];
			var localStorage = getWindowLocalStorage();
			var length = localStorage.length;
			for (var i = 0; i < length; i++) {
				var key = localStorage.key(i);
				var text = localStorage[key];
			    this.rows.push({
			    	key: key, 
			    	text: text
			    });
			}
		},
		addToList: function () {
			var text = this.text.trim();
			if(!text){
				alert('Must enter a something');
				return;
			}
			this.saveToLocalStorage(text);
			this.text = "";
			this.getStoredList();
		},
		getCurrentTime: function () {
			return this.moment().format('MM-DD-YY hh:mm:ss');
		},
		saveToLocalStorage: function(text, key) {
			// if the key is not passed as function parameter
			key = key || this.getCurrentTime();
			var value = text;
			var localStorage = getWindowLocalStorage();
			localStorage[key] = value;
			this.broadcastMessage();
			return;
		},
		broadcastMessage: function () {
			var message = "grab_new_list";
			var that = this;
			chrome.tabs.query({url: "*://*.facebook.com/*"}, function(tabs) {
				tabs.forEach(function(tab) {
					console.log('sending request-app.js');
					chrome.tabs.sendMessage(tab.id, {
						message: message,
						list: that.rows
					}, function(response) {
						
				    });
				});
			});
		}
	},
	computed: {
		filteredRows: function () {
			return this.rows.filter(function(row){
				console.log(row.text.indexOf(this.text));
				return row.text.indexOf(this.text) > -1;
			}.bind(this));
		}
	},
	ready: function(){
		this.getStoredList();
	}
});