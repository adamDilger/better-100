import { getCountdown } from "~/utils/countdown";
import { getNextVote } from "~/utils/vote";

export default defineEventHandler(async (event) => {
	const params = getRouterParams(event);
	const code = params.countdownCode;

	const countdown = await getCountdown(code);
	if (!countdown) {
		throw createError({
			statusMessage: "Countdown not found",
			statusCode: 404,
		});
	}

	const vote = await getNextVote(countdown.code);
	if (!vote) {
		throw createError({ message: "No votes left", statusCode: 404 });
	}

	return vote;
});
