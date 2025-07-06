ALTER TABLE "matches" ADD COLUMN "emoji1" text NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "emoji2" text NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "icebreakers" jsonb NOT NULL;