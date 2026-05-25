import { pgTable, text, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";

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
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  ownerId: text("owner_id").notNull().references(() => users.id),
  state: subdomainStateEnum("state").notNull().default("reserved"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const records = pgTable("records", {
  id: text("id").primaryKey(),
  subdomainId: text("subdomain_id").notNull().references(() => subdomains.id),
  type: text("type").notNull(),             // A, CNAME, etc.
  value: text("value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
