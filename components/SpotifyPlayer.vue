<script setup lang="ts">
import { Spot } from "~/utils/spotify";

const props = defineProps<{ countdownCode: string }>();

const playerReady = ref(false);
const countdownStarted = ref(false);
const voteCount = ref(0);
const changingVote = ref(false);
const votePersonName = ref("");

const isPaused = ref(false);
const isActive = ref(false);
const currentTrack = ref({
	name: "",
	album: {
		images: [{ url: "" }],
	},
	artists: [{ name: "" }],
});

/*


start
	pause
	empty queue
	get song from list




*/

const voices = window.speechSynthesis.getVoices();

const auth = JSON.parse(window.localStorage.getItem("spotify_auth")!);
let spot: Spot | null = null;

let player: {
	addListener: (event: string, cb: (state: any) => void) => void;
	getCurrentState: () => Promise<any>;
	connect: () => void;
};
(window as any).onSpotifyWebPlaybackSDKReady = initPlayer;
onMounted(initPlayer);

function initPlayer() {
	if (!window) return console.warn("no window");
	if (!(window as any).Spotify) return console.warn("Spotify not loaded");
	if (player) return console.warn("Spotify player alread initialised ");

	const token = auth.access_token;
	console.log(token);

	// @ts-expect-error Spotify is not defined
	player = new Spotify.Player({
		name: "Better100 Countdown",
		getOAuthToken: (cb: any) => {
			console.log("getOAuthToken");
			cb(token);
		},
		volume: 0.5,
	});

	(window as any).p = player;

	player.addListener("player_state_changed", onPlayerStateChange);

	player.addListener("autoplay_failed", (state) => {
		console.error(state);
	});

	// Ready
	player.addListener("ready", (e) => {
		console.log("Ready with Device ID", e, e.device_id);
		playerReady.value = true;
		spot = new Spot(auth, e.device_id);
	});

	// Not Ready
	player.addListener("not_ready", ({ device_id }) => {
		console.log("Device ID has gone offline", device_id);
		playerReady.value = false;
	});

	player.addListener("initialization_error", console.error);
	player.addListener("authentication_error", console.error);
	player.addListener("account_error", console.error);

	player.connect();
}

async function onPlayerStateChange(state: any) {
	console.log("onPlayerStateChange", state);

	// if (event.data == YT.PlayerState.ENDED) {
	// 	console.log("video ended");
	// 	const nextVote = await markComplete();
	// 	update(nextVote);
	// }

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
}

async function firstSong() {
	await $fetch(`/api/countdowns/${props.countdownCode}/start`, {
		method: "POST",
	});
	const data = await $fetch(`/api/countdowns/${props.countdownCode}/next`, {
		method: "POST",
	});

	update(data);
	countdownStarted.value = true;
}

async function markComplete(): Promise<PlayerVote> {
	const res = await $fetch(`/api/countdowns/${props.countdownCode}/complete`, {
		method: "POST",
	});
	return res as any;
}

function startCountdown() {
	firstSong();
}

async function update(vote: PlayerVote) {
	if (!vote || vote.count === 0) {
		countdownStarted.value = false;
		alert("No votes left!");
		return;
	}

	voteCount.value = vote.count;
	votePersonName.value = vote.personName;

	changingVote.value = true;
	setTimeout(() => (changingVote.value = false), 1000);

	await speakNumber(vote.count);
	enqueSong(vote);
}

function enqueSong(vote: PlayerVote) {}

async function speakNumber(i: number) {
	let msg = new SpeechSynthesisUtterance();
	msg.voice = voices[1];
	msg.text = "Number " + i;
	msg.lang = "en-US";

	speechSynthesis.speak(msg);

	await new Promise<void>((res) => {
		msg.onend = function (e) {
			console.log("Finished in " + e.elapsedTime + " seconds.");
			res();
		};
	});
}
</script>

<template>
	<main class="flex flex-col container mx-auto h-full py-7">
		<div
			v-if="!countdownStarted"
			class="flex-1 flex justify-center items-center mx-4"
		>
			<button
				class="text-3xl bg-red-500 text-white px-14 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 border-4 border-red-600"
				@click="startCountdown"
				:disabled="!playerReady"
			>
				Start the Count!
			</button>
		</div>

		<div
			class="flex flex-col justify-center items-center relative"
			:style="{ display: countdownStarted ? 'block' : 'none' }"
		>
			<div
				class="top-0 bottom-0 right-0 left-0 bg-black absolute flex items-center justify-center font-extrabold text-white number-overlay"
				style="font-size: 100px"
				:class="{ showing: changingVote }"
			>
				{{ voteCount }}
			</div>

			<div class="absolute top-6 right-6 bg-white px-3 rounded">
				<div class="text-4xl font-bold text-red-500">{{ voteCount }}</div>
			</div>

			<img
				id="player"
				style="height: 80vh; width: 100%"
				:src="currentTrack.album.images[0].url"
			/>
			<p id="voted-by" class="text-center text-lg font-light mt-3">
				Voted by {{ votePersonName }}
			</p>
		</div>
	</main>
</template>

<style scoped>
.number-overlay {
	height: 80vh;
	pointer-events: none;
	opacity: 0;
	transition: opacity 2s;
}

.number-overlay.showing {
	opacity: 1;
	transition: opacity 0s;
}
</style>
