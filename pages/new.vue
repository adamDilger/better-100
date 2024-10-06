<script setup lang="ts">
useHead({ title: "New Countdown" });

const maxVotes = ref(5);
const countdownName = ref("");

const router = useRouter();

function increase() {
	const value = maxVotes.value;
	if (value < 10) {
		maxVotes.value = value + 1;
	}
}

function decrease() {
	const value = maxVotes.value;
	if (value > 1) {
		maxVotes.value = value - 1;
	}
}

async function submit() {
	const res = await $fetch("/api/codes", {
		method: "POST",
		body: JSON.stringify({
			name: countdownName.value,
			maxVoteCount: maxVotes.value,
		}),
	});

	router.push(`/countdown/${res.code}/new`);
}
</script>

<template>
	<h2 class="text-center text-2xl font-light pt-10 pb-8">
		Host your own <span><s>Hottest</s></span> Better 100
	</h2>

	<form
		class="flex flex-col gap-4 justify-center mx-8"
		@submit.prevent="submit"
	>
		<input
			class="py-2 px-2 border rounded"
			name="countdownName"
			placeholder="Countdown name"
			v-model="countdownName"
			required
			maxlength="30"
			minlength="4"
		/>

		<div>
			<div class="text-center">
				<label class="text-sm" for="maxVoteCount">Max votes per person</label>
			</div>

			<div class="flex justify-center py-4">
				<button
					id="decrease"
					type="button"
					class="h-10 w-10 bg-gray-200 active:bg-gray-300 rounded"
					@click="decrease"
				>
					-
				</button>
				<div id="max-votes" class="text-4xl font-bold px-8">{{ maxVotes }}</div>
				<button
					type="button"
					class="h-10 w-10 bg-gray-200 active:bg-gray-300 rounded"
					@click="increase"
				>
					+
				</button>
			</div>
		</div>

		<div class="text-center">
			<button
				class="bg-red-500 active:bg-red-600 px-12 py-2 rounded border-red-700 text-red-50 font-bold"
				type="submit"
			>
				Create Countdown
			</button>
		</div>
	</form>
</template>
