const progress = document.getElementById("progress-bar");
const playButton = document.getElementById("playBtn");
const song = document.getElementById("song");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const player = document.querySelector(".music-player");


const titleEl = document.querySelector("h2");
const artistEl = document.querySelector("p");
const imgEl = document.querySelector(".song-img");
const playlistContainer = document.getElementById("playlist-container");

const songs = [
  {
    src: "assets/music/Song1.mp3",
    title: "Chore Albadi",
    artist: "Duryodhan, Akash Rana",
    img: "assets/images/song1.png",
  },
  {
    src: "assets/music/Song2.mp3",
    title: "Rana Naam Bhaari",
    artist: "Duryodhan Rana",
    img: "assets/images/song2.png",
  },
  {
    src: "assets/music/Song3.mp3",
    title: "Bhid mat",
    artist: "Duryodhan Rana",
    img: "assets/images/song3.png",
  },
];

let currentSongIndex = 0;

// format time in mm:ss
function formatTime(time) {
  if (!time || isNaN(time)) return "0:00";
  let min = Math.floor(time / 60);
  let sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

// metadata loaded
song.addEventListener("loadedmetadata", () => {
  progress.max = song.duration;
  progress.value = 0;
  durationEl.innerText = formatTime(song.duration);
});

// play / pause
function playPause() {
  if (song.paused) {
    song.play();
  } else {
    song.pause();
  }
}

// sync ui 
song.onplay = () => {
  playButton.classList.replace("fa-play", "fa-pause");
  player.classList.add("playing");
};

song.onpause = () => {
  playButton.classList.replace("fa-pause", "fa-play");
  player.classList.remove("playing");
};

// Update progress bar UI
function updateProgressUI() {
  let value = progress.max ? (progress.value / progress.max) * 100 : 0;
  progress.style.background = `linear-gradient(to right, #f53192 ${value}%, #ddd ${value}%)`;
}

song.ontimeupdate = () => {
  progress.value = song.currentTime;
  updateProgressUI();
  currentTimeEl.innerText = formatTime(song.currentTime);
};

// Seek Control
progress.oninput = () => {
  if (!song.duration) return;
  song.currentTime = progress.value;
  updateProgressUI();
};

// Backward / Forward
function backward() {
  song.currentTime = Math.max(0, song.currentTime - 5);
  progress.value = song.currentTime;
  currentTimeEl.innerText = formatTime(song.currentTime);
  updateProgressUI();
}

function forward() {
  if (!song.duration) return;
  song.currentTime = Math.min(song.duration, song.currentTime + 5);
  progress.value = song.currentTime;
  currentTimeEl.innerText = formatTime(song.currentTime);
  updateProgressUI();
}

// Playlist Toggle
function playlist() {
  playlistContainer.classList.toggle("show");
}

// Play Song
function playSong(index, element) {
  currentSongIndex = index;
  const currentSong = songs[index];

  song.src = currentSong.src;
  song.play();

  // update UI
  titleEl.innerText = currentSong.title;
  artistEl.innerText = currentSong.artist;
  imgEl.src = currentSong.img;

  // highlight active
  const listItems = document.querySelectorAll(".playlist li");
  listItems.forEach((li) => li.classList.remove("active"));

  if (element) {
    element.classList.add("active");
  } else if (listItems[index]) {
    listItems[index].classList.add("active");
  }

  // reset progress
  currentTimeEl.innerText = "0:00";
  progress.value = 0;
  updateProgressUI();

  // close playlist
  playlistContainer.classList.remove("show");
}


// AUTO NEXT SONG
song.onended = () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
};

// intital load
playSong(0);