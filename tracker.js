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
  });
}

ipLookUp();
