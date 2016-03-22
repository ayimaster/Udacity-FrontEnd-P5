$(function () {

      var map;
      var infoWindow;
      var latlng = {
        lat: 41.03745,
        lng: 28.97761
      };

      function initMap() {
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_TOP
            },

            scaleControl: true,
            mapTypeControl: false,
//            mapTypeControlOptions: {
//              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
//            }
          });
        };

        google.maps.event.addDomListener(window, 'load', initMap);
  
  function createMarker(lat, lng, name, url) {
    var latlng = new google.maps.LatLng(lat,lng);

    var marker = new google.maps.Marker({
      name: name,
      url: url,
      position: latlng,
      map: map,
      animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'click', function() {
      ViewModel.places().forEach(function(place) {
        if (place.name.toLowerCase() == marker.name.toLowerCase()) {
          openInfoWindow(place, marker);
        }
      })

      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
         marker.setAnimation(null);
      }, 2150);

    });

  /* MODEL */
  /*Place object*/
var Place = function (data) {
  var self = this;
  self.name = ko.observable(data.name);
  self.address = ko.observable(data.address);
  self.info = ko.observable(data.info);
  self.lat = ko.observable(data.lat);
  self.lng = ko.observable(data.lng);
};

        ViewModel = {
          markerArray : ko.observableArray(),
          location : ko.observable(),
          info : ko.observable(),
          streetName : ko.observable(),
          city : ko.observable(),
          address : ko.observable(),
          country : ko.observable(),
          searchText : ko.observable(''),
          filter : ko.observableArray(),
          yelpInfo: ko.observable(''),
          flickrImages: ko.observableArray([])
           };

          
ko.applyBindings(ViewModel);

        }
});