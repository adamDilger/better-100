import { getCountdown } from "~/utils/countdown";
import { getNextVote } from "~/utils/vote";

export default defineEventHandler(async (event) => {
	const params = getRouterParams(event);
	const code = params.countdownCode;

	const countdown = await getCountdown(code);
	if (!countdown) {
		throw createError({
			statusCode: 404,
			statusMessage: "Countdown not found",
		});
	}

	const vote = await getNextVote(countdown.code);
	if (!vote) {
		return new Response(JSON.stringify({ message: "No votes left" }), {
			status: 404,
		});
	}

	return vote;
});
