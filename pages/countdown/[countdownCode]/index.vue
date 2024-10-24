<script setup lang="ts">
const route = useRoute();
const countdownCode = route.params.countdownCode as string;

const { data: countdown, error: countdownError } = await useFetch(
	`/api/countdowns/${countdownCode}`,
);

const { data: played } = await useFetch(
	`/api/countdowns/${countdownCode}/played`,
);

const { data: voteCounts } = await useFetch(
	`/api/countdowns/${countdownCode}/votes`,
);

const totalVoteCount = computed(() =>
	voteCounts.value?.reduce((acc, curr) => acc + curr.voteCount, 0),
);

useHead({ title: () => `${countdown.value?.name}` });
</script>

<template>
	<div v-if="countdownError" class="text-center py-10">
		Countdown not found for code: {{ countdownCode }}
		<button @click="$router.push('/')">Back</button>
	</div>
	<template v-else>
		<div class="pt-3 mb-4">
			<h2 class="text-center font-light text-sm text-red-900/70">
				{{ countdown?.name }}
			</h2>
		</div>

		<div class="px-8">
			<div v-if="!countdown?.started" class="text-center">
				<div class="text-2xl font-light pt-8 pb-4 mb-4">
					Countdown not started
				</div>

				<div class="text-sm mx-4 mb-8">
					The countdown list will appear here when it's started.
				</div>

				<div>
					<h3 class="text-xl font-bold">
						Current vote count - {{ totalVoteCount }}
					</h3>
					<div class="flex flex-col gap-2 mt-2">
						<div v-for="vote in voteCounts">
							{{ vote.name }} - {{ vote.voteCount }} votes
						</div>
					</div>
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

			<div v-if="played && played.length">
				<div class="flex items-center py-6 mb-8">
					<div class="text-6xl pr-6 font-bold text-red-500">
						{{ played[0].count }}
					</div>

					<div class="flex flex-col items-center">
						<div class="mb-4">
							<img :src="played[0].thumbnailUrl" class="h-24" />
						</div>

						<div class="pl-4 text-center">
							<div class="text-lg font-bold" v-html="played[0].title"></div>
							<div class="text-sm">{{ played[0].voterName }}</div>
						</div>
					</div>
				</div>

				<div class="divide-y divide-red-200">
					<div v-for="vote in played.slice(1)" class="flex items-center py-6">
						<div class="text-4xl pr-6 font-bold text-red-500">
							{{ vote.count }}
						</div>

						<img :src="vote.thumbnailUrl" class="h-12" />

						<div class="pl-4">
							<div class="text-lg font-bold" v-html="vote.title"></div>
							<div class="text-sm">{{ vote.voterName }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</template>
</template>
