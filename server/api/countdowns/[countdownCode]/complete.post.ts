import { getCountdown } from "~/utils/countdown";
import { getNextVote, markComplete } from "~/utils/vote";

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
		return new Response(JSON.stringify({ message: "No votes left" }), {
			status: 404,
		});
	}

	await markComplete(voteToComplete.id);

	const nextVote = await getNextVote(countdown.code);
	if (!nextVote) {
		return new Response(JSON.stringify({ message: "No votes left" }), {
			status: 404,
		});
	}

	return nextVote;
});
