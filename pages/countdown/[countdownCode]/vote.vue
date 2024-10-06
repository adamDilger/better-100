<script setup lang="ts">
import { debouncedWatch } from "@vueuse/core";
import { _Countdown } from "~/db";
import type { YoutubeItem } from "~/utils/types";
import { PlusIcon } from "@heroicons/vue/20/solid";

const countdownCode = useRoute().params.countdownCode as string;
const router = useRouter();

const event = await $fetch(`/api/countdowns/${countdownCode}`);
if (!event) {
	navigateTo(`/`);
}

if (event.started) {
	navigateTo(`/countdown/${countdownCode}`);
}

useHead({ title: () => event.name });

const MAX_VOTE_COUNT = event.maxVoteCount || 5;

let nameInput: HTMLInputElement | undefined;

const error = ref<string | null>(null);
const searching = ref(false);
const search = ref("");
const votes = ref<Array<YoutubeItem>>([]);
const votesConfirmed = ref(false);
const submitting = ref(false);

const name = ref("");
const responseMessage = ref<Array<YoutubeItem> | null>(null);

debouncedWatch(search, () => doSearch(), {
	debounce: 500,
});

async function doSearch() {
	if (search.value.length < 3) {
		responseMessage.value = null;
		return;
	}

	searching.value = true;

	try {
		const response = await $fetch("/api/songs/search", {
			params: { search: search.value },
		});
		searching.value = false;

		if (response) {
			responseMessage.value = response as any /* todo */;
		}
	} catch (e) {
		error.value = "Failed to search for songs";
		searching.value = false;
		throw new Error(`Failed to submit search`);
	}
}

function addVote(i: YoutubeItem) {
	votes.value = [...votes.value, { ...i }];
	responseMessage.value = null;
	search.value = "";
}

function confirmVotes() {
	votesConfirmed.value = true;
	nameInput?.focus();
}

async function submitVotes() {
	submitting.value = true;
	try {
		await $fetch(`/api/countdowns/${countdownCode}/votes`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: name.value,
				votes: votes.value.map((v) => ({
					id: v.id,
					title: v.title,
					thumbnailUrl: v.thumbnailUrl,
					thumbnailLgUrl: v.thumbnailLgUrl,
				})),
			}),
		});
	} catch (e) {
		error.value = "Failed to submit votes";
		submitting.value = false;
		throw new Error(`Failed to submit votes`);
	}

	router.replace(`/countdown/${countdownCode}/tnx`);
}
</script>

<template>
	<div v-if="error" class="bg-red-100 text-red-800 p-4 text-center">
		Something fkd up: {{ error }}
	</div>

	<div
		v-if="votesConfirmed"
		class="flex flex-col gap-2 mb-8 px-8 items-center py-4 w-full"
	>
		<input
			ref="nameInput"
			type="text"
			name="name"
			placeholder="Your name"
			class="p-2 rounded flex-1 border-2 border-gray-300 w-full"
			v-model="name"
			autocomplete="off"
		/>

		<button
			class="py-2 px-3 bg-cyan-700 active:bg-cyan-800 text-white disabled:bg-cyan-600/30 rounded mt-2"
			@click="submitVotes"
			:disabled="name.length < 4 || submitting"
		>
			{{ submitting ? "Voting..." : "VOTE!" }}
		</button>
	</div>

	<div v-else class="flex flex-col pt-3 pb-5">
		<h2 class="text-center font-light mb-6 text-sm text-red-900/70">
			{{ event.name }}
		</h2>

		<div
			v-if="votes.length < MAX_VOTE_COUNT"
			class="flex gap-2 mb-8 mx-8 items-center"
		>
			<div
				class="inline-block rounded-md bg-white bg-gradient-to-r bg-[length:200%_200%] p-[3px] w-full"
				:class="{
					'from-red-400 to-amber-600 animate-border': searching,
					'from-red-200 to-red-200 focus-within:from-red-300 focus-within:to-red-300':
						!searching,
				}"
			>
				<input
					type="text"
					name="search"
					placeholder="Song/artist..."
					class="rounded outline-none p-2 w-full"
					v-model="search"
					autocomplete="off"
				/>
			</div>
		</div>

		<div v-if="responseMessage" class="mx-4 divide-y divide-gray-300 relative">
			<div v-if="responseMessage.length === 0" class="text-center">
				No results
			</div>
			<div
				v-for="i in responseMessage"
				:key="i.id"
				class="flex items-center space-between bg-white/80"
			>
				<div class="flex items-center flex-1">
					<img :src="i.thumbnailUrl" class="rounded-l p-3 size-24" />
					<div class="flex flex-col">
						<p class="pl-3" v-html="i.title"></p>
					</div>
				</div>

				<button
					class="bg-red-100 active:bg-red-200 text-red-800 mx-4 size-9 rounded-full flex items-center justify-center"
					@click="addVote(i)"
				>
					<PlusIcon class="size-5" />
				</button>
			</div>
		</div>

		<template v-else-if="votes.length === MAX_VOTE_COUNT">
			<VoteSummary
				:votes="votes"
				:max-vote-count="MAX_VOTE_COUNT"
				@remove="(i) => (votes = votes.filter((v) => v.id !== i.id))"
			/>

			<div class="flex flex-col items-center mt-5">
				<button
					class="py-2 px-3 bg-cyan-700 active:bg-cyan-900 text-white disabled:bg-cyan-600 rounded h-full"
					@click="confirmVotes"
				>
					Confirm Votes
				</button>
			</div>
		</template>

		<VoteSummary
			v-else-if="votes.length < MAX_VOTE_COUNT"
			:votes="votes"
			:max-vote-count="MAX_VOTE_COUNT"
			@remove="(i) => (votes = votes.filter((v) => v.id !== i.id))"
		/>
	</div>
</template>
