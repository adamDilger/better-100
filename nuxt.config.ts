// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: ["@nuxtjs/tailwindcss", "@nuxt/scripts"],
	runtimeConfig: {
		youtubeApiKey: process.env.YOUTUBE_API_KEY,

		public: {
			baseUrl: process.env.PUBLIC_BASE_URL,
		},
	},

	tailwindcss: {
		config: {
			theme: {
				extend: {
					animation: {
						border: "border 0.5s ease infinite",
					},
					keyframes: {
						border: {
							"0%, 100%": { backgroundPosition: "0% 50%" },
							"50%": { backgroundPosition: "100% 50%" },
						},
					},
				},
			},
		},
	},
});
