import { eventBus } from '../core/event_bus.js';
import { enableDragScroll } from '../core/drag_scroll.js';

// Top Picks Feature Albums (Listen Now feed)
export const topPicks = [
  {
    badge: 'APPLE MUSIC',
    title: 'R&B NOW',
    desc: 'On "Lost Me," GIVĒON\'s ready to just do him. Hear it in Spatial.',
    img: 'originos_data/Music/headphonk.png',
    trackIndex: 0
  },
  {
    badge: 'FEATURED ALBUM',
    title: 'Electronic Pulse',
    desc: 'Ambient synthesizers and deep atmospheric rhythms.',
    img: 'originos_data/Music/dark_heart.png',
    trackIndex: 1
  },
  {
    badge: 'NEW RELEASE',
    title: 'Machine Motion',
    desc: 'Future bass and electric grooves.',
    img: 'originos_data/Music/machine.png',
    trackIndex: 2
  }
];

// Track list
export const musicList = [
  {
    title: 'HEADPHONK',
    artist: 'Phonk Nation',
    img: 'originos_data/Music/headphonk.png',
    src: 'originos_data/Music/phonk/HEADPHONK - phonk.mp3',
  },
  {
    title: 'Dark Heart',
    artist: 'Ambient Dreams',
    img: 'originos_data/Music/dark_heart.png',
    src: 'originos_data/Music/ambient/Dark Heart - ambient.mp3',
  },
  {
    title: 'Machine',
    artist: 'Electric Echo',
    img: 'originos_data/Music/machine.png',
    src: 'originos_data/Music/eletric/Machine -electric.mp3',
  },
  {
    title: 'Happy',
    artist: 'Pop Collective',
    img: 'originos_data/Music/happy.png',
    src: 'originos_data/Music/pop/Happy - pop.mp3',
  },
];

export let customTracks = [];
export let isPlaying = false;
export let musicExists = false;
export let currentIndex = 0;

function getAllTracks() {
  return [...musicList, ...customTracks];
}

export function renderTopPicks() {
  const container = document.getElementById('am_top_picks');
  if (!container) return;

  container.innerHTML = '';
  topPicks.forEach((pick) => {
    const card = document.createElement('div');
    card.className = 'am-hero-card';
    card.style.backgroundImage = `url("${pick.img}")`;
    card.onclick = () => playTrack(pick.trackIndex);
    card.innerHTML = `
      <div class="am-hero-card-content">
        <div class="am-hero-badge">${pick.badge}</div>
        <div class="am-hero-title">${pick.title}</div>
        <div class="am-hero-desc">${pick.desc}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

export function updatePlaylist() {
  const playlist = document.getElementById('playlist_music');
  if (!playlist) return;

  playlist.innerHTML = '';
  getAllTracks().forEach((track, index) => {
    const item = document.createElement('div');
    item.className = 'am-recent-item';
    item.onclick = () => playTrack(index);
    item.innerHTML = `
      <div class="am-recent-art" style="background-image: url('${track.img}')"></div>
      <div class="am-recent-title">${track.title}</div>
      <div class="am-recent-artist">${track.artist || 'Original Artist'}</div>
    `;
    playlist.appendChild(item);
  });

  renderTopPicks();
}

export function playTrack(index) {
  const allTracks = getAllTracks();
  const track = allTracks[index];
  if (!track) return;
  currentIndex = index;

  const miniTitle = document.getElementById('popupTitle_music');
  const miniArt = document.getElementById('am_mini_art');
  const audioPlayer = document.getElementById('audioPlayer_music');
  const playPauseBtn = document.getElementById('playPauseIcon_music');
  const musicTextControlsCenter = document.getElementById('music_textControlsCenter');
  const imgMusicControlsCenter = document.getElementById('img_musicControlsCenter');
  const islandRight2 = document.querySelector('.image_island_right2');
  const islandCircleImg = document.querySelector('.island_circle_img');

  if (miniTitle) miniTitle.textContent = track.title;
  const miniArtist = document.getElementById('popupArtist_music');
  if (miniArtist) miniArtist.textContent = track.artist || 'Original Artist';
  if (miniArt) miniArt.style.backgroundImage = `url('${track.img}')`;
  if (musicTextControlsCenter) musicTextControlsCenter.textContent = track.title;
  if (imgMusicControlsCenter) imgMusicControlsCenter.style.backgroundImage = `url('${track.img}')`;
  if (islandRight2) islandRight2.style.backgroundImage = `url('${track.img}')`;
  if (islandCircleImg) islandCircleImg.style.backgroundImage = `url('${track.img}')`;

  if (audioPlayer) {
    audioPlayer.src = track.src;
    audioPlayer.play().catch(() => {});
    audioPlayer.onended = () => nextTrack();
  }

  if (playPauseBtn) {
    playPauseBtn.innerHTML = `<i class="hgi-stroke hgi-pause" style="font-size: 28px;"></i>`;
  }
  syncNowPlayingIcon(true);

  // Also sync control center pause buttons if present
  const p3 = document.getElementById('playPauseIcon_music3');
  if (p3) {
    p3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M548.22-174v-612h214v612h-214Zm-350.44 0v-612h214v612h-214Z"/></svg>`;
  }

  isPlaying = true;
  musicExists = true;
  window.isPlaying_music = true;
  window.musicExists = true;
  syncNowPlayingTrack();

  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
  eventBus.emit('media:play', { track, index });
}

export function togglePlay() {
  const audioPlayer = document.getElementById('audioPlayer_music');
  const playPauseBtn = document.getElementById('playPauseIcon_music');
  const p3 = document.getElementById('playPauseIcon_music3');

  if (!audioPlayer) return;

  if (audioPlayer.paused) {
    audioPlayer.play().catch(() => {});
    if (playPauseBtn) {
      playPauseBtn.innerHTML = `<i class="hgi-stroke hgi-pause" style="font-size: 28px;"></i>`;
    }
    syncNowPlayingIcon(true);
    if (p3) {
      p3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M548.22-174v-612h214v612h-214Zm-350.44 0v-612h214v612h-214Z"/></svg>`;
    }
    isPlaying = true;
    window.isPlaying_music = true;
    eventBus.emit('media:resume');
  } else {
    audioPlayer.pause();
    if (playPauseBtn) {
      playPauseBtn.innerHTML = `<i class="hgi-stroke hgi-play" style="font-size: 28px;"></i>`;
    }
    syncNowPlayingIcon(false);
    if (p3) {
      p3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
    }
    isPlaying = false;
    window.isPlaying_music = false;
    eventBus.emit('media:pause');
  }

  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
}

export function nextTrack() {
  const total = getAllTracks().length;
  if (total === 0) return;
  currentIndex = (currentIndex + 1) % total;
  playTrack(currentIndex);
}

export function prevTrack() {
  const total = getAllTracks().length;
  if (total === 0) return;
  currentIndex = (currentIndex - 1 + total) % total;
  playTrack(currentIndex);
}

export function openFilePicker() {
  const input = document.getElementById('fileInput_music');
  if (input) {
    input.value = '';
    input.click();
  }
}

export function initMusicApp() {
  updatePlaylist();
  setupThemeSync();
  setupDragScroll();
  // Set default initial track display
  const track = musicList[0];
  const miniTitle = document.getElementById('popupTitle_music');
  const miniArt = document.getElementById('am_mini_art');
  if (miniTitle && track) miniTitle.textContent = track.title;
  const miniArtistInit = document.getElementById('popupArtist_music');
  if (miniArtistInit && track) miniArtistInit.textContent = track.artist;
  syncNowPlayingTrack();
  bindNowPlaying();
  setupNowPlayingSwipe();
  if (miniArt && track) miniArt.style.backgroundImage = `url('${track.img}')`;

  const input = document.getElementById('fileInput_music');
  if (input) {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const newTrack = {
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'My Audio',
        img: 'originos_data/phone.jpg',
        src: url
      };
      customTracks.push(newTrack);
      updatePlaylist();
      playTrack(getAllTracks().length - 1);
    });
  }
}

// Theme follows the simulated OriginOS theme only (never the real OS).
let themeSyncBound = false;
function setupThemeSync() {
  if (themeSyncBound) return;
  themeSyncBound = true;
  const appEl = document.getElementById('apple_music_app');
  if (!appEl) return;
  const updateTheme = () => {
    const isDark = (typeof window.dark_mode !== 'undefined' && window.dark_mode === 1) ||
      document.body.classList.contains('dark-mode') ||
      document.documentElement.getAttribute('data-theme') === 'dark';
    appEl.classList.toggle('dark', isDark);
    appEl.classList.toggle('light', !isDark);
  };
  updateTheme();
  eventBus.on('state:theme', updateTheme);
  eventBus.on('state:change', updateTheme);
}

// Drag-to-scroll with momentum for the horizontal rails + vertical feed.
// (Native overflow scroll covers touch; this adds cursor-drag for mouse.)
function setupDragScroll() {
  enableDragScroll(document.getElementById('am_top_picks'), { disableSnap: true });
  enableDragScroll(document.getElementById('playlist_music'), { disableSnap: true });
  enableDragScroll(document.querySelector('.am-content-scroll'));
}

// ---- Full Now Playing view ----
function fmtTime(s) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function currentTrack() {
  return getAllTracks()[currentIndex];
}

function syncNowPlayingTrack() {
  const track = currentTrack();
  if (!track) return;
  const art = document.getElementById('am_np_art');
  const title = document.getElementById('am_np_title');
  const artist = document.getElementById('am_np_artist');
  const bg = document.getElementById('am_np_bg');
  if (art) art.style.backgroundImage = `url('${track.img}')`;
  if (bg) bg.style.backgroundImage = `url('${track.img}')`;
  if (title) title.textContent = track.title;
  if (artist) artist.textContent = track.artist || 'Original Artist';
}

function syncNowPlayingIcon(playing) {
  const icon = document.getElementById('am_np_playpause_icon');
  if (icon) icon.className = playing ? 'hgi-stroke hgi-pause' : 'hgi-stroke hgi-play';
}

export function openNowPlaying() {
  syncNowPlayingTrack();
  const audio = document.getElementById('audioPlayer_music');
  syncNowPlayingIcon(audio ? !audio.paused : isPlaying);
  document.getElementById('am_now_playing')?.classList.add('open');
}

export function closeNowPlaying() {
  const np = document.getElementById('am_now_playing');
  if (!np) return;
  np.classList.remove('open');
  np.style.transform = '';
}

let npBound = false;
function bindNowPlaying() {
  if (npBound) return;
  npBound = true;
  document.getElementById('am_mini_player')?.addEventListener('click', openNowPlaying);
  document.getElementById('am_np_close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeNowPlaying();
  });
  const audio = document.getElementById('audioPlayer_music');
  const slider = document.getElementById('am_np_slider');
  const vol = document.getElementById('am_np_volume');
  if (audio && !audio.dataset.npBound) {
    audio.dataset.npBound = '1';
    audio.addEventListener('timeupdate', () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      if (slider && document.activeElement !== slider) slider.value = pct;
      const el = document.getElementById('am_np_elapsed');
      const du = document.getElementById('am_np_duration');
      if (el) el.textContent = fmtTime(audio.currentTime);
      if (du) du.textContent = fmtTime(audio.duration);
    });
  }
  slider?.addEventListener('input', () => {
    if (audio && audio.duration) audio.currentTime = (slider.value / 100) * audio.duration;
  });
  vol?.addEventListener('input', () => {
    if (audio) audio.volume = vol.value / 100;
  });
}

let npSwipeBound = false;
function setupNowPlayingSwipe() {
  if (npSwipeBound) return;
  npSwipeBound = true;
  const np = document.getElementById('am_now_playing');
  if (!np) return;
  let startY = 0, startX = 0, dy = 0, active = false, pid = null, locked = false, vertical = false;

  np.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (!np.classList.contains('open')) return;
    if (e.target.closest('input')) return;
    active = true; pid = e.pointerId; startY = e.clientY; startX = e.clientX; dy = 0;
    locked = false; vertical = false;
  });

  np.addEventListener('pointermove', (e) => {
    if (!active || e.pointerId !== pid) return;
    const ddy = e.clientY - startY;
    const ddx = e.clientX - startX;
    if (!locked && Math.abs(ddy) + Math.abs(ddx || 0) > 10) {
      locked = true;
      vertical = Math.abs(ddy) > Math.abs(ddx || 0) * 1.2 && ddy > 0;
      if (!vertical) { active = false; return; }
      np.classList.add('swipe-drag');
    }
    if (!locked || !vertical) return;
    dy = Math.max(0, ddy);
    np.style.transform = `translateY(${dy}px)`;
  });

  const end = (e) => {
    if (!active || (e.pointerId !== undefined && e.pointerId !== pid)) return;
    active = false;
    np.classList.remove('swipe-drag');
    const h = np.getBoundingClientRect().height || 600;
    if (locked && vertical && dy > h * 0.22) {
      closeNowPlaying();
      setTimeout(() => { np.style.transform = ''; }, 400);
    } else {
      np.style.transform = '';
    }
    dy = 0;
  };
  np.addEventListener('pointerup', end);
  np.addEventListener('pointercancel', end);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
}

// Global bridges for inline HTML attributes
if (typeof window !== 'undefined') {
  window.musicList_music = musicList;
  window.customTracks_music = customTracks;
  window.isPlaying_music = isPlaying;
  window.musicExists = musicExists;
  window.currentIndex_music = currentIndex;
  window.updatePlaylist_music = updatePlaylist;
  window.playTrack_music = playTrack;
  window.togglePlay_music = togglePlay;
  window.nextTrack_music = nextTrack;
  window.prevTrack_music = prevTrack;
  window.openFilePicker_music = openFilePicker;
  window.openNowPlaying_music = openNowPlaying;
  window.closeNowPlaying_music = closeNowPlaying;
}
