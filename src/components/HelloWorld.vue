<script setup lang="ts">
import { speak } from "./speak";
import {
  togglePlay,
  isPlayerReady,
  paused,
  currentTrack,
  changeSong,
} from "./spotify";

defineProps<{ msg: string }>();

async function playSong() {
  await togglePlay(false);
  speak("Number " + Math.floor(Math.random() * 100));
  setTimeout(() => togglePlay(true), 2000);
}

const songs = [
  "spotify:track:2dxXKqqpSV4eCgPxC6t8mn",
  "spotify:track:4nJuRd8cLin95rTr4B5sZP",
  "spotify:track:35seOt4wMvu7gWzYFwqNGh",
  "spotify:track:18DoMepvkwmJk4CPH0HCbk",
];

async function doNextSong() {
  await togglePlay(false);
  speak("Number " + Math.floor(Math.random() * 100));
  setTimeout(
    () => changeSong(songs[Math.floor(Math.random() * songs.length)]),
    2000
  );
}
</script>

<template>
  <h1>Better 100</h1>
  <div v-if="isPlayerReady">
    <button v-if="paused" @click="playSong">Play</button>
    <button v-else @click="togglePlay(false)">Pause</button>
    <button @click="doNextSong">Change Song</button>
  </div>

  <div className="main-wrapper" v-if="currentTrack">
    <img
      :src="currentTrack.album.images[0].url"
      className="now-playing__cover"
      alt=""
    />

    <div className="now-playing__side">
      <div className="now-playing__name">{{ currentTrack.name }}</div>

      <div className="now-playing__artist">
        {{ currentTrack.artists[0].name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
