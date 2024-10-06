<script setup lang="ts">
useSeoMeta({
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | better100` : `better100`;
	},
	ogTitle: "better 100",
	description:
		"Host your own version of a Hottest 100 of all your favourite songs",
	ogDescription:
		"Host your own version of a Hottest 100 of all your favourite songs",
	ogImage: "https://better100.au/better100.png",
	twitterCard: "summary_large_image",
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style lang="postcss">
root,
body,
html,
#__nuxt {
	height: 100%;
	@apply bg-red-50;
}
</style>
