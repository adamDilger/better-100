<script setup lang="ts"></script>

<template>
	<main>
		<div class="flex flex-col mx-auto h-full py-7 max-w-xl">
			<div>
				<a href="/">
					<img
						src="/better100.svg"
						alt="better logo"
						class="mx-auto"
						style="width: 200px"
					/>
				</a>
			</div>

			<slot></slot>
		</div>
	</main>
</template>

<style scoped>
main {
	height: 100%;
}
</style>
