import { eventBus } from '../core/event_bus.js';

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
    playPauseBtn.innerHTML = `<i class="hgi-stroke hgi-pause" style="font-size: 22px;"></i>`;
  }

  // Also sync control center pause buttons if present
  const p3 = document.getElementById('playPauseIcon_music3');
  if (p3) {
    p3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M548.22-174v-612h214v612h-214Zm-350.44 0v-612h214v612h-214Z"/></svg>`;
  }

  isPlaying = true;
  musicExists = true;
  window.isPlaying_music = true;
  window.musicExists = true;

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
      playPauseBtn.innerHTML = `<i class="hgi-stroke hgi-pause" style="font-size: 22px;"></i>`;
    }
    if (p3) {
      p3.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M548.22-174v-612h214v612h-214Zm-350.44 0v-612h214v612h-214Z"/></svg>`;
    }
    isPlaying = true;
    window.isPlaying_music = true;
    eventBus.emit('media:resume');
  } else {
    audioPlayer.pause();
    if (playPauseBtn) {
      playPauseBtn.innerHTML = `<i class="hgi-stroke hgi-play" style="font-size: 22px;"></i>`;
    }
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
  // Set default initial track display
  const track = musicList[0];
  const miniTitle = document.getElementById('popupTitle_music');
  const miniArt = document.getElementById('am_mini_art');
  if (miniTitle && track) miniTitle.textContent = track.title;
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
}
