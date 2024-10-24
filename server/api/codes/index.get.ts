import { eq } from "drizzle-orm";
import { z } from "zod";
import { _Countdown, db } from "~/db";

const searchSchema = z.object({
	code: z.string().min(4).max(4),
});

export default defineEventHandler(async (event) => {
	const result = await getValidatedQuery(event, (body) =>
		searchSchema.parse(body),
	);
	const code = result.code;

	await new Promise((resolve) => setTimeout(resolve, 500));

	let res = await db
		.select({ name: _Countdown.name, code: _Countdown.code })
		.from(_Countdown)
		.limit(1)
		.where(eq(_Countdown.code, code.toUpperCase()));

	if (res.length === 0) {
		throw createError({ statusCode: 404, statusMessage: "Code not found" });
	}

	const data = res[0];
	return data;
});
