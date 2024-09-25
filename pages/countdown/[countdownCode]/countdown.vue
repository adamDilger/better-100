<script setup lang="ts">
import { _Countdown } from "~/db";

definePageMeta({ layout: "full-width" });

const route = useRoute();
const router = useRouter();
const countdownCode = route.params.countdownCode as string;

const countdown = await $fetch(`/api/countdowns/${countdownCode}`);
if (!countdown) {
  router.replace("/");
}

onMounted(() => {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
});
</script>

<template>
  <!-- <h2 class="text-center text-1xl font-light pt-10">{{ countdown.name }}</h2> -->
  <ClientOnly>
    <YtPlayer :countdownCode="countdownCode" />
  </ClientOnly>
</template>
