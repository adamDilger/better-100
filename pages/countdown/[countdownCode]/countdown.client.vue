<script setup lang="ts">
import { _Countdown } from "~/db";

definePageMeta({ layout: "full-width" });

const route = useRoute();
const router = useRouter();
const countdownCode = route.params.countdownCode as string;

const validLogin = ref(false);

const countdown = await $fetch(`/api/countdowns/${countdownCode}`);
if (!countdown) {
	router.replace("/");
}

async function spotifyLogin() {
	console.log("login");
	window.localStorage.setItem("countdownCode", countdownCode);
	window.location.href = `/api/spotify/login`;
}

onMounted(() => {
	if (!window.localStorage.getItem("spotify_auth")) {
		spotifyLogin();
		return;
	}

	validLogin.value = true;
	useHead({
		script: [{ src: "https://sdk.scdn.co/spotify-player.js", defer: true }],
	});
});
</script>

<template>
	<ClientOnly>
		<SpotifyPlayer v-if="validLogin" :countdownCode="countdown.code" />
	</ClientOnly>
</template>
