CREATE TABLE `cloud_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`creator_run_id` text NOT NULL,
	`state` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`created` integer NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`creator_run_id`) REFERENCES `cloud_runs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cloud_challenges_creator_run_id_unique` ON `cloud_challenges` (`creator_run_id`);--> statement-breakpoint
CREATE TABLE `cloud_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`prompt_id` text NOT NULL,
	`prompt_version` integer NOT NULL,
	`submitted` text NOT NULL,
	`explanation` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cloud_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`state` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`created` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `cloud_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `cloud_runs_session` ON `cloud_runs` (`session_id`);--> statement-breakpoint
CREATE TABLE `cloud_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`csrf` text NOT NULL,
	`created` integer NOT NULL
);
