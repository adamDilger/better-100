import { drizzle } from "drizzle-orm/better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
// @ts-expect-error types
import Database from "better-sqlite3";
import { relations } from "drizzle-orm";
const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);

export const _Countdown = sqliteTable("countdown", {
	id: integer("id").primaryKey(),
	code: text("code").notNull().unique(),
	name: text("name").notNull(),
	started: text("started"),
	maxVoteCount: integer("maxVoteCount").notNull().default(5),
	password: text("password"),
});

export const _Person = sqliteTable("person", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
});

export const _Vote = sqliteTable("vote", {
	id: integer("id").primaryKey(),
	countdownId: integer("countdownId").notNull(),
	personId: integer("personId").notNull(),
	title: text("title").notNull(),
	videoId: text("videoId").notNull(),
	thumbnailUrl: text("thumbnailUrl").notNull(),
	thumbnailLgUrl: text("thumbnailLgUrl").notNull(),
	playedOn: text("playedOn"),
	count: integer("count"),
	sort: integer("sort"),
});

export const voteRelations = relations(_Vote, ({ one }) => ({
	person: one(_Person, {
		fields: [_Vote.personId],
		references: [_Person.id],
	}),
	countdown: one(_Countdown, {
		fields: [_Vote.countdownId],
		references: [_Countdown.id],
	}),
}));
