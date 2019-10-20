var closest;
function ipLookUp() {
    sessionStorage.setItem("asked","true");
  $.getJSON('https://ipapi.co/json/', function(data){
    var schools=[
    ["Stanford", 37.427500, -122.169976],
    ["Caltech",  34.137666, -118.125408],
    ["Northwestern", 42.056435, -87.675138],
    ["Rensselaer" ,42.730282, -73.678749],
    ["Princeton" ,40.343135 ,-74.654945],
    ["Carnegie Mellon", 40.442947 ,-79.942820],
    ["UMD", 38.986993 ,-76.942565],
    ["MIT", 42.360162, -71.094203]];

    closest=schools[0];
    var dist=Math.sqrt(Math.pow((data.latitude-schools[0][1]),2)+Math.pow((data.longitude-schools[0][2]),2));
    for (var i = 0; i < schools.length; i++) {
      if (Math.sqrt(Math.pow((data.latitude-schools[i][1]),2)+Math.pow((data.longitude-schools[i][2]),2))<dist){
        dist=Math.sqrt(Math.pow((data.latitude-schools[i][1]),2)+Math.pow((data.longitude-schools[i][2]),2));
        closest=schools[i];
      }
    }
      
      
    $('#school').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#school').find('.modal-body-text').text("We've detected you're from " + closest[0]+". Is that correct?");
  });
}

function yes() {
    sessionStorage.setItem("school",closest[0]);
    schoolStyle();
}

function no() {
    $('#options').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function schoolStyle() {
    var schoolName=sessionStorage.getItem("school");
    var favicon = document.getElementById('favicon');
    favicon.href = "img/"+schoolName + ".ico";
    if (schoolName==="UMD"){
        $(document.body).css("--primary-color", "#E71036");
        $(document.body).css("--primary-text", "#fff");
        $(document.body).css("--secondary-color", "#FFD047");
        $(document.body).css("--secondary-text", "#000");
    } else if (schoolName==="MIT"){
        $(document.body).css("--primary-color", "white");
        $(document.body).css("--primary-text", "#000");
        $(document.body).css("--secondary-color", "#E71036");
    } else if (schoolName==="Stanford"){
        $(document.body).css("--primary-color", "#B50016");
        $(document.body).css("--primary-text", "#fff");
        $(document.body).css("--secondary-color", "#B50016");
    } else if (schoolName==="Caltech"){
        $(document.body).css("--primary-color", "#FF6C33");
        $(document.body).css("--primary-text", "#fff");
        $(document.body).css("--secondary-color", "#0073A4");
    } else if (schoolName==="Rensselaer"){
        $(document.body).css("--primary-color", "#DB0022");
        $(document.body).css("--primary-text", "#fff");
        $(document.body).css("--secondary-color", "#9C0009");
    } else if (schoolName==="Princeton"){
        $(document.body).css("--primary-color", "#EA7228");
        $(document.body).css("--primary-text", "#fff");
        $(document.body).css("--secondary-color", "#000000");
    } else if (schoolName==="Carnegie Mellon"){
        $(document.body).css("--primary-color", "#BF000E");
        $(document.body).css("--primary-text", "#fff");
        $(document.body).css("--secondary-color", "#333333");
    } else if (schoolName==="Northwestern"){
        $(document.body).css("--primary-color", "#502D7F");
        $(document.body).css("--primary-text", "#fff");
        $(document.body).css("--secondary-color", "#412164");
    }
}

if (sessionStorage.getItem("asked")!="true") {
    ipLookUp();
} else {
    schoolStyle();
}


$(window).on('resize scroll', function() {
    $('video').each(function(){
        if ($(this).visible()) {
            $(this)[0].play();
        } else {
            $(this)[0].pause();
        }
    });
});
$("video").click( function (){
      $(this).prop('muted', !$(this).prop('muted'));
      $(this).closest('div').children('.overlay').toggleClass('d-none');
  });