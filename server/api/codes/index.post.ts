import { createCountdown } from "~/utils/countdown";
import { z } from "zod";

const newCountdownSchema = z.object({
	name: z.string(),
	maxVoteCount: z.number().min(1).max(10).default(5),
});

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) =>
		newCountdownSchema.parse(body),
	);

	try {
		const code = await createCountdown(result.name, result.maxVoteCount);
		return { code };
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: "Unknown Error" });
	}
});
