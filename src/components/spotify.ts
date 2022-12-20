import { ref } from "vue";
import SpotifyWebApi from "spotify-web-api-js";

// @ts-ignore
window.onSpotifyWebPlaybackSDKReady = onReady;

const token =
  "BQAxobN7Xxyw-FZOhUfGqaUep6nf4cdAQLlzbQ-dAiTEAO1_46T7zXBebkW5qRizlZVvFeZX3_mlRnQwSYYvjDsQ1hgqqPuSBBU6SKzi_VJvGWUi1kk8nBQxa4v8eUcSsDyUdqbjDxW-BSSRnzdYSnRYDq6wDqqlcfylT-qXFvfrMmJsVETk4tVdhvkzPzf20MU";

let player: Spotify.Player;
let deviceId: string;

export const isPlayerReady = ref(false);

export const paused = ref(true);
export const currentTrack = ref<Spotify.Track | null>(null);

function onReady() {
  player = new Spotify.Player({
    name: "Better 100 :)",
    getOAuthToken: (cb: (token: string) => void) => cb(token),
    volume: 0.8,
  });

  player.addListener("ready", ({ device_id }) => {
    console.log("Ready with Device ID", device_id);
    deviceId = device_id;
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  player.addListener("initialization_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("authentication_error", ({ message }) => {
    console.error(message);
  });

  player.addListener("player_state_changed", (state: any) => {
    console.log("player_state_changed", state);
    if (!state) return;

    paused.value = state.paused === true;
    currentTrack.value = state.track_window.current_track;
  });

  player.addListener("account_error", ({ message }) => {
    console.error(message);
  });

  player.connect().then((v) => (isPlayerReady.value = v));
}

export function togglePlay(play?: boolean) {
  if (play !== undefined) {
    return play ? player.resume() : player.pause();
  }

  return player.togglePlay();
}

export function changeSong(uri = "spotify:track:5ZrjSdHy4o6kLNejvlthgx") {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(token);
  spotifyApi.play({
    device_id: deviceId,
    uris: [uri],
  });
}
