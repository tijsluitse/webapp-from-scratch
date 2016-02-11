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

            // Routie JS - excercise #2
            routie ({
                // Call the function when the hash == home
                'home': function() {
                    document.getElementById('api').classList.remove('active');
                    document.getElementById('home').classList.add('active');
                },
                // Call the function when the hash == api
                'api': function() {
                    document.getElementById('api').classList.add('active');
                    document.getElementById('home').classList.remove('active');
                }            
            });
    

		}
	};

    // Sections object
	// var sections = {
	// 	toggle: function() {

	// 	}
	// };

    // reqeust the data from the api using reqwest - excercise #1
    reqwest({
        url: 'http://ws.audioscrobbler.com/2.0/?api_key=254649321e04bd3469d4780384df34b8&artist=sting&method=artist.getTopAlbums&format=json', 
        method: 'post', 
        data: { foo: 'bar', baz: 100 }, 
        success: function (resp) {
            // qwery('#content').html(resp)
            console.log(resp);
            // Transparency Testing
            var hello = {
              greeting: "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn",
              translation: "In his house at R'lyeh, dead Cthulhu waits dreaming."
            };

            Transparency.render(document.getElementById('api'), hello);
            // sla de data op in een object
            var apiData = { resp };
        }
    })




	app.init();

}());