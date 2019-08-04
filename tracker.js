function ipLookUp () {
  $.getJSON('https://ipapi.co/json/', function(data){
    var schools=[
    ["Stanford", 37.427500, -122.169976],
    ["Caltech",  34.137666, -118.125408],
    ["Northwestern", 42.056435, -87.675138],
    ["Rensselear" ,42.730282, -73.678749],
    ["Princeton" ,40.343135 ,-74.654945],
    ["Carnegie Mellon", 40.442947 ,-79.942820],
    ["UMD", 38.986993 ,-76.942565],
    ["MIT", 42.360162, -71.094203]];

    var closest=schools[0];
    var dist=Math.sqrt(Math.pow((data.latitude-schools[0][1]),2)+Math.pow((data.longitude-schools[0][2]),2));
    for (var i = 0; i < schools.length; i++) {
      if (Math.sqrt(Math.pow((data.latitude-schools[i][1]),2)+Math.pow((data.longitude-schools[i][2]),2))<dist){
        dist=Math.sqrt(Math.pow((data.latitude-schools[i][1]),2)+Math.pow((data.longitude-schools[i][2]),2));
        closest=schools[i];
      }
    }
    alert("Are you from "+closest[0]+"?");
  })
}

function getAddress (latitude, longitude) {
  $.ajax('https://maps.googleapis.com/maps/api/geocode/json?' +
          'latlng=' + latitude + ',' + longitude + '&key=' +
          GOOGLE_MAP_KEY)
  .then(
    function success (response) {
      console.log('User\'s Address Data is ', response)
    },
    function fail (status) {
      console.log('Request failed.  Returned status of',
                  status)
    }
   )
}

if ("geolocation" in navigator) {
  // check if geolocation is supported/enabled on current browser
  navigator.geolocation.getCurrentPosition(
   function success(position) {
     // for when getting location is a success
     console.log('latitude', position.coords.latitude,
                 'longitude', position.coords.longitude);
     //getAddress(position.coords.latitude, position.coords.longitude)
   },
  function error(error_message) {
    // for when getting location results in an error
    console.error('An error has occured while retrieving' +
                  'location', error_message)
    ipLookUp()
  });
} else {
  // geolocation is not supported
  // get your location some other way
  console.log('geolocation is not enabled on this browser')
  ipLookUp()
}
