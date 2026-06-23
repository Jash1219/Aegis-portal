"use client";

import { useCallback, useState, useRef, type DragEvent } from "react";
import { Upload, FileText, AlertTriangle, X, CheckCircle } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface CustomerUploadZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  error?: string | null;
  lastUploadedFile?: string | null;
  onClear?: () => void;
}

export default function CustomerUploadZone({
  onFileSelected,
  disabled = false,
  error: externalError,
  lastUploadedFile,
  onClear,
}: CustomerUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const error = externalError ?? localError;

  const validateFile = useCallback((file: File): string | null => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return "Only .csv files are supported. Please upload a CSV file.";
    }
    if (file.size === 0) {
      return "The uploaded file is empty. Please provide a CSV with data.";
    }
    if (file.size > MAX_FILE_SIZE) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      return `File size (${mb} MB) exceeds the 5 MB limit. Please split your data and try again.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const err = validateFile(file);
      if (err) {
        setLocalError(err);
        setSelectedFile(null);
        return;
      }
      setLocalError(null);
      setSelectedFile(file);
      onFileSelected(file);
    },
    [onFileSelected, validateFile],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile],
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile],
  );

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setLocalError(null);
    onClear?.();
  }, [onClear]);

  const dropZoneBorder = isDragging
    ? "border-primary"
    : error
      ? "border-error/50"
      : selectedFile
        ? "border-secondary/50"
        : "border-[#333333]";

  const dropZoneBg = isDragging
    ? "bg-primary/5"
    : error
      ? "bg-error/5"
      : "bg-[#111111]";

  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-lg">
      <div className="flex items-center gap-2 mb-md">
        <Upload className="h-4 w-4 text-primary" />
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          Upload Portfolio Data
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`border-2 border-dashed ${dropZoneBorder} ${dropZoneBg} rounded-lg p-xl flex flex-col items-center justify-center gap-md cursor-pointer transition-colors min-h-[180px] ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {selectedFile ? (
          <>
            <CheckCircle className="h-8 w-8 text-secondary" />
            <div className="flex flex-col items-center gap-xs">
              <span className="font-data-mono text-data-mono text-primary">
                {selectedFile.name}
              </span>
              <span className="font-body-xs text-body-xs text-on-surface-variant">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </>
        ) : (
          <>
            <FileText className="h-8 w-8 text-on-surface-variant" />
            <div className="flex flex-col items-center gap-xs">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Drag and drop a CSV file here, or click to browse
              </span>
              <span className="font-body-xs text-body-xs text-on-surface-variant/60">
                Max 5 MB &middot; Up to 5,000 rows &middot; .csv only
              </span>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-md flex items-start gap-2 bg-error/10 border border-error/20 rounded-lg p-md">
          <AlertTriangle className="h-4 w-4 text-error shrink-0 mt-0.5" />
          <span className="font-body-xs text-body-xs text-error">{error}</span>
        </div>
      )}

      {lastUploadedFile && !selectedFile && (
        <div className="mt-md flex items-center gap-2 text-on-surface-variant">
          <FileText className="h-3.5 w-3.5" />
          <span className="font-body-xs text-body-xs">
            Last uploaded: {lastUploadedFile}
          </span>
        </div>
      )}

      {selectedFile && (
        <div className="mt-md flex items-center gap-md">
          <span className="font-body-xs text-body-xs text-secondary">
            File selected — ready for processing
          </span>
          <button
            onClick={handleClear}
            disabled={disabled}
            className="flex items-center gap-1 px-2 py-1 rounded text-body-xs text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
