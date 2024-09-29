import { z } from "zod";
import { _Person, _Vote, db } from "~/db";
import { getCountdown } from "~/utils/countdown";

const votesSchema = z.object({
	name: z.string().max(30).min(4),
	votes: z
		.array(
			z.object({
				title: z.string(),
				id: z.string(),
				thumbnailUrl: z.string(),
				thumbnailLgUrl: z.string(),
			}),
		)
		.nonempty()
		.max(10),
});

export default defineEventHandler(async (event) => {
	const params = getRouterParams(event);
	const body = await readValidatedBody(event, (body) =>
		votesSchema.parse(body),
	);

	console.log(body);

	const countdown = await getCountdown(params.countdownCode!);
	if (!countdown) {
		return new Response(JSON.stringify({ message: "Countdown not found" }), {
			status: 404,
		});
	}

	if (countdown.started) {
		return new Response(
			JSON.stringify({ message: "Voting has closed for this countdown" }),
			{
				status: 400,
			},
		);
	}

	const person = await db.insert(_Person).values({ name: body.name }).execute();
	if (!person.lastInsertRowid) {
		return new Response(
			JSON.stringify({ message: "Failed to insert person" }),
			{ status: 500 },
		);
	}

	console.log(`created person ${body.name}: ${person.lastInsertRowid}`);

	await db
		.insert(_Vote)
		.values(
			body.votes.map((v) => ({
				sort: Math.floor(Math.random() * 1000000000),
				personId: Number(person.lastInsertRowid),
				countdownId: countdown.id,
				title: v.title,
				thumbnailUrl: v.thumbnailUrl,
				thumbnailLgUrl: v.thumbnailLgUrl,
				videoId: v.id,
				playedOn: null,
			})),
		)
		.execute();

	return new Response(JSON.stringify({ message: "Votes submitted" }));
});
