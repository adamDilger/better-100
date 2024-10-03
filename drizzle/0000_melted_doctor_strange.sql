CREATE TABLE `countdown` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`started` text,
	`maxVoteCount` integer DEFAULT 5 NOT NULL,
	`password` text
);
--> statement-breakpoint
CREATE TABLE `person` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vote` (
	`id` integer PRIMARY KEY NOT NULL,
	`countdownId` integer NOT NULL,
	`personId` integer NOT NULL,
	`spotifyId` text NOT NULL,
	`title` text NOT NULL,
	`artist` text NOT NULL,
	`albumImageUrl` text NOT NULL,
	`playedOn` text,
	`count` integer,
	`sort` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `countdown_code_unique` ON `countdown` (`code`);