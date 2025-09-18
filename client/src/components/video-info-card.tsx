import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import DownloadProgress from "./download-progress";
import type { VideoInfo, Download } from "@shared/schema";

interface VideoInfoCardProps {
  videoInfo: VideoInfo;
  originalUrl: string;
}

export default function VideoInfoCard({ videoInfo, originalUrl }: VideoInfoCardProps) {
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [downloadData, setDownloadData] = useState<Download | null>(null);
  const { toast } = useToast();

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/downloads", {
        url: originalUrl,
        format: selectedFormat,
        quality: selectedQuality,
      });
      return await res.json();
    },
    onSuccess: (data: Download) => {
      setDownloadData(data);
      toast({
        title: "¡Descarga iniciada!",
        description: "Tu video está siendo procesado y descargado.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al iniciar descarga",
        description: error.message || "Error desconocido",
      });
    },
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show download progress if download has started
  if (downloadData) {
    return <DownloadProgress download={downloadData} />;
  }

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="video-card rounded-xl overflow-hidden" data-testid="card-video-info">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={videoInfo.thumbnail || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"} 
              alt="Video thumbnail" 
              className="w-full h-48 md:h-full object-cover"
              data-testid="img-video-thumbnail"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h3 className="text-xl font-semibold mb-2" data-testid="text-video-title">
              {videoInfo.title}
            </h3>
            <div className="flex items-center space-x-4 text-muted-foreground mb-4">
              <span data-testid="text-video-duration">
                <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                </svg>
                {formatDuration(videoInfo.duration)}
              </span>
              <span data-testid="text-video-views">
                <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                </svg>
                {videoInfo.views}
              </span>
              <span data-testid="text-video-uploader">
                <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
                {videoInfo.uploader}
              </span>
            </div>
            
            {/* Format and quality selection */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="block text-sm font-medium mb-2">Formato</Label>
                <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} data-testid="radiogroup-format">
                  <div className="flex items-center">
                    <RadioGroupItem value="mp4" id="mp4" className="sr-only" />
                    <Label 
                      htmlFor="mp4" 
                      className={`flex items-center w-full p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/30 transition-colors ${selectedFormat === 'mp4' ? 'bg-primary text-primary-foreground' : ''}`}
                      data-testid="option-format-mp4"
                    >
                      <svg className="w-5 h-5 mr-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      <span>MP4 (Recomendado)</span>
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="mp3" id="mp3" className="sr-only" />
                    <Label 
                      htmlFor="mp3" 
                      className={`flex items-center w-full p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/30 transition-colors ${selectedFormat === 'mp3' ? 'bg-primary text-primary-foreground' : ''}`}
                      data-testid="option-format-mp3"
                    >
                      <svg className="w-5 h-5 mr-3 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      <span>MP3 (Solo audio)</span>
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="webm" id="webm" className="sr-only" />
                    <Label 
                      htmlFor="webm" 
                      className={`flex items-center w-full p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/30 transition-colors ${selectedFormat === 'webm' ? 'bg-primary text-primary-foreground' : ''}`}
                      data-testid="option-format-webm"
                    >
                      <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      <span>WebM</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-2">Calidad</Label>
                <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                  <SelectTrigger className="w-full" data-testid="select-quality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedFormat === 'mp3' ? (
                      <SelectItem value="audio">Solo audio (mejor calidad)</SelectItem>
                    ) : (
                      <>
                        <SelectItem value="1080p">1080p HD</SelectItem>
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="360p">360p</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={() => downloadMutation.mutate()}
              disabled={downloadMutation.isPending}
              className="w-full py-3 px-6 download-btn font-semibold"
              data-testid="button-download"
            >
              {downloadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Iniciando descarga...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Descargar Video
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
