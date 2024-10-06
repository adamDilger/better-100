<script setup lang="ts">
const route = useRoute();
const countdownCode = route.params.countdownCode as string;

const { data: countdown, error: countdownError } = await useFetch(
	`/api/countdowns/${countdownCode}`,
);
const { data: played } = await useFetch(
	`/api/countdowns/${countdownCode}/played`,
);
</script>

<template>
	<div v-if="countdownError" class="text-center py-10">
		Countdown not found for code: {{ countdownCode }}
		<button @click="$router.push('/')">Back</button>
	</div>
	<template v-else>
		<h2 class="text-center text-1xl font-light pt-10">{{ countdown?.name }}</h2>

		<div class="px-8">
			<div v-if="!countdown?.started" class="text-center">
				<div class="text-2xl font-light pt-8 pb-4 mb-4">
					Countdown not started
				</div>
				<div class="text-sm mx-12">
					The countdown list will appear here when it's started.
				</div>

				<div class="text-center mt-8">
					<p class="mb-4">
						If you're trying to vote in the countown, you can go to the voting
						screen here
					</p>

					<button
						@click="$router.push(`/countdown/${countdownCode}/vote`)"
						class="py-2 px-3 bg-cyan-700 active:bg-cyan-800 text-white disabled:bg-cyan-600/30 rounded"
					>
						Vote now
					</button>
				</div>

				<div class="text-center mt-8">
					<p class="mb-4">Is the voting finished?</p>

					<button
						@click="$router.push(`/countdown/${countdownCode}/countdown`)"
						class="py-2 px-3 bg-red-600 active:bg-red-800 text-white disabled:bg-red-600/30 rounded"
					>
						Start countdown
					</button>
				</div>
			</div>

			<template v-else-if="played!.length === 0">
				<h3 class="text-center text-2xl font-light pt-6 pb-4">Played songs</h3>
				<div class="text-center text-2xl font-light pt-10 pb-4">TBD</div>
			</template>

			<div class="divide-y divide-red-200">
				<div v-for="vote in played" class="flex items-center py-6">
					<div class="text-4xl pr-6 font-bold text-red-500">
						{{ vote.count }}
					</div>

					<img :src="vote.albumImageUrl" class="min-h-18" />

					<div class="pl-4">
						<div class="text-lg font-bold" v-html="vote.title"></div>
						<div class="text-sm">{{ vote.voterName }}</div>
					</div>
				</div>
			</div>
		</div>
	</template>
</template>
