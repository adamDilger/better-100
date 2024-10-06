<script setup lang="ts">
import type { YoutubeItem } from "~/utils/types";
import { XMarkIcon } from "@heroicons/vue/20/solid";

defineProps<{ votes: Array<YoutubeItem> }>();
const emit = defineEmits<{ remove: [YoutubeItem] }>();
</script>

<template>
	<div v-for="(i, idx) in votes" class="flex justify-between items-center mb-5">
		<div class="flex items-center">
			<div
				class="mr-5 size-8 border border-cyan-700 text-cyan-700 rounded-full flex justify-center items-center font-bold"
			>
				{{ idx + 1 }}
			</div>

			<div class="flex flex-col text-wrap text-sm" v-html="i.title"></div>
		</div>

		<button
			class="text-red-500 font-bold mr-2 h-6 w-6 rounded flex items-center justify-center"
			@click="emit('remove', i)"
		>
			<XMarkIcon class="size-6" />
		</button>
	</div>
</template>
