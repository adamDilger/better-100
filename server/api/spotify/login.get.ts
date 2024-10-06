const runtimeConfig = useRuntimeConfig();

const spotifyAccountsUrl = "https://accounts.spotify.com/authorize";
export const redirectUrl = runtimeConfig.public.baseUrl + "/spotify/callback";
const spotifyClientId = runtimeConfig.spotify.clientId;

export default defineEventHandler(async (event) => {
	const scope = [
		"user-read-private",
		"user-read-email",
		"user-read-playback-state",
		"user-modify-playback-state",
		"user-read-currently-playing",
		"streaming",
	].join(" ");

	const params = new URLSearchParams({
		response_type: "code",
		client_id: spotifyClientId,
		scope: scope,
		redirect_uri: redirectUrl,
	});

	const url = spotifyAccountsUrl + "?" + params.toString();

	return sendRedirect(event, url, 302);
});
