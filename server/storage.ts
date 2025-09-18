import { type Download, type InsertDownload, type UpdateDownload } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createDownload(download: InsertDownload): Promise<Download>;
  getDownload(id: string): Promise<Download | undefined>;
  updateDownload(id: string, updates: UpdateDownload): Promise<Download | undefined>;
  deleteDownload(id: string): Promise<boolean>;
  getDownloadsByStatus(status: string): Promise<Download[]>;
  getAllDownloads(): Promise<Download[]>;
}

export class MemStorage implements IStorage {
  private downloads: Map<string, Download>;

  constructor() {
    this.downloads = new Map();
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const id = randomUUID();
    const now = new Date();
    const download: Download = {
      ...insertDownload,
      id,
      title: null,
      thumbnail: null,
      duration: null,
      uploader: null,
      views: null,
      status: "pending",
      progress: 0,
      downloadSpeed: null,
      downloadedSize: null,
      totalSize: null,
      eta: null,
      filePath: null,
      errorMessage: null,
      metadata: null,
      createdAt: now,
      updatedAt: now,
    };
    this.downloads.set(id, download);
    return download;
  }

  async getDownload(id: string): Promise<Download | undefined> {
    return this.downloads.get(id);
  }

  async updateDownload(id: string, updates: UpdateDownload): Promise<Download | undefined> {
    const existing = this.downloads.get(id);
    if (!existing) return undefined;

    const updated: Download = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.downloads.set(id, updated);
    return updated;
  }

  async deleteDownload(id: string): Promise<boolean> {
    return this.downloads.delete(id);
  }

  async getDownloadsByStatus(status: string): Promise<Download[]> {
    return Array.from(this.downloads.values()).filter(
      (download) => download.status === status,
    );
  }

  async getAllDownloads(): Promise<Download[]> {
    return Array.from(this.downloads.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

export const storage = new MemStorage();
