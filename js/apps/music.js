import { eventBus } from '../core/event_bus.js';

// Default Track List
export const musicList = [
  {
    title: 'HEADPHONK',
    img: 'originos_data/Music/headphonk.png',
    src: 'originos_data/Music/phonk/HEADPHONK - phonk.mp3',
  },
  {
    title: 'Dark Heart',
    img: 'originos_data/Music/dark_heart.png',
    src: 'originos_data/Music/ambient/Dark Heart - ambient.mp3',
  },
  {
    title: 'Machine',
    img: 'originos_data/Music/machine.png',
    src: 'originos_data/Music/eletric/Machine -electric.mp3',
  },
  {
    title: 'Happy',
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

export function updatePlaylist() {
  const playlist = document.getElementById('playlist_music');
  if (!playlist) return;

  playlist.innerHTML = '';
  getAllTracks().forEach((track, index) => {
    const trackDiv = document.createElement('div');
    trackDiv.className = 'track_music';
    trackDiv.onclick = () => playTrack(index);
    trackDiv.innerHTML = `
      <img src="${track.img}" alt="Art">
      <div class="track-info_music">
        <div class="track-title_music">${track.title}</div>
      </div>`;
    playlist.appendChild(trackDiv);
  });

  if (typeof window.set_dark_mode === 'function' && typeof window.dark_mode !== 'undefined') {
    window.set_dark_mode(window.dark_mode);
  }
}

export function playTrack(index) {
  const allTracks = getAllTracks();
  const track = allTracks[index];
  if (!track) return;
  currentIndex = index;

  const popupImage = document.getElementById('popupImage_music');
  const popupTitle = document.getElementById('popupTitle_music');
  const popupTitle2 = document.getElementById('popupTitle_music2');
  const musicTextControlsCenter = document.getElementById('music_textControlsCenter');
  const audioPlayer = document.getElementById('audioPlayer_music');
  const popupMusic = document.getElementById('playerPopup_music');
  const playlist = document.getElementById('playlist_music');

  if (popupImage) popupImage.src = track.img;
  if (popupTitle) popupTitle.textContent = track.title;
  if (popupTitle2) popupTitle2.textContent = track.title;
  if (musicTextControlsCenter) musicTextControlsCenter.textContent = `${track.title}`;

  const islandRight2 = document.querySelector('.image_island_right2');
  const islandCircleImg = document.querySelector('.island_circle_img');
  const imgMusicControlsCenter = document.getElementById('img_musicControlsCenter');

  if (islandRight2) islandRight2.style.backgroundImage = `url('${track.img}')`;
  if (islandCircleImg) islandCircleImg.style.backgroundImage = `url('${track.img}')`;
  if (imgMusicControlsCenter) imgMusicControlsCenter.style.backgroundImage = `url('${track.img}')`;

  if (audioPlayer) {
    audioPlayer.src = track.src;
    audioPlayer.play();
    audioPlayer.onended = () => nextTrack();
  }

  const pauseSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor"><path d="M556.67-200v-560h170v560h-170Zm-323.34 0v-560h170v560h-170Z"/></svg>`;
  const p1 = document.getElementById('playPauseIcon_music');
  const p2 = document.getElementById('playPauseIcon_music2');
  const p3 = document.getElementById('playPauseIcon_music3');
  if (p1) p1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="gray"><path d="M556.67-200v-560h170v560h-170Zm-323.34 0v-560h170v560h-170Z"/></svg>`;
  if (p2) p2.innerHTML = pauseSvg;
  if (p3) p3.innerHTML = pauseSvg;

  if (popupMusic) {
    popupMusic.style.display = 'flex';
    if (typeof window.showPopup_open_close === 'function') {
      window.showPopup_open_close(popupMusic);
    }
  }

  if (playlist) playlist.style.height = '28vh';
  isPlaying = true;
  musicExists = true;
  window.isPlaying_music = true;
  window.musicExists = true;

  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
  eventBus.emit('media:play', { track, index });
}

export function togglePlay() {
  const audioPlayer = document.getElementById('audioPlayer_music');
  if (!audioPlayer || !musicExists) return;

  const p1 = document.getElementById('playPauseIcon_music');
  const p2 = document.getElementById('playPauseIcon_music2');
  const p3 = document.getElementById('playPauseIcon_music3');

  if (audioPlayer.paused) {
    audioPlayer.play();
    const pauseSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor"><path d="M548.22-174v-612h214v612h-214Zm-350.44 0v-612h214v612h-214Z"/></svg>`;
    if (p1) p1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="gray"><path d="M548.22-174v-612h214v612h-214Zm-350.44 0v-612h214v612h-214Z"/></svg>`;
    if (p2) p2.innerHTML = pauseSvg;
    if (p3) p3.innerHTML = pauseSvg;
    isPlaying = true;
    window.isPlaying_music = true;
    eventBus.emit('media:resume');
  } else {
    audioPlayer.pause();
    const playSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
    if (p1) p1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="gray"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
    if (p2) p2.innerHTML = playSvg;
    if (p3) p3.innerHTML = playSvg;
    isPlaying = false;
    window.isPlaying_music = false;
    eventBus.emit('media:pause');
  }
  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
}

export function nextTrack() {
  if (!musicExists) return;
  const total = getAllTracks().length;
  currentIndex = (currentIndex + 1) % total;
  playTrack(currentIndex);
}

export function prevTrack() {
  if (!musicExists) return;
  const total = getAllTracks().length;
  currentIndex = (currentIndex - 1 + total) % total;
  playTrack(currentIndex);
}

export function closePlayer() {
  const audioPlayer = document.getElementById('audioPlayer_music');
  const popupMusic = document.getElementById('playerPopup_music');
  const playlist = document.getElementById('playlist_music');
  const p1 = document.getElementById('playPauseIcon_music');
  const imgMusicControlsCenter = document.getElementById('img_musicControlsCenter');
  const musicTextControlsCenter = document.getElementById('music_textControlsCenter');

  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
  if (popupMusic && typeof window.hidePopup_open_close === 'function') {
    window.hidePopup_open_close(popupMusic);
  }
  if (playlist) playlist.style.height = '60vh';
  if (p1) {
    p1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="gray"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
  }

  isPlaying = false;
  musicExists = false;
  window.isPlaying_music = false;
  window.musicExists = false;

  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
  if (imgMusicControlsCenter) imgMusicControlsCenter.style.backgroundImage = 'none';
  if (musicTextControlsCenter) musicTextControlsCenter.textContent = 'Not playing';

  eventBus.emit('media:stop');
}

export function playSoundEffect(url, volume = 1.0) {
  if (volume <= 0) return;
  const container = document.createElement('div');
  container.style.display = 'none';

  const audio = document.createElement('audio');
  audio.src = url;
  audio.autoplay = true;
  audio.volume = Math.min(volume, 1);

  const cleanup = () => {
    audio.removeEventListener('ended', cleanup);
    container.remove();
  };
  audio.addEventListener('ended', cleanup);
  container.appendChild(audio);
  document.body.appendChild(container);
}

// Global bridges
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
  window.closePlayer_music = closePlayer;
  window.playmusic = playSoundEffect;
}
