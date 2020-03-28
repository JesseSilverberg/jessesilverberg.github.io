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