import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, User, X, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface SelfieUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (base64Image: string, age: number) => void;
  isLoading: boolean;
}

export const SelfieUploadModal: React.FC<SelfieUploadModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [chronologicalAge, setChronologicalAge] = useState<number>(28);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when modal closes or switching tabs
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setPreviewImage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab !== 'camera') {
      stopCamera();
    } else if (isOpen && !previewImage) {
      startCamera();
    }
  }, [activeTab, isOpen, previewImage]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access webcam. Please check browser permissions or upload a photo.');
      setCameraActive(false);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          takePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 700);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror image horizontally for natural selfie perspective
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setPreviewImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAnalysis = () => {
    if (previewImage) {
      onSelectImage(previewImage, chronologicalAge);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              {previewImage ? 'Confirm Selfie Preview' : 'Skin Diagnostics Selfie Intake'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Calibrated for Perfect Corp facial landmarking and multi-zone skin health evaluation
            </p>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {previewImage ? (
            /* Selected Preview Mode */
            <div className="space-y-6">
              <div className="relative mx-auto max-w-sm rounded-xl overflow-hidden bg-stone-950 aspect-[3/4] flex items-center justify-center border border-stone-200 shadow-inner">
                <img
                  src={previewImage}
                  alt="Selfie Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-rose-400/40 rounded-xl m-3 flex items-center justify-center">
                  <div className="w-48 h-64 border border-dashed border-rose-300/60 rounded-[50%] flex items-center justify-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-rose-200/90 bg-stone-900/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      Zone Guide Aligned
                    </span>
                  </div>
                </div>
              </div>

              {/* Age Calibration Slider */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    Chronological Age Calibration
                  </span>
                  <span className="font-mono font-semibold text-rose-700 text-sm">
                    {chronologicalAge} yrs
                  </span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={75}
                  value={chronologicalAge}
                  onChange={(e) => setChronologicalAge(parseInt(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                  <span>16 yrs</span>
                  <span>45 yrs</span>
                  <span>75 yrs</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Choose Different Photo
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAnalysis}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-all duration-150 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Skin Segments...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run Perfect Corp Skin Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Select Input Mode Tabs */
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200/80">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'upload'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
                <button
                  onClick={() => setActiveTab('camera')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'camera'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take Live Selfie</span>
                </button>
              </div>

              {/* Tab 1: Upload */}
              {activeTab === 'upload' && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/20 rounded-xl p-8 text-center transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[260px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-500 group-hover:text-rose-600 group-hover:scale-105 transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-stone-900">
                    Drag and drop your selfie here
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 max-w-xs">
                    Supports high-res JPG, PNG, or WebP. For optimal biometric segmentation, use natural, even lighting and face forward.
                  </p>
                  <span className="mt-4 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-md shadow-2xs group-hover:bg-rose-50 group-hover:text-rose-700 transition-colors">
                    Browse Local File
                  </span>
                </div>
              )}

              {/* Tab 2: Live Camera */}
              {activeTab === 'camera' && (
                <div className="space-y-4">
                  {cameraError ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Camera Access Restricted</p>
                        <p className="mt-0.5 text-amber-700">{cameraError}</p>
                        <button
                          onClick={startCamera}
                          className="mt-2 text-xs underline font-medium text-amber-900 hover:text-amber-950 cursor-pointer"
                        >
                          Retry Camera
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative mx-auto max-w-sm rounded-xl overflow-hidden bg-black aspect-[3/4] flex items-center justify-center border border-stone-300 shadow-md">
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />

                      {/* Oval Face Alignment Overlay */}
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                        <div className="w-52 h-72 border-2 border-dashed border-rose-400/80 rounded-[50%] flex items-center justify-center relative shadow-xs">
                          {countdown !== null && (
                            <div className="text-5xl font-display font-bold text-white bg-rose-600/80 w-20 h-20 rounded-full flex items-center justify-center animate-ping">
                              {countdown}
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-[11px] font-mono text-white/90 bg-stone-900/70 px-2.5 py-1 rounded-full backdrop-blur-xs">
                          Position face inside oval
                        </p>
                      </div>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleCaptureSnapshot}
                        disabled={countdown !== null}
                        className="px-6 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-full shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{countdown !== null ? `Capturing in ${countdown}...` : 'Capture Selfie'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}


            </div>
          )}
        </div>
      </div>
    </div>
  );
};
