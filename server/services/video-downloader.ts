import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { type VideoInfo } from "@shared/schema";

export class VideoDownloaderService {
  private downloadsDir: string;

  constructor() {
    this.downloadsDir = path.join(process.cwd(), "downloads");
    this.ensureDownloadsDir();
  }

  private async ensureDownloadsDir() {
    try {
      await fs.access(this.downloadsDir);
    } catch {
      await fs.mkdir(this.downloadsDir, { recursive: true });
    }
  }

  async analyzeVideo(url: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
      const ytDlp = spawn("yt-dlp", [
        "--dump-json",
        "--no-download",
        "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "--sleep-interval", "1",
        "-R", "3",
        "--retry-sleep", "1:5",
        "--extractor-retries", "3",
        "--geo-bypass",
        url
      ]);

      let output = "";
      let error = "";

      ytDlp.stdout.on("data", (data) => {
        output += data.toString();
      });

      ytDlp.stderr.on("data", (data) => {
        error += data.toString();
      });

      ytDlp.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`yt-dlp failed: ${error}`));
          return;
        }

        try {
          const info = JSON.parse(output);
          
          // Extract available formats
          const formats = this.extractFormats(info);
          
          const videoInfo: VideoInfo = {
            title: info.title || "Unknown Title",
            thumbnail: info.thumbnail || "",
            duration: info.duration || 0,
            uploader: info.uploader || info.channel || "Unknown",
            views: this.formatViews(info.view_count),
            formats,
            metadata: {
              originalUrl: url,
              platform: info.extractor_key || "Unknown",
              uploadDate: info.upload_date,
              description: info.description?.slice(0, 500),
            }
          };

          resolve(videoInfo);
        } catch (parseError) {
          reject(new Error(`Failed to parse video info: ${parseError}`));
        }
      });
    });
  }

  private extractFormats(info: any): Array<{format: string, quality: string, fileSize?: string}> {
    const formats = [];
    
    // Video formats
    const videoQualities = ["1080p", "720p", "480p", "360p"];
    videoQualities.forEach(quality => {
      if (this.hasQuality(info, quality)) {
        formats.push({ format: "mp4", quality });
        formats.push({ format: "webm", quality });
      }
    });

    // Audio format
    formats.push({ format: "mp3", quality: "audio" });

    return formats;
  }

  private hasQuality(info: any, quality: string): boolean {
    if (!info.formats) return quality === "360p"; // Default fallback
    
    const height = parseInt(quality);
    // Only check video formats (vcodec != 'none') with defined height
    return info.formats.some((f: any) => 
      f.vcodec && f.vcodec !== 'none' && f.height && f.height >= height
    );
  }

  private formatViews(viewCount: number): string {
    if (!viewCount) return "0 visualizaciones";
    
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M visualizaciones`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K visualizaciones`;
    }
    
    return `${viewCount} visualizaciones`;
  }

  async downloadVideo(
    url: string, 
    format: string, 
    quality: string,
    onProgress?: (progress: {
      percentage: number;
      speed?: string;
      downloaded?: string;
      total?: string;
      eta?: string;
    }) => void
  ): Promise<string> {
    const outputTemplate = path.join(this.downloadsDir, "%(title)s.%(ext)s");
    const args = [
      url, 
      "-o", outputTemplate,
      // Add robust options for reliability
      "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "--sleep-interval", "1",
      "--max-sleep-interval", "5",
      "-R", "3",
      "--retry-sleep", "1:5",
      "--extractor-retries", "3",
      "--geo-bypass",
      "-N", "4"
    ];

    // Set format options - using single-file formats since ffmpeg not available
    if (format === "mp3") {
      args.push("-x", "--audio-format", "mp3", "--audio-quality", "0");
    } else if (format === "mp4") {
      if (quality !== "audio") {
        const height = quality.replace('p', '');
        // Use single-file MP4 format to avoid merging requirement
        args.push("-f", `b[ext=mp4][height<=${height}]/b[ext=mp4]/b`);
      } else {
        args.push("-f", "ba[ext=m4a]/ba/best");
      }
    } else if (format === "webm") {
      if (quality !== "audio") {
        const height = quality.replace('p', '');
        // Use single-file WebM format to avoid merging requirement
        args.push("-f", `b[ext=webm][height<=${height}]/b[ext=webm]/b`);
      } else {
        args.push("-f", "ba[ext=webm]/ba/best");
      }
    } else {
      // Default fallback - just get the best available format
      args.push("-f", "b/best");
    }

    return new Promise((resolve, reject) => {
      const ytDlp = spawn("yt-dlp", args);
      
      let lastProgress = { percentage: 0 };
      let error = "";
      let downloadedFile = "";

      ytDlp.stdout.on("data", (data) => {
        const output = data.toString();
        
        // Extract filename
        const filenameMatch = output.match(/\[download\] Destination: (.+)/);
        if (filenameMatch) {
          downloadedFile = filenameMatch[1];
        }

        // Parse progress
        const progressMatch = output.match(/\[download\]\s+(\d+\.\d+)%\s+of\s+(.+?)\s+at\s+(.+?)\s+ETA\s+(.+)/);
        if (progressMatch && onProgress) {
          const progress = {
            percentage: parseFloat(progressMatch[1]),
            speed: progressMatch[3],
            total: progressMatch[2],
            eta: progressMatch[4],
            downloaded: undefined as string | undefined
          };
          lastProgress = progress;
          onProgress(progress);
        }
      });

      ytDlp.stderr.on("data", (data) => {
        error += data.toString();
      });

      ytDlp.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Download failed: ${error}`));
          return;
        }

        if (onProgress && lastProgress.percentage < 100) {
          onProgress({ ...lastProgress, percentage: 100 });
        }

        resolve(downloadedFile || `Downloaded to ${this.downloadsDir}`);
      });
    });
  }

  async getDownloadedFile(fileName: string): Promise<Buffer | null> {
    try {
      const filePath = path.join(this.downloadsDir, fileName);
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const filePath = path.join(this.downloadsDir, fileName);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const videoDownloader = new VideoDownloaderService();
