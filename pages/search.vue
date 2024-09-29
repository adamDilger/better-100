<script setup lang="ts">
import { FetchError } from "ofetch";
const code = ref("");
const searching = ref(false);
const error = ref<string | null>(null);

const router = useRouter();

async function onSubmit() {
	error.value = null;
	searching.value = true;

	try {
		await $fetch("/api/codes", { params: { code: code.value } });
		router.push(`/countdown/${code.value}`);
	} catch (e) {
		console.error(e);

		if (e instanceof FetchError) {
			if (e.status === 404) {
				error.value = `Code ${code.value} not found`;
				searching.value = false;
				return;
			}

			error.value = "Failed to search for code";

			throw new Error(`Failed to submit search: ${e.status} ${e.statusText}`);
		}

		error.value = "Failed to search for code";
	} finally {
		searching.value = false;
	}
}
</script>

<template>
	<h2 class="text-center text-2xl font-light pt-10 pb-8 mx-8">
		Host your own <span class=""><s>hottest</s></span> better 100
	</h2>

	<div class="gap-5 pt-4 px-8 text-center">
		<div class="flex md:flex-row justify-center gap-6 flex-col mb-4">
			What's the code to your better 100 countdown?
		</div>

		<form
			id="search-form"
			@submit.prevent="onSubmit"
			class="flex gap-2 mb-8 mx-8 items-center"
		>
			<input
				name="code"
				placeholder="ABCD"
				maxlength="4"
				minlength="4"
				class="p-2 rounded flex-1 border-2 border-gray-300"
				v-model="code"
			/>

			<button
				class="py-2 px-3 bg-cyan-700 active:bg-cyan-800 text-white disabled:bg-cyan-600/30 rounded"
				type="submit"
				:disabled="searching"
			>
				{{ searching ? "Searching..." : "Search" }}
			</button>
		</form>

		<div v-if="error" class="bg-red-100 text-red-800 p-4 text-center">
			{{ error }}
		</div>
	</div>
</template>
