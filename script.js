(function () {
'use strict';
// ---------- Mobile menu ----------
var menuBtn = document.getElementById('menuBtn');
var mobileMenu = document.getElementById('mobileMenu');
var desktopNav = window.matchMedia('(min-width: 901px)'); // keep in sync with the CSS breakpoint

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);   // locks page scroll behind the menu
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
}
menuBtn.addEventListener('click', function () { setMenu(!mobileMenu.classList.contains('open')); });

var mobileMenuLinks = mobileMenu.querySelectorAll('a');
for (var m = 0; m < mobileMenuLinks.length; m++) {
  mobileMenuLinks[m].addEventListener('click', function () { setMenu(false); });
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
});
// Rotating a phone or resizing past the breakpoint must never leave the menu open or the page scroll-locked
function onBreakpoint(e) { if (e.matches) setMenu(false); }
if (desktopNav.addEventListener) { desktopNav.addEventListener('change', onBreakpoint); }
else if (desktopNav.addListener) { desktopNav.addListener(onBreakpoint); }

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
}, { passive: true });

// ---------- Back to top ----------
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
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
  { id: '_W0rEDUKLnM', title: 'COMPANY WEBSITE LAUNCH' },
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

// ---------- Screenshot viewers + lightbox ----------
(function () {
  var box = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
  var lbItems = [], lbIdx = 0;

  function lbShow(i) {
    lbIdx = (i + lbItems.length) % lbItems.length;
    var it = lbItems[lbIdx];
    lbImg.src = it.src; lbImg.alt = it.caption;
    lbCap.textContent = it.caption + '  (' + (lbIdx + 1) + '/' + lbItems.length + ')';
  }
  function lbOpen(items, i) {
    lbItems = items; lbShow(i);
    box.classList.add('open'); box.setAttribute('aria-hidden', 'false');
  }
  function lbClose() { box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); lbImg.src = ''; }

  if (box) {
    document.getElementById('lbClose').addEventListener('click', lbClose);
    document.getElementById('lbPrev').addEventListener('click', function () { lbShow(lbIdx - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { lbShow(lbIdx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) lbClose(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
      if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
    });
  }

  var viewers = document.querySelectorAll('.shot-viewer');
  Array.prototype.forEach.call(viewers, function (v) {
    var stage = v.querySelector('.sv-stage');
    var img = v.querySelector('.sv-main img');
    var cap = v.querySelector('.sv-caption');
    var count = v.querySelector('.sv-count');
    var url = v.querySelector('.sv-url');
    var host = v.dataset.host;
    var thumbs = Array.prototype.slice.call(v.querySelectorAll('.sv-thumb'));
    var items = thumbs.map(function (t) { return { src: t.dataset.src, caption: t.dataset.caption }; });
    var cur = 0;

    function flagOrientation() {
      var portrait = img.naturalHeight > img.naturalWidth * 1.1;
      stage.classList.toggle('is-portrait', portrait);
      url.textContent = portrait ? 'mobile view' : host;
    }
    img.addEventListener('load', function () { flagOrientation(); img.classList.remove('is-swapping'); });
    if (img.complete) flagOrientation();

    function go(i) {
      cur = (i + thumbs.length) % thumbs.length;
      thumbs.forEach(function (t, k) { t.classList.toggle('active', k === cur); });
      img.classList.add('is-swapping');
      setTimeout(function () { img.src = items[cur].src; img.alt = items[cur].caption; }, 120);
      cap.textContent = items[cur].caption;
      count.textContent = (cur + 1) + ' / ' + thumbs.length;
      var t = thumbs[cur];
      if (t.scrollIntoView) { v.querySelector('.sv-thumbs').scrollTo({ left: t.offsetLeft - 8, behavior: 'smooth' }); }
      var nxt = new Image(); nxt.src = items[(cur + 1) % items.length].src; // preload next
    }
    thumbs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    v.querySelector('.sv-prev').addEventListener('click', function () { go(cur - 1); });
    v.querySelector('.sv-next').addEventListener('click', function () { go(cur + 1); });
    v.querySelector('.sv-main').addEventListener('click', function () { if (box) lbOpen(items, cur); });
    cap.textContent = items[0].caption;
  });
})();
