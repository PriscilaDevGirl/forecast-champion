import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFilesChange,
  maxFiles = 3,
  accept = { "application/octet-stream": [".parquet"] },
  maxSize = 5 * 1024 * 1024 * 1024, // 5GB
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        return;
      }

      setUploading(true);
      const newFiles = [...uploadedFiles];

      for (const file of acceptedFiles) {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        newFiles.push(file);
      }

      setUploadedFiles(newFiles);
      onFilesChange(newFiles);
      setUploading(false);
      setUploadProgress({});
    },
    [uploadedFiles, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - uploadedFiles.length,
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {uploadedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
            "hover:border-primary hover:bg-analytics-gradient",
            isDragActive
              ? "border-primary bg-analytics-gradient scale-105"
              : "border-border bg-card"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Upload arquivos Parquet
          </h3>
          <p className="text-muted-foreground mb-4">
            Arraste e solte os arquivos aqui ou clique para selecionar
          </p>
          <p className="text-sm text-muted-foreground">
            Máximo {maxFiles} arquivos • Até 5GB cada • Formato .parquet
          </p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Arquivos carregados:</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-card rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-analytics-blue" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {uploadProgress[file.name] !== undefined ? (
                  <Progress value={uploadProgress[file.name]} className="w-20" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-analytics-green" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Carregando arquivos...</p>
        </div>
      )}
    </div>
  );
}