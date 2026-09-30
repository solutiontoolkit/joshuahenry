(function () {
'use strict';
// ---------- Mobile menu ----------
var menuBtn = document.getElementById('menuBtn');
var mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', function () { mobileMenu.classList.toggle('open'); });
var mobileMenuLinks = mobileMenu.querySelectorAll('a');
for (var m = 0; m < mobileMenuLinks.length; m++) {
  mobileMenuLinks[m].addEventListener('click', function () { mobileMenu.classList.remove('open'); });
}

// ---------- Role rotator (plain text swap, no blinking-cursor gimmick beyond a static caret) ----------
const roles = ['building web apps', 'analyzing data', 'designing dashboards', 'shipping products'];
const roleEl = document.getElementById('roleText');
let ri = 0, ci = 0, deleting = false;

function tick() {
  const word = roles[ri];
  ci += deleting ? -1 : 1;
  roleEl.textContent = word.substring(0, ci);
  let speed = deleting ? 35 : 60;
  if (!deleting && ci === word.length) { speed = 1400; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; speed = 300; }
  setTimeout(tick, speed);
}
tick();

// ---------- Sticky top bar shrink shadow ----------
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  topbar.style.boxShadow = window.scrollY > 20 ? '0 1px 0 rgba(0,0,0,0.4)' : 'none';
});

// ---------- Back to top ----------
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 600);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Project filter ----------
var filterBtns = document.querySelectorAll('.filter-btn');
var rows = document.querySelectorAll('.project-row');
for (var f = 0; f < filterBtns.length; f++) {
  filterBtns[f].addEventListener('click', function () {
    for (var b = 0; b < filterBtns.length; b++) { filterBtns[b].classList.remove('active'); }
    this.classList.add('active');
    var filter = this.dataset.filter;
    for (var r = 0; r < rows.length; r++) {
      var match = filter === 'all' || rows[r].dataset.category === filter;
      rows[r].style.display = match ? 'grid' : 'none';
    }
  });
}

// ---------- Videos ----------
// Add or update videos right here. Paste the YouTube video ID (the part
// after "watch?v=" in the video URL) and a short title. Leave id as an
// empty string for a placeholder slot until a video is ready.
// The thumbnail and link are built automatically, so updating this list
// is the only step needed each time a new video goes live.
const videos = [
  { id: '', title: 'Add your first video ID in script.js' },
  { id: '', title: 'Add your second video ID in script.js' },
  { id: '', title: 'Add your third video ID in script.js' }
];

var videoGrid = document.getElementById('videoGrid');
if (videoGrid) {
  var html = '';
  for (var i = 0; i < videos.length; i++) {
    var video = videos[i];
    if (!video.id) {
      html += '<div class="video-card video-card--empty">' +
        '<div class="video-thumb"><img src="assets/kome_stk.png" alt="Video coming soon"></div>' +
        '<h3>' + video.title + '</h3>' +
        '</div>';
    } else {
      html += '<a class="video-card" href="https://www.youtube.com/watch?v=' + video.id + '" target="_blank" rel="noopener">' +
        '<div class="video-thumb">' +
        '<img src="https://img.youtube.com/vi/' + video.id + '/hqdefault.jpg" alt="' + video.title + '">' +
        '<span class="video-play"><svg width="16" height="16" viewBox="0 0 16 16" fill="#fff"><path d="M4 2.5v11l10-5.5-10-5.5Z"/></svg></span>' +
        '</div>' +
        '<h3>' + video.title + '</h3>' +
        '</a>';
    }
  }
  videoGrid.innerHTML = html;
}
})();
