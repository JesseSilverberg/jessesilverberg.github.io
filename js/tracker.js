$(window).on('load resize scroll', function() {
  $('video').each(function() {
    if ($(this).visible()) {
      $(this)[0].play();
    } else {
      $(this)[0].pause();
    }
  });
});
$(".video-overlay").click(function() {
  $(this).children('video').prop('muted', !$(this).prop('muted'));
  $(this).children('.overlay').toggleClass('hidden');
});
