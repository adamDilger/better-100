<script setup lang="ts">
type YoutubeItem = {
	id: string;
	title: string;
	thumbnailUrl: string;
	thumbnailLgUrl: string;
};

defineProps<{
	votes: Array<YoutubeItem>;
	maxVoteCount: number;
}>();
const emit = defineEmits<{ remove: [YoutubeItem] }>();
</script>

<template>
	<div v-if="votes.length === 0" class="mt-3 text-center">
		<h3 class="text-center text-2xl font-light mb-4">
			Vote for your top
			<span class="font-bold text-red-900">{{ maxVoteCount }}</span> songs
		</h3>

		<p class="text-sm text-gray-700 px-8">
			These songs will be added to the better 100 countdown
		</p>
	</div>
	<div v-else class="mt-3 text-center">
		<div class="relative mb-4">
			<h3 class="text-center text-2xl font-light pb-0">Your Votes</h3>
			<div class="absolute right-10 top-2 text-xs mb-3 text-gray-400">
				{{ votes.length }}/{{ maxVoteCount }}
			</div>
		</div>

		<div class="mx-8">
			<SummaryList :votes="votes" @remove="(i) => emit('remove', i)" />
		</div>
	</div>
</template>
