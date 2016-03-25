//"use strict";

var googleSuccess = function () {

  //Global variables
  var map, infoWindow, places;
  var latlng = {
    lat: 41.03745,
    lng: 28.97761
  };


  /*----------------- Model---------------*/
  var placesList = [
    {
      name: 'Galata Kulesi - Galata Tower',
      address: 'Bereketzade Mh., Galata Kulesi, Beyoğlu/İstanbul, Turkey',
      info: "famous historic passage",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=41.025635,28.974169",
      location: {
        lat: 41.025634,
        lng: 28.974169
      }
      },
    {
      name: 'Hagia Sofia - Basilica',
      address: 'Sultanahmet Mh., Ayasofya Meydanı, 34122 Fatih/İstanbul, Turkey ',
      info: "best fish sandwich",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=Hagia+Sophia&heading=150.78&pitch=-1.76",
      location: {
        lat: 41.008138,
        lng: 28.978401
      }
    },
    {
      name: 'Sultanahmet Mosque - Blue Mosque',
      address: 'Sultanahmet Mh., At Meydanı No:7, 34122 Fatih/İstanbul, Turkey',
      info: "New wet kebap and hamburgers",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=Sultanahmet+Square&heading=78&pitch=-1.76",
      location: {
        lat: 41.007273,
        lng: 28.973736
      }
    },
    {
      name: 'Dolmabahçe Palace - Glamourous Palace',
      address: 'Vişnezade Mh., Dolmabahçe Cd., 34357 Beşiktaş/İstanbul, Turkey',
      info: "Tea and coffee on the Bosphorus",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=41.03937,28.9983633&heading=150.78&pitch=-1.76",
      location: {
        lat: 41.03937,
        lng: 28.9983633
      }
    },
    {
      name: 'Kiz Kulesi - Maiden Tower',
      address: 'Salacak, Üsküdar Salacak Mevkii, 34668 Üsküdar/İstanbul, Turkey',
      info: "Beautiful scenery and delicious desserts",
      streetView: "http://maps.googleapis.com/maps/api/streetview?size=200x200&location=41.020918,29.004056&heading=400.78&pitch=-1.76",
      location: {
        lat: 41.020918,
        lng: 29.004056
      }
    }
  ];



  /*--------------- ViewModel---------------*/
  var ViewModel = function () {
    var self = this;
    
// Initializing the google maps
    self.init = new google.maps.Map(document.getElementById('map-canvas'), {
      center: latlng,
      zoom: 13
    });


    // Empty array to hold the list of places
    self.listOfAllPlaces = [];
    placesList.forEach(function (place) {
      self.listOfAllPlaces.push(new PlaceModel(place));
    });

    
      /*Place object holding addresses and places*/
  function  PlaceModel (data) {
    this.name = data.name;
    this.address = data.address;
    this.info = data.info;
    this.lat = data.lat;
    this.lng = data.lng;
    this.country = data.country;
    this.marker = null;
  
  };
//     var PlaceModel = function () {
//    var self = this;
//
//    self.name = ko.observable();
//    self.address = ko.observable();
//    self.info = ko.observable();
//    self.lat = ko.observable();
//    self.lng = ko.observable();
//    self.country = ko.observable();
//    self.marker = null;
//    self.openInfoWindow = function () {
//      self.marker.infoWindow.open(self.init, self.marker);
//    };
//    self.userInput = ko.observable();    
//  };
    
    self.makeLocationsVisible = ko.observableArray([]);
    self.markers = ko.observableArray([]);
    self.search = ko.observable();
    self.listOfAllPlaces.forEach(function(place){
      self.makeLocationsVisible.push(place);
    });
    
    self.resetCenter = function() {
		self.map.panTo(self.center);
	};
    
    // Looping through the list to place markers    
    $.each(placesList, function (key, data) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.location),
        map: self.init,
        listVisible: ko.observable(true),
        animation: google.maps.Animation.DROP,
        name: data.name,
        address: data.address,
        content: contentString
      });

      // Creating infoWindow and placing the content from the placeList array
      var contentString = '<div><h1>' + data.name + '</h1><p>' + data.address + '</p>' + '<img class="img-responsive" src=" ' + data.streetView + '"> ' + "<div id='content'></div>" + '</div>';
      self.infoWindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', function () {
        self.init.panTo(marker.getPosition());
        // Make marker icon bounce only once
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
          marker.setAnimation(null);
        }, 1000);
        self.infoWindow.setContent(contentString);
        self.infoWindow.open(self.init, this);
      });
      self.markers.push(marker);
    });


    google.maps.event.addListener(self.infoWindow, 'closeclick', function () {
      self.resetCenter();
    });

// Method to remove opened markers
    var removeMarker = function (address) {
      if (address != null) {
        address.marker().setMap(null);
      }
    };
    
    
    self.clickedMarker = function(marker) {
      google.maps.event.trigger(self.marker, 'click');
    };

    

  };
  ko.applyBindings(new ViewModel());
};




