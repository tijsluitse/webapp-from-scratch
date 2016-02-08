/*
    Credits:    https://github.com/kasszz/web-app-from-scratch
                https://github.com/beemstb002/WebAppFromScratch
*/

(function() {
    // Add strict mode - With strict mode, you can not, for example, use undeclared variables.
	'use strict';
	
    // App object 
	var app = {
        // init method in app that calls the init method in the routes object
		init: function() {
            routes.init();
		}
	};

    // Routes object
	var routes = {
		init: function() {
            window.addEventListener('hashchange', function(tag){
                // call the toggle method in the sections object
                sections.toggle(tag.newURL.split('#')[1]);
            }, false);
		}
	};

    // Sections object
	var sections = {
		toggle: function(route) {
            console.log(route);
            if (route === 'home') {
                document.getElementById('bestPractices').classList.remove('active');
                document.getElementById('home').classList.add('active');
            } else if (route === 'bestPractices') {
                document.getElementById('bestPractices').classList.add('active');
                document.getElementById('home').classList.remove('active');
            }
		}
	};

	app.init();

}());