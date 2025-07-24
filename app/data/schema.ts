import { pgTable, uuid, text, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  featureFlags: json("featureFlags").default({}).notNull(),
});

export const sessions = pgTable("Session", {
  id: uuid("id").primaryKey().defaultRandom(),
  ipAddress: text("ipAddress"),
  location: text("location"),
  userAgent: text("userAgent"),
  device: text("device"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id),
});

export const notes = pgTable("Note", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  notes: many(notes),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Session = typeof users.$inferSelect;
export type Note = typeof notes.$inferSelect;
