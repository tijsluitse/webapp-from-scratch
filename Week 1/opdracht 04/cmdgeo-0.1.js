/***
* cmdaan.js
*   Bevat functies voor CMDAan stijl geolocatie welke uitgelegd
*   zijn tijdens het techniek college in week 5.
*
*   Author: J.P. Sturkenboom <j.p.sturkenboom@hva.nl>
*   Credit: Dive into html5, geo.js, Nicholas C. Zakas
*
*   Copyleft 2012, all wrongs reversed.
*/

(function(){
    'use strict';
    
    var keyValues = {
        //constants
        LINEAR = "LINEAR",
        GPS_AVAILABLE: 'GPS_AVAILABLE',
        GPS_UNAVAILABLE: 'GPS_UNAVAILABLE',
        POSITION_UPDATED: 'POSITION_UPDATED',
        REFRESH_RATE: 1000,

        locationRow: [],
        markerRow: [],

        currentPosition: false,
        currentPositionMarker: false,
        customDebugging: false,
        debugId: false,
        map: false,
        interval: false,
        intervalCounter: false,
        updateMap: false
    };

    //Geo Loc Object
    var geoLoc = {
        // Test of GPS beschikbaar is (via geo.js) en vuur een event af
        init: function() {
            debugMessage("Controleer of GPS beschikbaar is...");

            ET.addListener(keyValues.GPS_AVAILABLE, _start_interval);
            ET.addListener(keyValues.GPS_UNAVAILABLE, function() {
                debug_message('GPS is niet beschikbaar.')}
                );

            (geoPositionJs.init())?ET.fire(keyValues.GPS_AVAILABLE):ET.fire(keyValues.GPS_UNAVAILABLE);
        }

        // Start een interval welke op basis van REFRESH_RATE de positie updated
        _startInterval: function(event) {
            debugMessage("GPS is beschikbaar, vraag positie.");
            _updatePosition();
            interval = self.setInterval(_updatePosition, keyValues.REFRESH_RATE);
            ET.addListener(POSITION_UPDATED, _checkLocations);
        }

        // Vraag de huidige positie aan geo.js, stel een callback in voor het resultaat
        _updatePosition: function(){
            intervalCounter++;
            geoPositionJs.getCurrentPosition(_setPosition, _geoErrorHandler, {enableHighAccuracy: true});
        }

        // Callback functie voor het instellen van de huidige positie, vuurt een event af
        _setPosition: function(position) {
            currentPosition = position;
            ET.fire("POSITION_UPDATED");
            debugMessage(intervalCounter + " positie lat:" + position.coords.latitude + " long:" + position.coords.longitude);
        }

        // Controleer de locations en verwijs naar een andere pagina als we op een locatie zijn
        _checkLocations: function(event) {
            // Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
            for (var i = 0; i < locations.length; i++) {
                var locatie = {coords:{latitude: locations[i][3], longitude: locations[i][4]}};

                if(_calculateDistance(locatie, currentPosition) < locations[i][2]){

                    // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
                    if(window.location!=locations[i][1] && localStorage[locations[i][0]] == false){
                        // Probeer local storage, als die bestaat incrementeer de locatie
                        try {
                            (localStorage[locations[i][0]] == false)?localStorage[locations[i][0]]=1:localStorage[locations[i][0]]++;
                        } catch(error) {
                            debug_message("Localstorage kan niet aangesproken worden: "+error);
                        }

        // TODO: Animeer de betreffende marker

                        window.location = locations[i][1];
                        debugMessage("Speler is binnen een straal van " + locations[i][2] + " meter van " + locations[i][0]);
                    } 
                }
            }
        }

        // Bereken het verchil in meters tussen twee punten
        _calculateDistance: function(p1, p2){
            var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
            var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
            return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
        }

    };


    // FUNCTIES VOOR DEBUGGING
    var debug = {
        _geoErrorHandler: function(code, message) {
            message('geo.js error ' + code + ': ' + message);
        }
        message: function(message){
            (keyValues.customDebugging && keyValues.debugId)?document.getElementById(keyValues.debugId).innerHTML:console.log(message);
        }
        setCustom: function(debugId){
            debugId = this.debugId;
            keyValues.customDebugging = true;
        }
    };


})();

var googleMap = {
    // GOOGLE MAPS FUNCTIES
/**
 * generate_map(myOptions, canvasId)
 *  roept op basis van meegegeven opties de google maps API aan
 *  om een kaart te genereren en plaatst deze in het HTML element
 *  wat aangeduid wordt door het meegegeven id.
 *
 *  @param myOptions:object - een object met in te stellen opties
 *      voor de aanroep van de google maps API, kijk voor een over-
 *      zicht van mogelijke opties op http://
 *  @param canvasID:string - het id van het HTML element waar de
 *      kaart in ge-rendered moet worden, <div> of <canvas>
 */
generateMap: function(myOptions, canvasId){
// TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
    debugMessage("Genereer een Google Maps kaart en toon deze in #" + canvasId)
    map = new google.maps.Map(document.getElementById(canvasId), myOptions);

    var routeList = [];
    // Voeg de markers toe aan de map afhankelijk van het tourtype
    debug_message("locations intekenen, tourtype is: " + tourType);
    for (var i = 0; i < locations.length; i++) {

        // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locations toe
        try {
            (localStorage.visited == undefined || isNumber(localStorage.visited))?localStorage[locations[i][0]] == false:null;
        } catch (error) {
            debugMessage("Localstorage kan niet aangesproken worden: " + error);
        }

        var markerLatLng = new google.maps.LatLng(locations[i][3], locations[i][4]);
        routeList.push(markerLatLng);

        keyValues.markerRow[i] = {};
        for (var attr in keyValues.locatieMarker) {
            keyValues.markerRow[i][attr] = keyValues.locatieMarker[attr];
        }
        keyValues.markerRow[i].scale = locations[i][2]/3;

        var marker = new google.maps.Marker({
            position: markerLatLng,
            map: map,
            icon: markerRow[i],
            title: locations[i][0]
        });
    }
    // TODO: Kleur aanpassen op het huidige punt van de tour
    if(tourType == keyValues.LINEAR){
        // Trek lijnen tussen de punten
        debugMessage("Route intekenen");
        var route = new google.maps.Polyline({
            clickable: false,
            keyValues.map: map,
            path: routeList,
            strokeColor: 'Black',
            strokeOpacity: .6,
            strokeWeight: 3
        });

        }

        // Voeg de locatie van de persoon door
        currentPositionMarker = new google.maps.Marker({
            position: mapOptions.center,
            map: map,
            icon: positionMarker,
            title: 'U bevindt zich hier'
        });

        // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
        ET.addListener(keyValues.POSITION_UPDATED, updatePositie);
    }

    isNumber: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // Update de positie van de gebruiker op de kaart
    updatePositie: function(event){
        // use currentPosition to center the map
        var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
        map.setCenter(newPos);
        currentPositionMarker.setPosition(newPos);
    }

};


