'use client';

import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, Copy, Check, Info } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  prompt: string;
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  imageUrl,
  prompt,
}: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 select-none">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
        <div className="max-w-xl truncate text-xs font-mono text-neutral-300">
          &ldquo;{prompt}&rdquo;
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setScale(s => Math.min(s + 0.25, 2.5))}
            className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setScale(s => Math.max(s - 0.25, 0.75))}
            className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <a
            href={imageUrl}
            download="mindly-generated.jpg"
            className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200"
            title="Download Image"
          >
            <Download size={16} />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image with Zoom Scale */}
      <div className="relative max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={prompt}
          style={{ transform: `scale(${scale})` }}
          className="max-w-full max-h-[75vh] object-contain rounded-xl transition-transform duration-150"
        />
      </div>

      {/* Bottom Metadata Info Tag */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs text-neutral-300 flex items-center space-x-2">
        <Info size={13} className="text-amber-400" />
        <span>MINDLY C2PA Watermark Verified • Open-Weights Generated</span>
      </div>
    </div>
  );
}
