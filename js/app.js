var googleSuccess = function () {
  "use strict";

  //Global variables

  var latlng = {
    lat: 41.03745,
    lng: 28.97761
  };


  /*----------------- Model---------------*/
  var placesList = [
    {
      name: 'Galata Kulesi - Galata Tower',
      address: 'Bereketzade Mh., Galata Kulesi, Beyoğlu/İstanbul, Turkey',
      info: "Called Christea Turris — is a medieval stone tower",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=41.025635,28.974169",
      location: {
        lat: 41.025634,
        lng: 28.974169
      }
      },
    {
      name: 'Hagia Sofia - Basilica',
      address: 'Sultanahmet Mh., Ayasofya Meydanı, 34122 Fatih/İstanbul, Turkey ',
      info: "Former Christian patriarchal basilica",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=Hagia+Sophia&heading=150.78&pitch=-1.76",
      location: {
        lat: 41.008138,
        lng: 28.978401
      }
    },
    {
      name: 'Sultanahmet Mosque - Blue Mosque',
      address: 'Sultanahmet Mh., At Meydanı No:7, 34122 Fatih/İstanbul, Turkey',
      info: "Historic mosque in Istanbul",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=Sultanahmet+Square&heading=78&pitch=-1.76",
      location: {
        lat: 41.007273,
        lng: 28.973736
      }
    },
    {
      name: 'Dolmabahçe Palace - Glamourous Palace',
      address: 'Vişnezade Mh., Dolmabahçe Cd., 34357 Beşiktaş/İstanbul, Turkey',
      info: "Served as main administrative center of the Ottoman Empire",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=41.03937,28.9983633&heading=150.78&pitch=-1.76",
      location: {
        lat: 41.03937,
        lng: 28.9983633
      }
    },
    {
      name: 'Kiz Kulesi - Maiden Tower',
      address: 'Salacak, Üsküdar Salacak Mevkii, 34668 Üsküdar/İstanbul, Turkey',
      info: "Tower lying on a small islet located at the southern entrance of the Bosphorus",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=41.020918,29.004056&heading=400.78&pitch=-1.76",
      location: {
        lat: 41.020918,
        lng: 29.004056
      }
    }
  ];
  /*Place object holding addresses and places*/
  function Place(data) {
    this.name = data.name;
    this.address = data.address;
    this.info = data.info;
    this.streetView = data.streetView;
    this.location = data.location;
    this.marker = ko.observable(data.marker);
  }


  /*--------------- ViewModel---------------*/
  var ViewModel = function () {
    var self = this;

    // Initializing the google maps
    self.init = new google.maps.Map(document.getElementById('map-canvas'), {
      center: latlng,
      zoom: 13
    });


    // Initialize method to trigger event when clicking marker 
    // on the map
    self.clickedMarker = function (marker) {
      google.maps.event.trigger(this.marker, 'click');

    };

    // Creating google maps InfoWindow
    var contentString;
    self.infoWindow = new google.maps.InfoWindow({
      content: contentString

    });

    self.infoWindow.addListener('closeclick', function () {});

    // Empty array to hold the list of places
    self.listOfAllPlaces = ko.observableArray([]);
    placesList.forEach(function (place) {
      self.listOfAllPlaces.push(new Place(place));
    });


    self.makeLocationsVisible = ko.observableArray();
    self.markers = ko.observableArray([]);
    self.search = ko.observable();


    //Iterate through the list of locations and 
    //place markers on the map

    self.listOfAllPlaces().forEach(function (place) {
      var markerOptions = {
        map: self.init,
        position: place.location,
        name: place.name,
        animation: google.maps.Animation.DROP,
        content: contentString
      };

      //Create marker
      place.marker = new google.maps.Marker(markerOptions);

      // Create event listener for every marker
      place.marker.addListener('click', function () {
        contentString = '<div style="width:200px; height:200px"><h3>' + place.name + '</h3><p>' + place.address + '</p>' + '<h5>' + place.info + '</h5>' + '<img class="img-responsive" src=" ' + place.streetView + '"> ' + '</div>';

        // Don't forget to set the content of the infoWindow
        // to populate with the info from the array list
        self.infoWindow.setContent(contentString);
        self.infoWindow.open(self.init, place.marker);
        place.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
          place.marker.setAnimation(null);
        }, 800);
      });
      // Push the list to be visible in the View
      self.makeLocationsVisible.push(place);
      // Push the markers to be visible
      self.markers.push(place);
    });


    // This is an observable func that will hold user input
    self.userInput = ko.observable();

    // Create method to filter user input
    self.filterMarker = function () {
      var watchUserInput = self.userInput().toLowerCase();
      self.makeLocationsVisible.removeAll();
      self.infoWindow.close();
      self.listOfAllPlaces().forEach(function (place) {
        place.marker.setVisible(false);
        if (place.name.toLowerCase().indexOf(watchUserInput) !== -1) {
          self.makeLocationsVisible.push(place);
        }
      });

      self.makeLocationsVisible().forEach(function (place) {
        place.marker.setVisible(true);
      });
    };


    // Foursquare API USAGE
    var results, name, url, location, error, street ;


    self.listOfAllPlaces().forEach(function (place) {
        console.log(place);
        var sqlimit = 10;
        var client_id = '513QSIVTKBBQPSZ1BKL4XSRRK3AYINYHRTR0RP3ESOXVPZWU';
        var cl_srt = 'NJL5C1FIV153XZYAOFAHVJX3ODAF3QGNYJBEONSWIJE0UOWW';
        var fourSquareURL =
          'https://api.foursquare.com/v2/venues/search?client_id=' +
          client_id + '&client_secret=' + cl_srt + '&v=20131016&11' + '&ll=' + place.location.lat + ',' + place.location.lng + '&query=tips' + '&limit' + sqlimit;

        $.getJSON(fourSquareURL).done(function (data) {
          results = data.response.venues[0];
          place.name = results.name;
          place.url = results.hasOwnProperty('url') ? results.url : '';
          place.location = results.location.formattedAddress[0];


        }).error(function () {
          console.log("API could not be loaded");
          place.error = "the foursquare API could not be loaded";
        })
      }) //end forEach listofallplaces

  }; //end ViewModel


  ko.applyBindings(new ViewModel());

}; // end googleSuccess function

function googleError() {
  alert("google API unavailable");
}; // end googleError function