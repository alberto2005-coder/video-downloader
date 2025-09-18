import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  title: text("title"),
  thumbnail: text("thumbnail"),
  duration: integer("duration"), // in seconds
  uploader: text("uploader"),
  views: text("views"),
  format: text("format").notNull(), // mp4, mp3, webm
  quality: text("quality").notNull(), // 1080p, 720p, 480p, 360p, audio
  status: text("status").notNull().default("pending"), // pending, processing, completed, error
  progress: integer("progress").default(0), // 0-100
  downloadSpeed: text("download_speed"),
  downloadedSize: text("downloaded_size"),
  totalSize: text("total_size"),
  eta: text("eta"),
  filePath: text("file_path"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"), // Additional video metadata
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertDownloadSchema = createInsertSchema(downloads).pick({
  url: true,
  format: true,
  quality: true,
});

export const updateDownloadSchema = createInsertSchema(downloads).pick({
  title: true,
  thumbnail: true,
  duration: true,
  uploader: true,
  views: true,
  status: true,
  progress: true,
  downloadSpeed: true,
  downloadedSize: true,
  totalSize: true,
  eta: true,
  filePath: true,
  errorMessage: true,
  metadata: true,
}).partial();

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type UpdateDownload = z.infer<typeof updateDownloadSchema>;
export type Download = typeof downloads.$inferSelect;

// Video analysis schema for API responses
export const videoInfoSchema = z.object({
  title: z.string(),
  thumbnail: z.string(),
  duration: z.number(),
  uploader: z.string(),
  views: z.string(),
  formats: z.array(z.object({
    format: z.string(),
    quality: z.string(),
    fileSize: z.string().optional(),
  })),
  metadata: z.record(z.any()).optional(),
});

export type VideoInfo = z.infer<typeof videoInfoSchema>;
