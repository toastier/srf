'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('sidebar', 'Articles', 'articles');
		//Menus.addMenuItem('sidebar', 'New Article', 'articles/create');
	}
]);