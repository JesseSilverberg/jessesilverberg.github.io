document.querySelectorAll('.video-overlay').forEach(item => {
  item.querySelector('video').addEventListener('canplay', event => {
    console.log('hi');
    item.querySelector('.overlay').classList.remove("hidden");
    item.addEventListener('click', event => {
      item.querySelector('video').muted = !item.querySelector('video').muted;
      item.querySelector('.overlay').classList.toggle("hidden");
    });
  });
});

var observer = new IntersectionObserver(function(entries) {
  entries.forEach((entry) => {
    if (entry['isIntersecting'] && entry['intersectionRatio'] === 1) {
      entry.target.play();
    } else {
      entry.target.pause();
    }
  });
}, {threshold: [0, 1]});

document.querySelectorAll("video").forEach(vid => observer.observe(vid));
