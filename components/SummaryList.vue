<script setup lang="ts">
import type { SearchItem } from "~/utils/types";
import { XMarkIcon } from "@heroicons/vue/20/solid";

defineProps<{ votes: Array<SearchItem> }>();
const emit = defineEmits<{ remove: [SearchItem] }>();
</script>

<template>
	<div v-for="(i, idx) in votes" class="flex justify-between items-center mb-5">
		<div class="flex items-center">
			<div
				class="mr-5 size-8 border border-cyan-700 text-cyan-700 rounded-full flex justify-center items-center font-bold"
			>
				{{ idx + 1 }}
			</div>

			<div
				class="flex flex-col"
				style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
			>
				<div class="text-sm mb-1">{{ i.title }}</div>
				<div class="font-bold text-xs">{{ i.artist }}</div>
			</div>
		</div>

		<button
			class="text-red-500 font-bold mr-4 h-6 w-6 rounded flex items-center justify-center"
			@click="emit('remove', i)"
		>
			<XMarkIcon class="size-6" />
		</button>
	</div>
</template>
