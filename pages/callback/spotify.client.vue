<script setup lang="ts">
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

// get code query parameter
const route = useRoute();
const accessCode = route.query.code as string;
console.log(accessCode);

const { clientId } = useRuntimeConfig().public.spotify;
const api = SpotifyApi.withUserAuthorization(
	clientId,
	"http://localhost:3000/callback/spotify",
	[
		"user-read-playback-state",
		"user-modify-playback-state",
		"user-read-currently-playing",
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
		// "ugc-image-upload",
		// "app-remote-control",
		// "user-soa-link",
		// "user-soa-unlink",
		// "soa-manage-entitlements",
		// "soa-manage-partner",
		// "soa-create-partner",
	],
);

console.log("api", api);

// onMounted(() => {
// 	useHead({
// 		script: [{ src: "https://sdk.scdn.co/spotify-player.js", defer: true }],
// 	});
// });
</script>

<template>WORKED</template>
