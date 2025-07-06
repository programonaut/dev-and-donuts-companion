CREATE TABLE `data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uniqueIdentifier` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_uniqueIdentifier_unique` ON `data` (`uniqueIdentifier`);--> statement-breakpoint
DROP INDEX `users_name_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `uniqueIdentifier` text NOT NULL REFERENCES data(uniqueIdentifier);