import { and, asc, count, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { _Countdown, _Person, _Vote, db } from "~/db";

export type PlayerVote = {
	id: number;
	title: string;
	videoId: string;
	thumbnailUrl: string;
	thumbnailLgUrl: string;
	personName: string;

	playedOn: string | null;
	count: number;
};

export async function getNextVote(
	countdownCode: string,
): Promise<PlayerVote | null> {
	const votes = await db
		.select({
			id: _Vote.id,
			title: _Vote.title,
			videoId: _Vote.videoId,
			thumbnailUrl: _Vote.thumbnailUrl,
			thumbnailLgUrl: _Vote.thumbnailLgUrl,
			playedOn: _Vote.playedOn,
			personName: _Person.name,
		})
		.from(_Vote)
		.innerJoin(_Person, eq(_Vote.personId, _Person.id))
		.innerJoin(_Countdown, eq(_Vote.countdownId, _Countdown.id))
		.where(
			and(
				isNull(_Vote.playedOn),
				eq(_Countdown.code, countdownCode.toUpperCase()),
			),
		)
		.limit(1)
		.orderBy(_Vote.sort);

	if (votes.length === 0) {
		return null;
	}

	const currentCount = await db
		.select({ count: count() })
		.from(_Vote)
		.innerJoin(_Countdown, eq(_Vote.countdownId, _Countdown.id))
		.where(
			and(
				eq(_Countdown.code, countdownCode.toUpperCase()),
				isNull(_Vote.playedOn),
			),
		);

	await db
		.update(_Vote)
		.set({ count: currentCount[0].count })
		.where(eq(_Vote.id, votes[0].id))
		.run();

	return { ...votes[0], count: currentCount[0].count };
}

export async function getCurrentVote(
	countdownCode: string,
): Promise<PlayerVote | null> {
	const votes = await db
		.select({
			id: _Vote.id,
			title: _Vote.title,
			videoId: _Vote.videoId,
			thumbnailUrl: _Vote.thumbnailUrl,
			thumbnailLgUrl: _Vote.thumbnailLgUrl,
			personName: _Person.name,
			playedOn: _Vote.playedOn,
			count: _Vote.count,
		})
		.from(_Vote)
		.innerJoin(_Person, eq(_Vote.personId, _Person.id))
		.innerJoin(_Countdown, eq(_Vote.countdownId, _Countdown.id))
		.where(
			and(
				isNotNull(_Vote.count),
				isNull(_Vote.playedOn),
				eq(_Countdown.code, countdownCode.toUpperCase()),
			),
		)
		.limit(1)
		.orderBy(desc(_Vote.sort));

	if (votes.length === 0) {
		return null;
	}

	const v = votes[0];

	return {
		...v,
		count: v.count || 0,
	};
}

export async function getNumberOne(
	countdownCode: string,
): Promise<PlayerVote | null> {
	const votes = await db
		.select({
			id: _Vote.id,
			title: _Vote.title,
			videoId: _Vote.videoId,
			thumbnailUrl: _Vote.thumbnailUrl,
			thumbnailLgUrl: _Vote.thumbnailLgUrl,
			personName: _Person.name,
			playedOn: _Vote.playedOn,
			count: _Vote.count,
		})
		.from(_Vote)
		.innerJoin(_Person, eq(_Vote.personId, _Person.id))
		.innerJoin(_Countdown, eq(_Vote.countdownId, _Countdown.id))
		.where(
			and(eq(_Vote.count, 1), eq(_Countdown.code, countdownCode.toUpperCase())),
		)
		.limit(1);

	if (votes.length === 0) {
		return null;
	}

	const v = votes[0];

	return {
		...v,
		count: v.count || 0,
	};
}

export async function markComplete(id: number) {
	const currentCount = await db
		.select({ count: count() })
		.from(_Vote)
		.innerJoin(_Countdown, eq(_Vote.countdownId, _Countdown.id))
		.where(isNull(_Vote.playedOn));

	return db
		.update(_Vote)
		.set({ playedOn: new Date().toISOString(), count: currentCount[0].count })
		.where(eq(_Vote.id, id))
		.run();
}
