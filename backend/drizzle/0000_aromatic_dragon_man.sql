CREATE TABLE IF NOT EXISTS "data" (
	"id" serial PRIMARY KEY NOT NULL,
	"uniqueId" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "data_uniqueId_unique" UNIQUE("uniqueId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"name" text NOT NULL,
	"structure" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "events_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id1" integer NOT NULL,
	"user_id2" integer NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"answers" jsonb,
	"uniqueId" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uniqueId_unique" UNIQUE("uniqueId")
);
--> statement-breakpoint
ALTER TABLE IF EXISTS "matches" DROP CONSTRAINT IF EXISTS "matches_user_id1_users_id_fk";--> statement-breakpoint
ALTER TABLE IF EXISTS "matches" DROP CONSTRAINT IF EXISTS "matches_user_id2_users_id_fk";--> statement-breakpoint
ALTER TABLE IF EXISTS "matches" ADD CONSTRAINT "matches_user_id1_users_id_fk" FOREIGN KEY ("user_id1") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE IF EXISTS "matches" ADD CONSTRAINT "matches_user_id2_users_id_fk" FOREIGN KEY ("user_id2") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;