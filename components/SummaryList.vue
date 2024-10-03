<script setup lang="ts">
import type { SearchItem } from "~/utils/types";

defineProps<{ votes: Array<SearchItem> }>();
const emit = defineEmits<{ remove: [SearchItem] }>();
</script>

<template>
	<div
		v-for="i in votes"
		class="flex text-left justify-center items-center mb-2"
	>
		<button
			class="text-red-500 font-bold mr-4 h-6 w-6 rounded flex items-center justify-center"
			@click="emit('remove', i)"
		>
			X
		</button>

		<div
			class="flex flex-col"
			style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
		>
			<div class="text-sm">{{ i.title }}</div>
			<div class="font-bold text-xs">{{ i.artist }}</div>
		</div>
	</div>
</template>
