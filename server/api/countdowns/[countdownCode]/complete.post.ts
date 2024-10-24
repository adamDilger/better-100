import { getCountdown, markCountdownFinished } from "~/utils/countdown";
import { getNextVote, getNumberOne, markComplete } from "~/utils/vote";

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

	const voteToComplete = await getNextVote(countdown.code);
	if (!voteToComplete) {
		throw createError({
			message: "No votes left",
			statusCode: 404,
		});
	}

	await markComplete(countdown.id, voteToComplete.id);

	const nextVote = await getNextVote(countdown.code);
	if (!nextVote) {
		if (!countdown.finished) {
			// return number 1 again... as per
			const currentVote = await getNumberOne(countdown.code);
			await markCountdownFinished(countdown.id);
			return currentVote;
		}

		throw createError({
			message: "No votes left",
			statusCode: 404,
		});
	}

	return nextVote;
});
