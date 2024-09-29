import { and, eq, isNull } from "drizzle-orm";
import { _Countdown, db } from "~/db";

const CODE_LENGTH = 4;

export async function getCountdown(code: string) {
	const countdowns = await db
		.select()
		.from(_Countdown)
		.where(eq(_Countdown.code, code.toUpperCase()))
		.limit(1);

	if (!countdowns.length) {
		return null;
	}

	return countdowns[0];
}

export async function createCountdown(
	countdownName: string,
	maxVoteCount: number,
) {
	let code: string;

	let exists = false;
	do {
		code = makeCode();

		const existing_Countdowns = await db
			.select({ id: _Countdown.id })
			.from(_Countdown)
			.where(eq(_Countdown.code, code));

		exists = existing_Countdowns.length > 0;
		if (exists) console.log(`Code ${code} exists, trying again`);
	} while (exists);

	let c: any;
	try {
		c = await db
			.insert(_Countdown)
			.values({ code, name: countdownName, maxVoteCount: maxVoteCount })
			.execute();
		console.log("_Countdown created:", countdownName, code);
	} catch (error: any) {
		console.error(
			`Failed to create countdown: ${countdownName}`,
			error.message,
		);
		throw error;
	}

	return code;
}

export async function markCountdownStarted(id: number) {
	return db
		.update(_Countdown)
		.set({ started: new Date().toISOString() })
		.where(and(eq(_Countdown.id, id), isNull(_Countdown.started)))
		.run();
}

function makeCode(length = CODE_LENGTH) {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}
