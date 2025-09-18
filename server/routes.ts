import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { videoDownloader } from "./services/video-downloader";
import { insertDownloadSchema, updateDownloadSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Analyze video URL
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({ message: "URL válida es requerida" });
      }

      const videoInfo = await videoDownloader.analyzeVideo(url);
      res.json(videoInfo);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(400).json({ 
        message: error instanceof Error 
          ? `Error al analizar el video: ${error.message}`
          : "Error desconocido al analizar el video"
      });
    }
  });

  // Start download
  app.post("/api/downloads", async (req, res) => {
    try {
      const downloadData = insertDownloadSchema.parse(req.body);
      const download = await storage.createDownload(downloadData);
      
      res.json(download);

      // Start download process in background
      processDownload(download.id, io);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Datos de descarga inválidos",
          errors: error.errors 
        });
      }
      
      console.error("Download creation error:", error);
      res.status(500).json({ message: "Error al crear la descarga" });
    }
  });

  // Get download status
  app.get("/api/downloads/:id", async (req, res) => {
    try {
      const download = await storage.getDownload(req.params.id);
      
      if (!download) {
        return res.status(404).json({ message: "Descarga no encontrada" });
      }

      res.json(download);
    } catch (error) {
      console.error("Get download error:", error);
      res.status(500).json({ message: "Error al obtener la descarga" });
    }
  });

  // Cancel download
  app.delete("/api/downloads/:id", async (req, res) => {
    try {
      const success = await storage.deleteDownload(req.params.id);
      
      if (!success) {
        return res.status(404).json({ message: "Descarga no encontrada" });
      }

      // Emit cancellation to clients
      io.emit("downloadCancelled", { downloadId: req.params.id });
      
      res.json({ message: "Descarga cancelada" });
    } catch (error) {
      console.error("Cancel download error:", error);
      res.status(500).json({ message: "Error al cancelar la descarga" });
    }
  });

  // Serve downloaded files
  app.get("/api/downloads/:id/file", async (req, res) => {
    try {
      const download = await storage.getDownload(req.params.id);
      
      if (!download || download.status !== "completed" || !download.filePath) {
        return res.status(404).json({ message: "Archivo no disponible" });
      }

      const fileName = path.basename(download.filePath);
      const fileBuffer = await videoDownloader.getDownloadedFile(fileName);
      
      if (!fileBuffer) {
        return res.status(404).json({ message: "Archivo no encontrado" });
      }

      // Set appropriate headers for download
      const extension = path.extname(fileName).toLowerCase();
      let contentType = "application/octet-stream";
      
      if (extension === ".mp4") contentType = "video/mp4";
      else if (extension === ".mp3") contentType = "audio/mpeg";
      else if (extension === ".webm") contentType = "video/webm";

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.send(fileBuffer);
    } catch (error) {
      console.error("File serve error:", error);
      res.status(500).json({ message: "Error al servir el archivo" });
    }
  });

  // Get all downloads
  app.get("/api/downloads", async (req, res) => {
    try {
      const downloads = await storage.getAllDownloads();
      res.json(downloads);
    } catch (error) {
      console.error("Get downloads error:", error);
      res.status(500).json({ message: "Error al obtener las descargas" });
    }
  });

  // Socket.IO connection handling
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Background download processing function
  async function processDownload(downloadId: string, io: SocketIOServer) {
    try {
      // Update status to processing
      await storage.updateDownload(downloadId, { status: "processing" });
      io.emit("downloadUpdated", { downloadId, status: "processing" });

      const download = await storage.getDownload(downloadId);
      if (!download) return;

      // Start the actual download
      const filePath = await videoDownloader.downloadVideo(
        download.url,
        download.format,
        download.quality,
        (progress) => {
          // Update progress in storage and emit to clients
          storage.updateDownload(downloadId, {
            progress: Math.round(progress.percentage),
            downloadSpeed: progress.speed,
            downloadedSize: progress.downloaded,
            totalSize: progress.total,
            eta: progress.eta,
          });

          io.emit("downloadProgress", {
            downloadId,
            ...progress,
            percentage: Math.round(progress.percentage),
          });
        }
      );

      // Mark as completed
      await storage.updateDownload(downloadId, {
        status: "completed",
        progress: 100,
        filePath,
      });

      io.emit("downloadCompleted", { downloadId, filePath });
    } catch (error) {
      console.error(`Download ${downloadId} failed:`, error);
      
      await storage.updateDownload(downloadId, {
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Error desconocido",
      });

      io.emit("downloadError", {
        downloadId,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  return httpServer;
}
