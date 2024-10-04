<script setup lang="ts">
let player: any;

const isPaused = ref(false);
const isActive = ref(false);
const currentTrack = ref({
	name: "",
	album: {
		images: [{ url: "" }],
	},
	artists: [{ name: "" }],
});

if (typeof window !== "undefined") {
	(window as any).onSpotifyWebPlaybackSDKReady = () => {
		const token =
			"BQD-qAboxS3jsk_wi1Z6Rc-8f7kD3h-GqWhBi1yz0fXlWeJq6ykCvlLITz8HCB-doopcPpkEJKr15uXZ3trAGhdg4wqidc0_zc3fu97-Zw9nqwXW-IsTPylJdPdv9SZ3vnEsRsZl0ChGhNW8XR2KoWtWGUKdmxaR9kHTliPYYBG41pfAXh4hsmPxCD_LzbXaOYoAx5pQOdWyon05";

		player = new Spotify.Player({
			name: "Better100 Countdown",
			getOAuthToken: (cb: any) => {
				console.log("getOAuthToken");
				cb(token);
			},
			volume: 0.5,
		});

		(window as any).p = player;

		player.addListener("player_state_changed", (state) => {
			console.log("player_state_changed", state);

			if (!state) {
				return;
			}

			currentTrack.value = state.track_window.current_track;
			isPaused.value = state.paused;

			player.getCurrentState().then((state) => {
				if (!state) {
					isActive.value = false;
				} else {
					isActive.value = true;
				}
			});
		});

		player.addListener("autoplay_failed", (state) => {
			console.error(state);
		});

		// Ready
		player.addListener("ready", (e) => {
			console.log("Ready with Device ID", e, e.device_id);
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

		player.addListener("account_error", ({ message }) => {
			console.error(message);
		});

		player.connect();
	};
}

onMounted(() => {
	useHead({
		script: [{ src: "https://sdk.scdn.co/spotify-player.js", defer: true }],
	});
});

function togglePlay() {
	player.togglePlay();
}
</script>

<template>
	<div v-if="isActive">
		<div class="text-3xl text-center">{{ currentTrack.name }}</div>
		<div class="text-1xl text-center mb-4">
			{{ currentTrack.artists[0].name }}
		</div>
		<img :src="currentTrack.album.images[0].url" />

		<button
			v-if="isPaused"
			@click="togglePlay"
			class="px-4 py-1 my-4 bg-red-200"
		>
			Play
		</button>
		<button v-else @click="togglePlay" class="px-4 py-1 my-4 bg-blue-200">
			Pause
		</button>
	</div>
	<div v-else>
		<div class="text-3xl text-center mt-5">Connect in your spotify app</div>
	</div>
</template>
