"use client";

import { AlertTriangle, Upload, Loader2, CheckCircle } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioMetricsGrid from "@/components/portfolio/PortfolioMetricsGrid";
import SystemicAttributionPanel from "@/components/portfolio/SystemicAttributionPanel";
import FindingsTriageTable from "@/components/portfolio/FindingsTriageTable";
import CustomerUploadZone from "@/components/portfolio/CustomerUploadZone";

export default function PortfolioContent() {
  const {
    dataset,
    isLoading,
    error,
    activeMode,
    setActiveMode,
    uploadPhase,
    uploadProgress,
    uploadErrors,
    processUpload,
    resetUpload,
  } = usePortfolioData();

  const isProcessing =
    uploadPhase === "PARSING" ||
    uploadPhase === "EVALUATING" ||
    uploadPhase === "BUILDING";

  const showPortfolio =
    dataset &&
    ((activeMode === "DEMO" && !isLoading) ||
      (activeMode === "CUSTOMER" && uploadPhase === "DONE"));

  return (
    <>
      {/* Page Title + Mode Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
          Portfolio Analysis
        </h1>

        <div className="flex items-center gap-1 bg-[#111111] border border-[#222222] rounded-lg p-0.5">
          <button
            onClick={() => setActiveMode("DEMO")}
            disabled={isProcessing}
            className={`px-3 py-1.5 rounded-md text-body-xs font-medium transition-colors ${
              activeMode === "DEMO"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-on-surface-variant hover:text-primary hover:bg-[#1a1a1a]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Demo Data
          </button>
          <button
            onClick={() => {
              resetUpload();
              setActiveMode("CUSTOMER");
            }}
            disabled={isProcessing}
            className={`px-3 py-1.5 rounded-md text-body-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeMode === "CUSTOMER"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-on-surface-variant hover:text-primary hover:bg-[#1a1a1a]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Data
          </button>
        </div>
      </div>

      {/* Upload complete banner */}
      {activeMode === "CUSTOMER" && uploadPhase === "DONE" && (
        <div className="bg-[#111111] border border-secondary/20 rounded-lg p-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-secondary" />
          <span className="font-body-sm text-body-sm text-secondary">
            Upload processed successfully. Displaying customer portfolio
            below.
          </span>
        </div>
      )}

      {/* Upload UI (excludes DONE phase) */}
      {activeMode === "CUSTOMER" && (uploadPhase === "IDLE" || uploadPhase === "PARSING" || uploadPhase === "EVALUATING" || uploadPhase === "BUILDING" || uploadPhase === "ERROR") && (
        <div className="flex flex-col gap-lg">
          <CustomerUploadZone
            onFileSelected={processUpload}
            disabled={isProcessing}
            error={null}
            lastUploadedFile={null}
            onClear={resetUpload}
          />

          {/* Processing indicators */}
          {isProcessing && (
            <div className="bg-[#111111] border border-[#222222] rounded-lg p-lg flex flex-col gap-md">
              <div className="flex items-center gap-2">
                {uploadPhase === "EVALUATING" && (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                )}
                {(uploadPhase === "PARSING" || uploadPhase === "BUILDING") && (
                  <Loader2 className="h-4 w-4 text-secondary animate-spin" />
                )}
                <span className="font-data-mono text-data-mono text-primary">
                  {uploadPhase === "PARSING" && "Parsing CSV data..."}
                  {uploadPhase === "EVALUATING" &&
                    `Evaluating invoices... ${Math.round(uploadProgress * 100)}%`}
                  {uploadPhase === "BUILDING" &&
                    "Building portfolio dataset..."}
                </span>
              </div>

              {uploadPhase === "EVALUATING" && (
                <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Upload errors */}
          {uploadPhase === "ERROR" && uploadErrors.length > 0 && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-lg flex flex-col gap-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-error" />
                <span className="font-data-mono text-data-mono text-error">
                  UPLOAD PROCESSING FAILED
                </span>
              </div>
              <ul className="flex flex-col gap-xs">
                {uploadErrors.map((err, i) => (
                  <li
                    key={i}
                    className="font-body-xs text-body-xs text-error pl-sm"
                  >
                    {err}
                  </li>
                ))}
              </ul>
              <button
                onClick={resetUpload}
                className="self-start px-3 py-1 rounded text-body-xs text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && activeMode === "DEMO" && (
        <div className="max-w-7xl mx-auto flex flex-col gap-lg">
          <div className="h-10 w-72 bg-[#111111] rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 bg-[#111111] border border-[#222222] rounded-lg animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 bg-[#111111] border border-[#222222] rounded-lg animate-pulse"
              />
            ))}
          </div>
          <div className="h-96 bg-[#111111] border border-[#222222] rounded-lg animate-pulse" />
        </div>
      )}

      {/* Error state */}
      {error && activeMode === "DEMO" && (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#111111] border border-error/20 rounded-lg p-xl">
          <AlertTriangle className="h-10 w-10 text-error mb-md" />
          <span className="font-data-mono text-data-mono text-error mb-sm">
            PORTFOLIO GENERATION FAILED
          </span>
          <p className="font-body-sm text-body-sm text-error text-center max-w-md">
            {error}
          </p>
        </div>
      )}

      {/* Portfolio view */}
      {showPortfolio && dataset && (
        <>
          <PortfolioHeader methodology={dataset.methodology} />
          <PortfolioMetricsGrid
            metrics={dataset.metrics}
            dataQuality={dataset.dataQuality}
          />
          <SystemicAttributionPanel
            attribution={dataset.attribution}
            supplierConcentration={dataset.supplierConcentration}
          />
          {dataset.dataQuality?.isUntrustworthy && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-error shrink-0" />
              <span className="font-body-sm text-body-sm text-error">
                Epistemic warning: Low data quality ({dataset.dataQuality.evaluableCoveragePercent}% coverage) — findings below may not reflect the true portfolio risk profile.
              </span>
            </div>
          )}
          <FindingsTriageTable anomalies={dataset.anomalies} />
        </>
      )}
    </>
  );
}
