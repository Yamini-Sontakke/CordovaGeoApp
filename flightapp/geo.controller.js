sap.ui.controller("flightapp.geo", {
    

    findme: function () {
        this.locate();
    },

    locate: function () {
        var lastPosition = { latitude: null, longitude: null, address: null };
        navigator.geolocation.getCurrentPosition(
      function (position) {
          
          
          lastPosition = {
              latitude: position.coords.latitude, longitude: position.coords.longitude,
              address: "(" + position.coords.latitude + ", " + position.coords.longitude + ")"
          };
          
      },
      function () {
          alert('Error getting location');
      });

        this.updatePosition(lastPosition);
    },

    updatePosition: function (lastPosition) {
        
        var apiKey = "AhTTNOioICXvPRPUdr0_NAYWj64MuGK2msfRendz_fL9B1U6LGDymy2OhbGj7vhA";
        var url = "http://dev.virtualearth.net/REST/v1/Locations/" + lastPosition.latitude + ","
            + lastPosition.longitude + "?o=json&key=" + apiKey;

        var txt = document.getElementById("main--txtLocation");
        txt.value = lastPosition.address;
        var map = new Microsoft.Maps.Map(document.getElementById("main--mapDiv"),
                          {
                              credentials: "AhTTNOioICXvPRPUdr0_NAYWj64MuGK2msfRendz_fL9B1U6LGDymy2OhbGj7vhA",
                              center: new Microsoft.Maps.Location(lastPosition.latitude, lastPosition.longitude),
                              mapTypeId: Microsoft.Maps.MapTypeId.road,
                              zoom: 7
                          });

    }
});