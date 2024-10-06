<script setup lang="ts">
const route = useRoute();
const code = route.query.code as string;

const router = useRouter();

const response = await $fetch(`/api/spotify/callback`, { params: { code } });
const r = await fetch("https://api.spotify.com/v1/me", {
	headers: {
		Authorization: "Bearer " + response.access_token,
	},
});

const data = await r.json();

const countdownCode = localStorage.getItem("countdownCode");
localStorage.setItem("spotify_auth", JSON.stringify(response));

router.replace(`/countdown/${countdownCode}/countdown`);
</script>

<template>
	<div>{{ response }}</div>
	<div>{{ data }}</div>
</template>
