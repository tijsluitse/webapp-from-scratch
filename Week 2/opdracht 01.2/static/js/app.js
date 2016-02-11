/*
    Credits:    https://github.com/kasszz/
                https://github.com/beemstb002/
                https://github.com/SemBakkum/
*/

(function() {
    // Add strict mode - With strict mode, you can not, for example, use undeclared variables.
	'use strict';
	
    // App object 
	var app = {
        // init method in app that calls the init method in the routes object
		init: function() {
            routes.init();
            
             // Routie JS - excercise #2 / switch between sections
            routie ({
                // if the has = home, toggle the sections to home
                'home': function() {
                   sections.toggle('home');
                },
                // if the hash = api, toggle the sections to api
                'api': function() {
                    sections.toggle('api');
                },    
                'albumDetails': function() {
                    sections.toggle('albumDetails');
                }
            });
		}
	};

    // Routes object
	var routes = {
		init: function() {
            
            // Get the data using microAjax
            microAjax('http://ws.audioscrobbler.com/2.0/?api_key=254649321e04bd3469d4780384df34b8&artist=sting&method=artist.getTopAlbums&format=json', function(data){
                
                data = JSON.parse(data);
                
                //test to check if data is available
                console.log(data);
                
                var songData = {
                    title: data.topalbums.album[40].name,
                    playcount: data.topalbums.album[40].playcount,
                    artist: data.topalbums.album[0].artist.name,
                    url: data.topalbums.album[40].url,
                };
                
                // Check if songdata is available
                console.log(songData);
                			
				Transparency.render(document.getElementById('api'), songData);
                Transparency.render(document.getElementById('albumDetails'), songData);
			})

		}
	};

     
	 var sections = {
        // toggle function with parameter route
	 	toggle: function(route) {
            // variable that returns a list of all the section elements
            var allSections = document.querySelectorAll('section');
			var toggleSection = document.getElementById(route);
            
            // checking if toggle works
			console.log(toggleSection);

			// Source For Loop Sem Bakkum: https://github.com/SemBakkum/SemBakkum.github.io/tree/master/WAFS/Week%201/Exercise%205
			for (var i = 0; i < allSections.length; i++) {
				allSections[i].classList.remove('active');
			}
            // add active class to current route
			toggleSection.classList.toggle('active');

	 	}
	 };
    
    // Start the app
	app.init();

}());