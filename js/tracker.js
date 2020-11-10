function videoMute(v) {
  v.querySelector('.overlay').classList.remove("hidden");
  v.addEventListener('click', event => {
    v.querySelector('video').muted = !v.querySelector('video').muted;
    v.querySelector('.overlay').classList.toggle("hidden");
  });
}

document.querySelectorAll('.video-overlay').forEach(item => {
  if (item.querySelector('video').readyState > 3) {
    videoMute(item);
  } else {
    item.querySelector('video').addEventListener('canplay', event => {
      videoMute(item);
    });
  }
});

var observer = new IntersectionObserver(function(entries) {
  entries.forEach((entry) => {
    if (entry['isIntersecting'] && entry['intersectionRatio'] === 1) {
      entry.target.play();
    } else {
      entry.target.pause();
    }
  });
}, {
  threshold: [0, 1]
});

document.querySelectorAll("video").forEach(vid => observer.observe(vid));
