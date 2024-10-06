<script setup lang="ts">
const props = defineProps<{ countdownCode: string }>();

const playerReady = ref(false);
const countdownStarted = ref(false);
const voteCount = ref(0);
const changingVote = ref(false);
const votePersonName = ref("");

const voices = window.speechSynthesis.getVoices();

const router = useRouter();

let player: YT.Player;
(window as any).onYouTubeIframeAPIReady = initPlayer;
onMounted(initPlayer);

function initPlayer() {
	if (!(window as any).YT) return;
	if (player) return;

	player = new (window as any).YT.Player("player", {
		height: "390",
		width: "640",
		// videoId: 'ipe8cfJNt_o',
		playerVars: {
			playsinline: 1,
			// controls: 0,
			rel: 0,
			enablejsapi: 1,
		},
		events: {
			onReady: () => (playerReady.value = true),
			onStateChange: onPlayerStateChange,
		},
	});
}

async function onPlayerStateChange(event: YT.OnStateChangeEvent) {
	console.log("onPlayerStateChange", event);

	if (event.data == YT.PlayerState.PLAYING) {
		console.log("video playing");
	}

	if (event.data == YT.PlayerState.ENDED) {
		console.log("video ended");
		try {
			const nextVote = await markComplete();
			update(nextVote);
		} catch (e) {
			router.replace(`/countdown/${props.countdownCode}`);
			return;
		}
	}
}

async function firstSong() {
	await $fetch(`/api/countdowns/${props.countdownCode}/start`, {
		method: "POST",
	});

	try {
		const data = await $fetch(`/api/countdowns/${props.countdownCode}/next`, {
			method: "POST",
		});
		update(data as any);
		countdownStarted.value = true;
	} catch (e) {
		router.replace(`/countdown/${props.countdownCode}`);
		return;
	}
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

	if (vote.playedOn && vote.count === 1) {
		setTimeout(() => (changingVote.value = false), 3000);
		player.loadVideoById(vote.videoId);
		await speak(`Here it is again, your number ${vote.count}`);
	} else {
		setTimeout(() => (changingVote.value = false), 1000);
		await speakNumber(vote.count);
		player.loadVideoById(vote.videoId);
	}
}

function speakNumber(i: number) {
	return speak(`Number ${i}`);
}

async function speak(text: string) {
	let msg = new SpeechSynthesisUtterance();
	msg.voice = voices[1];
	msg.text = text;
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

			<div id="player" style="height: 80vh; width: 100%"></div>
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
