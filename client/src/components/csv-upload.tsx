import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUploadCSV } from "@/hooks/use-traffic-data";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

export default function CSVUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadCSV();

  // File validation
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/csv') {
      return { valid: false, error: "Please select a CSV file" };
    }
    
    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, error: "File size must be less than 50MB" };
    }
    
    // Check if file is empty
    if (file.size === 0) {
      return { valid: false, error: "File cannot be empty" };
    }
    
    return { valid: true };
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
      }
    }
  }, []);

  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Stop at 90%, let actual upload complete it
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      await uploadMutation.mutateAsync(selectedFile);
      setUploadProgress(100);
      // Reset after success
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  // Clear selection
  const handleClear = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto card-modern rounded-2xl p-6" data-testid="csv-upload-card">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload CSV File
        </h3>
        <p className="text-gray-300 text-sm">
          Upload your traffic data CSV file for analysis with high-accuracy ML models
        </p>
      </div>
      
      <div className="space-y-6">
        {/* CSV Format Instructions */}
        <div className="glass-card p-4 rounded-xl border border-blue-500/30" data-testid="format-instructions">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-400 font-medium text-sm">Required CSV columns:</p>
              <p className="text-gray-300 text-sm mt-1">
                Date, Hour, Location, Queue_Density (or Queue), Stop_Density (or StopDensity), Accidents_Reported (or Accidents), Fatalities
              </p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : selectedFile 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-gray-600 hover:border-gray-500 hover:bg-white/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          data-testid="upload-drop-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,application/csv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            data-testid="file-input"
          />
          
          {!selectedFile ? (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">
                  {dragActive ? "Drop your CSV file here" : "Drag and drop your CSV file here"}
                </p>
                <p className="text-sm text-gray-400">
                  or <span className="text-blue-400 font-medium">click to browse</span>
                </p>
                <p className="text-xs text-gray-500">
                  Maximum file size: 50MB
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-green-400" />
                <div className="text-left">
                  <p className="font-medium text-green-400" data-testid="selected-filename">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-400" data-testid="selected-filesize">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                  Ready
                </div>
              </div>
              
              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{width: `${uploadProgress}%`}}
                      data-testid="upload-progress"
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {selectedFile && (
            <>
              <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || uploadProgress > 0}
                className="flex-1 btn-glass-primary px-6 py-3 rounded-xl font-semibold"
                data-testid="button-upload"
              >
                {uploadMutation.isPending || uploadProgress > 0 ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    {uploadProgress < 90 ? "Uploading..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={uploadMutation.isPending || uploadProgress > 0}
                className="px-6 py-3 glass-card rounded-xl font-semibold text-gray-300 hover:text-white transition-colors"
                data-testid="button-clear"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {/* Status Messages */}
        {uploadMutation.isError && (
          <div className="glass-card p-4 rounded-xl border border-red-500/30" data-testid="upload-error">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium text-sm">Upload failed</p>
                <p className="text-gray-300 text-sm mt-1">
                  {uploadMutation.error instanceof Error ? uploadMutation.error.message : "Unknown error"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {uploadMutation.isSuccess && uploadProgress === 100 && (
          <div className="glass-card p-4 rounded-xl border border-green-500/30" data-testid="upload-success">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-400 font-medium text-sm">Success!</p>
                <p className="text-gray-300 text-sm mt-1">
                  Your CSV file has been uploaded and is being processed with ML models. The dashboard will update automatically when analysis is complete.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {uploadMutation.isPending && uploadProgress >= 90 && (
          <div className="glass-card p-4 rounded-xl border border-blue-500/30" data-testid="processing-status">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-400 font-medium text-sm">Processing</p>
                <p className="text-gray-300 text-sm mt-1">
                  Running high-accuracy Python ML analysis on your data. This may take a few moments...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}