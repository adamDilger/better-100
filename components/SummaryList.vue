<script setup lang="ts">
type YoutubeItem = {
	id: string;
	title: string;
	thumbnailUrl: string;
	thumbnailLgUrl: string;
};

defineProps<{ votes: Array<YoutubeItem> }>();
const emit = defineEmits<{ remove: [YoutubeItem] }>();
</script>

<template>
	<div v-for="i in votes" class="flex justify-center items-center mb-2">
		<button
			class="text-red-500 font-bold mr-2 h-6 w-6 rounded flex items-center justify-center"
			@click="emit('remove', i)"
		>
			X
		</button>

		<div
			class="text-sm"
			style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
			v-html="i.title.replace(/\(.*\)$/, '').replace(/MUSIC|VIDEO/g, '')"
		></div>
	</div>
</template>
