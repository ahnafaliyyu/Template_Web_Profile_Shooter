import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** Teks yang tampil ke pengunjung: Indonesia wajib, Inggris opsional. */
export type L = { id: string; en?: string };

/** Data tambahan profil yang jarang berubah; semuanya bisa diubah lewat admin. */
export type ProfileExtra = {
  email?: string;
  location?: string;
  tags?: string[];
  links?: { label: string; url: string }[];
};

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();

export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  role: jsonb("role").$type<L>().notNull(),
  bio: jsonb("bio").$type<L>().notNull(),
  availability: jsonb("availability").$type<L>(),
  focus: jsonb("focus").$type<L>(),
  extra: jsonb("extra").$type<ProfileExtra>(),
  updatedAt: updatedAt(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: jsonb("title").$type<L>().notNull(),
  summary: jsonb("summary").$type<L>().notNull(),
  note: jsonb("note").$type<L>(),
  kind: text("kind").notNull(),
  year: integer("year").notNull(),
  status: text("status", { enum: ["aktif", "selesai", "konsep"] }).notNull().default("konsep"),
  access: text("access", { enum: ["publik", "privat"] }).notNull().default("privat"),
  progress: integer("progress").notNull().default(0),
  framework: text("framework"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  group: text("group"),
});

export const projectTechnologies = pgTable(
  "project_technologies",
  {
    projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    technologyId: integer("technology_id").notNull().references(() => technologies.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.technologyId] })],
);

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  group: text("group").notNull(),
  level: integer("level"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  kind: text("kind", { enum: ["pendidikan", "sertifikat", "publikasi", "penghargaan"] }).notNull(),
  title: jsonb("title").$type<L>().notNull(),
  issuer: text("issuer"),
  year: integer("year"),
  url: text("url"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
});

export const stats = pgTable("stats", {
  key: varchar("key", { length: 60 }).primaryKey(),
  label: jsonb("label").$type<L>().notNull(),
  mode: text("mode", { enum: ["auto", "manual"] }).notNull().default("manual"),
  value: text("value"),
  source: text("source"),
  visible: boolean("visible").notNull().default(true),
});

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: updatedAt(),
});

export const guestbookEntries = pgTable("guestbook_entries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["pending", "approved", "hidden"] }).notNull().default("pending"),
  ipHash: text("ip_hash"),
  createdAt: createdAt(),
});

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  createdAt: createdAt(),
});
