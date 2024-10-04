import { desc, eq, isNotNull } from "drizzle-orm";
import { _Person, _Vote, db } from "~/db";
import { getCountdown } from "~/utils/countdown";

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
			albumImageUrl: _Vote.albumImageUrl,
			count: _Vote.count,
		})
		.from(_Vote)
		.innerJoin(_Person, eq(_Person.id, _Vote.personId))
		.where(isNotNull(_Vote.playedOn))
		.orderBy(desc(_Vote.playedOn));

	// todo: if started, get current playing song
	return played;
});
