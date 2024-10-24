import { and, asc, eq, isNotNull } from "drizzle-orm";
import { _Countdown, _Person, _Vote, db } from "~/db";
import { getCountdown } from "~/utils/countdown";
import { getCurrentVote } from "~/utils/vote";

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

	const played = await db
		.select({
			voterName: _Person.name,
			title: _Vote.title,
			thumbnailUrl: _Vote.thumbnailUrl,
			count: _Vote.count,
		})
		.from(_Vote)
		.innerJoin(_Person, eq(_Person.id, _Vote.personId))
		.innerJoin(_Countdown, eq(_Countdown.id, _Vote.countdownId))
		.where(and(eq(_Countdown.id, countdown.id), isNotNull(_Vote.playedOn)))
		.orderBy(asc(_Vote.count));

	if (countdown.started) {
		const currentVote = await getCurrentVote(countdown.code);
		if (currentVote) {
			played.unshift({
				voterName: currentVote.personName,
				title: currentVote.title,
				thumbnailUrl: currentVote.thumbnailUrl,
				count: currentVote.count,
			});
		}
	}

	// todo: if started, get current playing song
	return played;
});
