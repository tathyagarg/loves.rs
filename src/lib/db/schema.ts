import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, pgEnum, boolean, integer } from "drizzle-orm/pg-core";

export const subdomainStateEnum = pgEnum("subdomain_state", ["reserved", "active", "frozen"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),              // github id as string
  username: text("username").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  hasStarred: boolean("has_starred").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
});

export const subdomains = pgTable("subdomains", {
  name: text("name").primaryKey(),
  ownerId: text("owner_id").notNull().references(() => users.id),
  state: subdomainStateEnum("state").notNull().default("reserved"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const records = pgTable("records", {
  subdomain: text("subdomain").notNull().references(() => subdomains.name),
  type: text("type").notNull(),             // A, CNAME, etc.
  name: text("name").notNull(),             // record name, e.g. "www"
  value: text("value").notNull(),
  ttl: integer("ttl").notNull().default(3600),       // time to live in seconds
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  subdomains: many(subdomains),
}));

export const subdomainRelations = relations(subdomains, ({ one, many }) => ({
  owner: one(users, {
    fields: [subdomains.ownerId],
    references: [users.id],
  }),
  records: many(records),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const recordRelations = relations(records, ({ one }) => ({
  subdomain: one(subdomains, {
    fields: [records.subdomain],
    references: [subdomains.name],
  }),
}));
