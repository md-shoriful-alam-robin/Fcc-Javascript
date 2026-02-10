const ballerina = {
  commonName: "Spanish lavender",
  scientificName: "Lavandula stoechas",
  cultivar: "Ballerina",
};

const prettyPolly = {
  commonName: "Spanish lavender",
  scientificName: "Lavandula stoechas",
  cultivar: "Pretty Polly",
};

const willowVale = {
  commonName: "Spanish lavender",
  scientificName: "Lavandula stoechas",
  cultivar: "Willow Vale",
};

const hidcote = {
  commonName: "English lavender",
  scientificName: "Lavandula angustifolia",
  cultivar: "Hidcote",
};

const imperialGem = {
  commonName: "English lavender",
  scientificName: "Lavandula angustifolia",
  cultivar: "Imperial Gem",
};

const royalCrown = {
  commonName: "French lavender",
  scientificName: "Lavandula dentata",
  cultivar: "Royal Crown",
};

const catalog = new Map();
catalog.set(ballerina, { small: 20, medium: 15, large: 12 });
catalog.set(prettyPolly, { small: 31, medium: 14, large: 24 });
catalog.set(willowVale, { small: 3, medium: 5, large: 0 });
catalog.set(hidcote, { small: 33, medium: 13, large: 18 });
catalog.set(imperialGem, { small: 19, medium: 35, large: 28 });
catalog.set(royalCrown, { small: 40, medium: 22, large: 9 });

const sellPlants = (plant, size, potsNo) => {
  if (!catalog.has(plant)) return "Item not found.";
  const name = `${plant.scientificName} '${plant.cultivar}'`;
  const pots = catalog.get(plant);
  if (pots[size] - potsNo < 0) {
    return `Not enough ${size} size pots for ${name}. Only ${pots[size]} left.`;
  }
  pots[size] -= potsNo;
  return `Catalog successfully updated.`;
};

const removePlant = (plant) => catalog.delete(plant);

const displayCatalog = () => {
  let catalogString = "";
  catalog.forEach((val, key) => {
    catalogString += `${key.scientificName} '${key.cultivar}': ${val.small} S, ${val.medium} M, ${val.large} L
`;
  });
  return catalogString;
};
const displayPlantsSet = () => {
  const commonNamesArr = [];

  for (const plant of catalog.keys()) {
    commonNamesArr.push(plant.commonName);
  }

  return new Set(commonNamesArr);
};

const plantsSet = displayPlantsSet();
console.log(plantsSet);
=======
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const playingSong = document.getElementById("player-song-title");
const songArtist = document.getElementById("player-song-artist");
const allSongs = [
  {
    id: 0,
    title: "Hello World",
    artist: "Rafael",
    duration: "0:23",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/hello-world.mp3",
  },
  {
    id: 1,
    title: "In the Zone",
    artist: "Rafael",
    duration: "0:11",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/in-the-zone.mp3",
  },
  {
    id: 2,
    title: "Camper Cat",
    artist: "Rafael",
    duration: "0:21",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/camper-cat.mp3",
  },
  {
    id: 3,
    title: "Electronic",
    artist: "Rafael",
    duration: "0:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/electronic.mp3",
  },
  {
    id: 4,
    title: "Sailing Away",
    artist: "Rafael",
    duration: "0:22",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3",
  },
];

const audio = new Audio();

const userData = {
  songs: allSongs,
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id, start = true) => {
  const song = userData.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;
  if (userData.currentSong === null || start) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");
  setPlayerDisplay();
  highlightCurrentSong();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};

const getCurrentSongIndex = () => userData.songs.indexOf(userData.currentSong);

const getNextSong = () => userData.songs[getCurrentSongIndex() + 1];

const getPreviousSong = () => userData.songs[getCurrentSongIndex() - 1];

const playPreviousSong = () => {
  if (userData.currentSong === null) return;
  const previousSong = getPreviousSong();
  if (previousSong) {
    playSong(previousSong.id);
  } else {
    playSong(userData.songs[0].id);
  }
};

const playNextSong = () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
    return;
  }
  const nextSong = getNextSong();
  if (nextSong) {
    playSong(nextSong.id);
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
    pauseSong();
  }
};

const setPlayerDisplay = () => {
  const currentTitle = userData.currentSong?.title;
  const currentArtist = userData.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const previousCurrentSong = document.querySelector(
    '.playlist-song[aria-current="true"]',
  );
  previousCurrentSong?.removeAttribute("aria-current");
  const songToHighlight = document.getElementById(
    `song-${userData.currentSong?.id}`,
  );

  songToHighlight?.setAttribute("aria-current", "true");
};

const setPlayButtonAccessibleText = () => {
  const song = userData.currentSong;
  playButton.setAttribute(
    "aria-label",
    userData.currentSong ? `Play ${song.title}` : "Play",
  );
};

playButton.addEventListener("click", () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
  } else {
    playSong(userData.currentSong.id, false);
  }
});

const songs = document.querySelectorAll(".playlist-song");

songs.forEach((song) => {
  const id = song.getAttribute("id").slice(5);
  const songBtn = song.querySelector("button");
  songBtn.addEventListener("click", () => {
    playSong(Number(id));
  });
});

pauseButton.addEventListener("click", pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

audio.addEventListener("ended", playNextSong);
>>>>>>> 64fa29deaa80bed1270aeadc3951555e61eafb43
