/*
    Credits:    https://github.com/kasszz/
                https://github.com/beemstb002/
                https://github.com/SemBakkum/
                https://github.com/reauv - really helped me with de details section
*/

(function() {
    // Add strict mode - With strict mode, you can not, for example, use undeclared variables.
	'use strict';
	
    // App object 
	var app = {
        // init method in app that calls the init method in the routes object
		init: function() {
            
             // Routie JS - excercise #2 / switch between sections
            routie ({
                // if the has = home, toggle the sections to home
                'home': function() {
                   sections.toggle('home');
                },
                // if the hash = api, toggle the sections to api
                'api': function() {
                    routes.albumList();
                    sections.toggle('api');
                },    
                // toggle if hash = album/ + id
                'album/:id': function(id) {
                    routes.albumDetail(id);
                    sections.toggle('albumDetails');
                }
            });
		}
	};

    // Routes object
	var routes = {
		albumList: function() {
            var apiUrl = 'http://ws.audioscrobbler.com/2.0/?api_key=254649321e04bd3469d4780384df34b8&artist=sting&method=artist.getTopAlbums&format=json'; 
            
            // Get the data using microAjax
            microAjax(apiUrl, function(data) {
                
                // Parse the data
                data = JSON.parse(data);
                
                //test to check if data is available
                console.log(data);
                
                // filter de data and add an id to it using index
                var filteredData = _.map(data.topalbums.album, function(post, index){
                    return _.extend({id: index}, _.pick(post, 'name'));
                })
                
                console.log(filteredData);
                
                var albumTitle = {
                    topalbums: filteredData
                };
                
                // nested directives
                //directives = an object
                var directives = {
                    topalbums: {
                        link: {
                            href: function() {
                                // link based on album id
                                return '#album/' + this.id;
                            }
                        }
                    }
                }
                 
                // render albumTitle and directives
				Transparency.render(document.getElementById('api'), albumTitle, directives);
			})
        },
        
        //albumDetail function with id parameter
        albumDetail: function (id) {
            // load api again
            var apiUrl = 'http://ws.audioscrobbler.com/2.0/?api_key=254649321e04bd3469d4780384df34b8&artist=sting&method=artist.getTopAlbums&format=json'; 
            
            // Get the data using microAjax
            microAjax(apiUrl, function(data) {
                
                // Parse the data
                data = JSON.parse(data);
                
                //test to check if data is available
                console.log(data);
                
                // filter de data and add an id to it using index
                var filteredData = _.map(data.topalbums.album, function(post, index){
                    return _.extend({id: index}, _.pick(post, 'name', 'playcount', 'url', 'artist'));
                })
                
                console.log(filteredData);
                
                // album variable = the album with the id
                var album = filteredData[id];
                
                // Render albumDetails
				Transparency.render(document.getElementById('albumDetails'), album);
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
			// console.log(toggleSection);

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