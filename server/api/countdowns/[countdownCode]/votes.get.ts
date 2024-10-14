import { count, eq } from "drizzle-orm";
import { _Person, _Vote, db } from "~/db";
import { getCountdown } from "~/utils/countdown";

export default defineEventHandler(async (event) => {
	const params = getRouterParams(event);

	const countdown = await getCountdown(params.countdownCode!);
	if (!countdown) {
		return new Response(JSON.stringify({ message: "Countdown not found" }), {
			status: 404,
		});
	}

	const results = await db
		.select({
			id: _Person.id,
			name: _Person.name,
			voteCount: count(_Vote.id),
		})
		.from(_Vote)
		.innerJoin(_Person, eq(_Vote.personId, _Person.id))
		.groupBy(_Person.id);

	return results;
});
