// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var App = { lastPosition: null };

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );
    
    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        var locateBtn = document.getElementById('main--locationBtn');
        locateBtn.addEventListener('click', locate);
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
    function locate() {
        //This is a synchronous call--will the UI remain responsive if it times out?        
        //Make it a promise?
        navigator.geolocation.getCurrentPosition(function (position) {
            //Save for share; the default address string just has the coordinates if we can't get a text address
            //from the Bing Maps web API.
            App.lastPosition = {
                latitude: position.coords.latitude, longitude: position.coords.longitude,
                address: "(" + position.coords.latitude + ", " + position.coords.longitude + ")"
            };

            //Go translate the coordinates into an address using the Bing Map web API
            updatePosition();
        }, function (error) {
            console.log("Unable to get location: " + error.message);
        }, {
            maximumAge: 3000, timeout: 6000, enableHighAccuracy: true
        });
    }


    function updatePosition() {
        //Attempt to get a formatted address from Bing Maps.
        //NOTE: visit <TODO: site> to obtain your own Bing Maps API key.
        var apiKey = "ApCEku8pD0LH16amkHjQ4Y4Dp-uqyQjvabdbUp3ecTUAPg4sG6nmJLtsp4W37Ux1";
        var url = "http://dev.virtualearth.net/REST/v1/Locations/" + App.lastPosition.latitude + ","
            + App.lastPosition.longitude + "?o=json&key=" + apiKey;

        var locationOutput = document.getElementById("main--txtLocation");

        //Invoke the web API--WinJS.xhr wraps XMLHttpRequest into a promise. If this call fails,
        //App.lastPosition.address has the default location string already containing just the coordinates.
        $.ajax({
            url: url,
        }).done(function (result) {
            if (result.responseText) {
                var response = JSON.parse(result.responseText);
                var address = null;

                //Dig down into the JSON response for the address, checking that there's data
                //every step of the way.
                address = response && response.resourceSets && response.resourceSets[0]
                    && response.resourceSets[0].resources && response.resourceSets[0].resources[0]
                    && response.resourceSets[0].resources[0].address.formattedAddress;

                if (address != null && App.lastPosition != null) {
                    App.lastPosition.address = address;
                }
            }
           

            locationOutput.value = App.lastPosition.address;
            var map = new Microsoft.Maps.Map(document.getElementById("main--mapDiv"),
                          {
                              credentials: "AhTTNOioICXvPRPUdr0_NAYWj64MuGK2msfRendz_fL9B1U6LGDymy2OhbGj7vhA",
                              center: new Microsoft.Maps.Location(App.lastPosition.latitude, App.lastPosition.longitude),
                              mapTypeId: Microsoft.Maps.MapTypeId.road,
                              zoom: 7
                          });
            //search_createMapPin(result, map);

        }, function (e) {
            console.log("Request to Bing Maps failed, using coordinates directly");
            if (App.lastPosition != null) {
                locationOutput.value = App.lastPosition.address;
            }
        });
    }
} )();