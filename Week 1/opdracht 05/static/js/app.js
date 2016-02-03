(function() {
	'use strict';
	
	var app = {
		init: function() {
            routes.init();
		}
	};

	var routes = {
		init: function() {
            window.addEventListener('hashchange', function(tag){
                sections.toggle(tag.newURL.split('#')[1]);
            }, false);
		}
	};

	var sections = {
		toggle: function(route) {
            console.log(route);
            if (route === 'home') {
                document.getElementById('bestPractices').style.display = 'none';
                document.getElementById('home').style.display = 'flex';
            } else if (route === 'bestPractices') {
                document.getElementById('bestPractices').style.display = 'flex';
                document.getElementById('home').style.display = 'none';
            }
		}
	};

	app.init();

}());