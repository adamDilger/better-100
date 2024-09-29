<script setup lang="ts">
const countdownCode = useRoute().params.countdownCode;

const baseUrl = useRuntimeConfig().public.baseUrl;

const copyText = ref("Copy");
async function copyToClipboard() {
	await navigator.clipboard.writeText(
		`${baseUrl}/countdown/${countdownCode}/vote`,
	);
	copyText.value = "Copied!";
}
</script>

<template>
	<div class="mx-8">
		<h2 class="text-center text-2xl font-light pt-10 pb-4">
			Countdown created!
		</h2>

		<div class="text-center text-2xl font-light pt-8 pb-4">
			Your Countdown code is:
			<span class="text-red-500 font-bold">{{ countdownCode }}</span>
		</div>

		<div class="text-center pt-4 pb-4">
			Make sure to save your Countdown code somewhere, as that's what you'll
			have to use to start the countdown.
		</div>

		<div class="text-center">
			<h3 class="text-lg mt-3 mb-4 font-bold">Voting Link</h3>

			<p class="pb-2">
				You'll need to share this link to the people you want to vote in the
				countdown
			</p>

			<span class="underline italic">
				{{ baseUrl }}/countdown/{{ countdownCode }}/vote
			</span>

			<button
				class="bg-cyan-700 px-2 py-1 text-white rounded ml-2"
				@click="copyToClipboard"
			>
				{{ copyText }}
			</button>
		</div>

		<div class="text-center mt-12">
			<h3 class="text-lg mt-3 mb-4 font-bold">Countdown Link</h3>
			<div class="mb-4">
				When you're ready to start the countdown, use the below link to go to
				the countdown screen, where you'll be able to start the countdown!
			</div>

			<span class="underline italic">
				{{ baseUrl }}/{{ countdownCode }}/countdown
			</span>
		</div>
	</div>
</template>
