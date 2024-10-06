<script setup lang="ts">
import { FetchError } from "ofetch";

useHead({ title: "Search for Countdown" });

const CODE_LENGTH = 4;

const code = ref("");
const codeChars = Array.from({ length: CODE_LENGTH });
const charInputRefs = useTemplateRef<HTMLInputElement[]>("charInputRefs");

const searching = ref(false);
const error = ref<string | null>(null);

const router = useRouter();

onMounted(() => document.body.addEventListener("paste", onPaste));
onUnmounted(() => document.body.removeEventListener("paste", onPaste));

function onPaste(e: ClipboardEvent) {
	e.preventDefault();

	const paste = e.clipboardData?.getData("text");
	if (!paste || paste.length !== CODE_LENGTH) {
		return;
	}

	const chars = paste.split("");

	const inputs = charInputRefs.value;
	if (!inputs || inputs.length === 0) {
		throw new Error("No input refs found");
	}

	for (let i = 0; i < chars.length; i++) {
		inputs[i].value = chars[i].toUpperCase();
	}

	onSubmit();
}

async function onSubmit() {
	error.value = null;
	searching.value = true;

	code.value = charInputRefs
		.value!.map((i) => i.value)
		.join("")
		.toUpperCase();

	try {
		await $fetch("/api/codes", { params: { code: code.value } });
		router.push(`/countdown/${code.value}`);
	} catch (e) {
		console.error(e);

		if (e instanceof FetchError) {
			if (e.status === 404) {
				error.value = `Code ${code.value} not found`;
				charInputRefs.value!.forEach((i) => (i.value = ""));
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

function onInput(e: Event, i: number) {
	const target = e.target as HTMLInputElement;
	const value = target.value;

	const inputs = charInputRefs.value;
	if (!inputs || inputs.length === 0) {
		throw new Error("No input refs found");
	}

	inputs[i].value = value.toUpperCase();

	if (value.length > 0) {
		if (i === codeChars.length - 1) {
			inputs[i].blur();
			onSubmit();
		} else if (i < codeChars.length - 1) {
			inputs[i + 1].focus();
		}
	}
}

function onBackspace(_: Event, i: number) {
	if (i > 0) {
		const inputs = charInputRefs.value;
		if (!inputs || inputs.length === 0) {
			throw new Error("No input refs found");
		}

		inputs[i - 1].focus();
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

		<div class="flex gap-2 mb-8 mx-8 justify-center">
			<input
				v-for="(_, i) in codeChars"
				ref="charInputRefs"
				class="py-2 px-4 rounded border-2 border-gray-300"
				size="1"
				maxlength="1"
				@input="(e) => onInput(e, i)"
				@keydown.backspace="(e) => onBackspace(e, i)"
				:disabled="searching"
			/>
		</div>

		<div v-if="error" class="bg-red-100 text-red-800 p-4 text-center">
			{{ error }}
		</div>
	</div>
</template>
