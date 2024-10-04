<script setup lang="ts">
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { _Countdown } from "~/db";

definePageMeta({ layout: "full-width" });

const route = useRoute();
const router = useRouter();
const countdownCode = route.params.countdownCode as string;

const countdown = await $fetch(`/api/countdowns/${countdownCode}`);
if (!countdown) {
	router.replace("/");
}

const { clientId } = useRuntimeConfig().public.spotify;

async function spotifyLogin() {
	console.log("login");

	const api = await SpotifyApi.performUserAuthorization(
		clientId,
		"http://localhost:3000/callback/spotify",
		[
			// "ugc-image-upload",
			"user-read-playback-state",
			"user-modify-playback-state",
			"user-read-currently-playing",
			// "app-remote-control",
			"streaming",
			"playlist-read-private",
			"playlist-read-collaborative",
			"playlist-modify-private",
			"playlist-modify-public",
			"user-follow-modify",
			"user-follow-read",
			"user-read-playback-position",
			"user-top-read",
			"user-read-recently-played",
			"user-library-modify",
			"user-library-read",
			"user-read-email",
			"user-read-private",
			// "user-soa-link",
			// "user-soa-unlink",
			// "soa-manage-entitlements",
			// "soa-manage-partner",
			// "soa-create-partner",
		],
		"http://localhost:3000/api/spotify/login",
	);

	console.log("api", api);

	// api.getAccessToken().then((token) => {
	// 	console.log("token", token);
	// });
}

onMounted(() => {
	useHead({
		script: [{ src: "https://sdk.scdn.co/spotify-player.js", defer: true }],
	});
});
</script>

<template>
	<!-- <h2 class="text-center text-1xl font-light pt-10">{{ countdown.name }}</h2> -->
	<ClientOnly>
		<button @click="spotifyLogin">login</button>

		<!-- <SpotifyPlayer :countdownCode="countdown.code" /> -->
	</ClientOnly>
</template>
