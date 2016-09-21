function getWindowLocalStorage(){
	return window.localStorage;
}

function saveToLocalStorage(key){
	var localStorage = getWindowLocalStorage();
	// check if the key exists in local storage already
	var data = localStorage[key];
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

var Home = Vue.extend({
	template: '#home',
	data () {
		return {
			rows: []
		};
	},
	props: ['selectedTab'],
	methods: {
		fetchList: function(){
			this.rows = [];
			var localStorage = getWindowLocalStorage();
			var length = localStorage.length;
			for(var i = 0; i < length; ++i){
				var key = localStorage.key(i);
				var data = localStorage[key];
				var keyObject = JSON.parse(data);
				this.rows.push({
					key: key,
					removed: keyObject.removed
				});
				
			}
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
	props: ['selectedTab']
});

var SearchBar = Vue.extend({
	template: '#search-bar',
	data () {
		return {
			filterText: ''
		};
	},
	props: [],
	methods: {
		addItemToList: function(){
			var key = this.filterText.trim();
			if(!key){
				alert("FFS, Remove spaces and enter some chars.");
				return;
			}
			saveToLocalStorage(key);
			this.filterText = "";
		}
	}
});

var FilterList = Vue.extend({
	template: "#filter-list",
	data () {
		return {};
	},
	props: ['rows']
});

var UserCollection = Vue.extend({
	template: "#user-collection",
	data () {
		return {
			newFilterText: ''
		};
	},
	props: ['row'],
	methods: {
		updateItem: function(key){
			var newText = this.newFilterText.trim();
			if(!newText){
				alert("FFS, Remove spaces and enter some chars.");
				return;
			}
			var localStorage = getWindowLocalStorage();
			var data = localStorage[newText];
			if(data){
				// ask user for permission
				var answer = confirm("Already exists, would like remove previous data?");
				// if he cancels, return
				if(!answer){
					return;
				}
			}
			this.deleteItem(key);
			// set an object with empty array of links
			// for the key, that is going to be stored
			localStorage[newText] = JSON.stringify({
				removed: []
			});
		},
		deleteItem: function(key){
			getWindowLocalStorage().removeItem(key);
		}
	}
})

Vue.component('home', Home);
Vue.component('log', Log);
Vue.component('search-bar', SearchBar);
Vue.component('filter-list', FilterList);
Vue.component('user-collection', UserCollection);

var vm = new Vue({
	el: '#app',
	data: {
		selectedTab: "home"
	}
});