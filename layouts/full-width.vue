<script setup lang="ts"></script>

<template>
  <main class="bg-red-50">
    <div class="flex flex-col mx-auto h-full py-7">
      <a href="/">
        <img
          src="/better100.svg"
          alt="better logo"
          class="mx-auto"
          style="width: 200px"
        />
      </a>
      <slot></slot>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100%;
}
</style>
