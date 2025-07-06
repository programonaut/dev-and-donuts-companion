import { pgTable, serial, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import type { Questionnaire } from '../src/types';
import type { EventStructure } from '../src/types';

// Users table
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    answers: jsonb("answers").$type<Questionnaire>(), // JSON field for questionnaire answers
    uniqueId: text("uniqueId").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
    id: serial("id").primaryKey(),
    date: text("date").notNull(),
    name: text("name").notNull().unique(),
    structure: jsonb("structure").notNull().default("{}").$type<EventStructure>(), // JSON field for event structure
    createdAt: timestamp("created_at").defaultNow(),
});

// Matches table
export const matches = pgTable("matches", {
    id: serial("id").primaryKey(),
    userId1: integer("user_id1").notNull().references(() => users.id),
    userId2: integer("user_id2").notNull().references(() => users.id),
    reason: text("reason").notNull(),
    emoji1: text("emoji1").notNull(),
    emoji2: text("emoji2").notNull(),
    icebreakers: jsonb("icebreakers").notNull().$type<string[]>(),
    createdAt: timestamp("created_at").defaultNow(),
}); 