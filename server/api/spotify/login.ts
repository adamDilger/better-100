import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig();
	const accessToken = await readBody(event);

	console.log(
		"----------------------------------------------------------------------------------------------------------------------------",
		accessToken,
	);

	const hello = SpotifyApi.withAccessToken(
		runtimeConfig.spotify.clientId,
		accessToken,
	);

	console.log(hello);
});
