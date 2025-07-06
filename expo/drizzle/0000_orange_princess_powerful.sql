CREATE TABLE `data` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uniqueId` text NOT NULL,
	`answers` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_uniqueId_unique` ON `data` (`uniqueId`);