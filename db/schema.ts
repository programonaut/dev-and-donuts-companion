import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Questionnaire } from '../app/(tabs)/match';
import type { EventStructure } from '../components/TimeTable';

export const data = sqliteTable("data", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    uniqueIdentifier: text("uniqueIdentifier").notNull().unique(),
});

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    name: text("name").notNull(),
    answers: text("answers", { mode: "json" }).$type<Questionnaire>(),
    uniqueIdentifier: text("uniqueIdentifier").notNull().references(() => data.uniqueIdentifier),
});

export const events = sqliteTable("events", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    date: text("date").notNull(),
    name: text("name").notNull().unique(),
    structure: text("structure", { mode: "json" }).notNull().default("{}").$type<EventStructure>(),
});

export const matches = sqliteTable("matches", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    userId1: integer("userId1").notNull().references(() => users.id),
    userId2: integer("userId2").notNull().references(() => users.id),
    reason: text("reason").notNull(),
});

// Export types to use as interfaces in your app
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Match = typeof matches.$inferSelect;