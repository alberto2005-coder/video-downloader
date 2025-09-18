import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Download } from "@shared/schema";
import { io, Socket } from "socket.io-client";

interface DownloadProgressProps {
  download: Download;
}

export default function DownloadProgress({ download: initialDownload }: DownloadProgressProps) {
  const [download, setDownload] = useState(initialDownload);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();

  // Set up socket connection for real-time updates
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    // Listen for download progress updates
    newSocket.on("downloadProgress", (data: any) => {
      if (data.downloadId === download.id) {
        setDownload(prev => ({
          ...prev,
          progress: data.percentage,
          downloadSpeed: data.speed,
          downloadedSize: data.downloaded,
          totalSize: data.total,
          eta: data.eta,
        }));
      }
    });

    // Listen for download completion
    newSocket.on("downloadCompleted", (data: any) => {
      if (data.downloadId === download.id) {
        setDownload(prev => ({
          ...prev,
          status: "completed",
          progress: 100,
          filePath: data.filePath,
        }));
        
        toast({
          title: "¡Descarga completada!",
          description: "Tu video está listo para descargar.",
        });
      }
    });

    // Listen for download errors
    newSocket.on("downloadError", (data: any) => {
      if (data.downloadId === download.id) {
        setDownload(prev => ({
          ...prev,
          status: "error",
          errorMessage: data.error,
        }));
        
        toast({
          variant: "destructive",
          title: "Error en la descarga",
          description: data.error,
        });
      }
    });

    // Listen for download cancellation
    newSocket.on("downloadCancelled", (data: any) => {
      if (data.downloadId === download.id) {
        toast({
          title: "Descarga cancelada",
          description: "La descarga ha sido cancelada exitosamente.",
        });
      }
    });

    return () => {
      newSocket.close();
    };
  }, [download.id, toast]);

  // Poll for download status updates
  const { data: updatedDownload } = useQuery({
    queryKey: ["/api/downloads", download.id],
    refetchInterval: download.status === "processing" ? 1000 : false,
    enabled: download.status !== "completed" && download.status !== "error",
  });

  useEffect(() => {
    if (updatedDownload) {
      setDownload(updatedDownload);
    }
  }, [updatedDownload]);

  const handleCancel = async () => {
    try {
      await apiRequest("DELETE", `/api/downloads/${download.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al cancelar",
        description: "No se pudo cancelar la descarga",
      });
    }
  };

  const handleDownloadFile = () => {
    if (download.status === "completed") {
      window.open(`/api/downloads/${download.id}/file`, '_blank');
    }
  };

  if (download.status === "error") {
    return (
      <div className="max-w-4xl mx-auto mb-12">
        <div className="video-card rounded-xl p-6" data-testid="card-download-error">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-destructive" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L13.09,8.26L22,9L17,14L18.18,22L12,19L5.82,22L7,14L2,9L10.91,8.26L12,2Z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-destructive">Error en la descarga</h4>
              <p className="text-muted-foreground" data-testid="text-error-message">
                {download.errorMessage || "Error desconocido"}
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            data-testid="button-retry"
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="video-card rounded-xl p-6" data-testid="card-download-progress">
        <h4 className="text-lg font-semibold mb-4">
          {download.status === "completed" ? "¡Descarga completada!" : "Descargando video..."}
        </h4>
        
        <div className="space-y-4">
          {/* Download progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Progreso de descarga</span>
              <span className="text-sm font-medium" data-testid="text-progress-percentage">
                {download.progress || 0}%
              </span>
            </div>
            <Progress value={download.progress || 0} className="h-3" data-testid="progress-bar" />
          </div>
          
          {/* Download stats */}
          {download.status === "processing" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Velocidad</span>
                <span className="font-medium" data-testid="text-download-speed">
                  {download.downloadSpeed || "Calculando..."}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Descargado</span>
                <span className="font-medium" data-testid="text-downloaded-size">
                  {download.downloadedSize || "0 MB"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Tamaño total</span>
                <span className="font-medium" data-testid="text-total-size">
                  {download.totalSize || "Calculando..."}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Tiempo restante</span>
                <span className="font-medium" data-testid="text-eta">
                  {download.eta || "Calculando..."}
                </span>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex space-x-4">
            {download.status === "completed" ? (
              <Button 
                onClick={handleDownloadFile}
                className="download-btn"
                data-testid="button-download-file"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Descargar Archivo
              </Button>
            ) : (
              <Button 
                variant="destructive"
                onClick={handleCancel}
                data-testid="button-cancel"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
                Cancelar descarga
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
