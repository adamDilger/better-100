import { z } from "zod";
import { redirectUrl } from "./login.get";

const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.spotify.clientId;
const client_secret = runtimeConfig.spotify.clientSecret;

const callbackSchema = z.object({
	code: z.string(),
	//state: z.string(),
});

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, (q) => callbackSchema.parse(q));

	const code = query.code;

	const tokenRequestBody = {
		code: code,
		redirect_uri: redirectUrl,
		grant_type: "authorization_code",
	};

	const authHeader =
		"Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64");

	const res = await fetch("https://accounts.spotify.com/api/token", {
		body: new URLSearchParams(tokenRequestBody).toString(),
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: authHeader,
		},
	});

	if (!res.ok) {
		throw createError({ message: await res.text(), status: res.status });
	}

	const data = await res.json();

	return data;
});
