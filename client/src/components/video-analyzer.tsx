import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import VideoInfoCard from "./video-info-card";
import type { VideoInfo } from "@shared/schema";

export default function VideoAnalyzer() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (videoUrl: string) => {
      const res = await apiRequest("POST", "/api/analyze", { url: videoUrl });
      return await res.json();
    },
    onSuccess: (data: VideoInfo) => {
      setVideoInfo(data);
      toast({
        title: "¡Video analizado exitosamente!",
        description: "Ahora puedes seleccionar el formato y calidad para descargar.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al analizar el video",
        description: error.message || "URL no válida o no soportada",
      });
    },
  });

  const handleAnalyze = () => {
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "URL requerida",
        description: "Por favor ingresa una URL válida",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        variant: "destructive",
        title: "URL inválida",
        description: "Por favor ingresa una URL válida",
      });
      return;
    }

    analyzeMutation.mutate(url);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return url.match(/^https?:\/\/.+/);
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-6">
        <Input 
          type="url" 
          placeholder="Pega aquí la URL del video (YouTube, Vimeo, TikTok...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-6 py-4 text-lg bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder-muted-foreground pr-32"
          data-testid="input-url"
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <Button 
          onClick={handleAnalyze}
          disabled={analyzeMutation.isPending || !url.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 download-btn"
          data-testid="button-analyze"
        >
          {analyzeMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Analizando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Analizar
            </>
          )}
        </Button>
      </div>
      
      {/* Supported platforms indicator */}
      <div className="flex items-center justify-center mt-4 space-x-6 text-muted-foreground mb-12">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="text-sm">YouTube</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.977 6.416c-.105 2.338-1.382 5.981-2.357 8.564L12.783 24 3.92 12.83a38.27 38.27 0 0 1-1.588-3.235c-1.084-2.628-1.883-5.065-1.883-8.563 0-.982.07-1.92.22-2.906a11.73 11.73 0 0 1 2.52-5.814C4.76.748 6.953.045 9.357.002c2.167-.038 4.279.565 6.065 1.757 1.786-1.192 3.898-1.795 6.065-1.757 2.404.043 4.597.746 6.168 2.31a11.73 11.73 0 0 1 2.52 5.814c.15.986.22 1.924.22 2.906.003.981-.085 1.946-.418 2.384z"/>
          </svg>
          <span className="text-sm">Vimeo</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
          <span className="text-sm">TikTok</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className="text-sm">Instagram</span>
        </div>
      </div>

      {videoInfo && <VideoInfoCard videoInfo={videoInfo} originalUrl={url} />}
    </div>
  );
}
