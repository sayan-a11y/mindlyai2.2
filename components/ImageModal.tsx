'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, Wand2 } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, style: string, aspectRatio: string, quality: string) => void;
  isGenerating: boolean;
}

export default function ImageModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}: ImageModalProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('Fast');
  const [hasConsent, setHasConsent] = useState(true);

  if (!isOpen) return null;

  const styles = ['Realistic', 'Anime', 'Illustration', '3D', 'Logo', 'Sketch'];
  const aspectRatios = [
    { id: '1:1', label: '1:1 Square' },
    { id: '16:9', label: '16:9 Landscape' },
    { id: '9:16', label: '9:16 Portrait' },
    { id: '4:3', label: '4:3 Standard' },
    { id: '3:4', label: '3:4 Tall' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt.trim(), style, aspectRatio, quality);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#171718] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-2xl p-6 text-neutral-900 dark:text-neutral-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E6E8] dark:border-[#2A2A2D]">
          <div className="flex items-center space-x-2">
            <Sparkles size={18} className="text-amber-500" />
            <h2 className="text-base font-semibold">Create an image</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close image creation modal"
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-medium text-[#6B6B70] dark:text-[#A1A1A6] mb-1.5">
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. A serene mountain lake at sunrise with mist and hyper-detailed reflection..."
              rows={3}
              className="w-full rounded-xl bg-neutral-50 dark:bg-[#202024] border border-[#E6E6E8] dark:border-[#2A2A2D] p-3 text-sm text-[#0D0D0D] dark:text-[#F5F5F5] outline-none focus:border-neutral-400"
            />
          </div>

          {/* Style Presets */}
          <div>
            <label className="block text-xs font-medium text-[#6B6B70] dark:text-[#A1A1A6] mb-1.5">
              Style Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {styles.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    style === s
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                      : 'bg-neutral-50 dark:bg-[#202024] border-[#E6E6E8] dark:border-[#2A2A2D] text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-medium text-[#6B6B70] dark:text-[#A1A1A6] mb-1.5">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map(ar => (
                <button
                  type="button"
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    aspectRatio === ar.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                      : 'bg-neutral-50 dark:bg-[#202024] border-[#E6E6E8] dark:border-[#2A2A2D] text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-[#202024] border border-[#E6E6E8] dark:border-[#2A2A2D]">
            <div>
              <div className="text-xs font-semibold">Engine Quality</div>
              <div className="text-[11px] text-[#6B6B70] dark:text-[#A1A1A6]">
                {quality === 'Fast' ? 'FLUX.1 [schnell] ~4 steps' : 'SDXL / FLUX [dev] 28 steps'}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setQuality('Fast')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  quality === 'Fast'
                    ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                Fast
              </button>
              <button
                type="button"
                onClick={() => setQuality('HD')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  quality === 'HD'
                    ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                HD
              </button>
            </div>
          </div>

          {/* Consent Checkbox (PRD 20.6) */}
          <label className="flex items-center space-x-2 text-xs text-[#6B6B70] dark:text-[#A1A1A6] cursor-pointer">
            <input
              type="checkbox"
              checked={hasConsent}
              onChange={e => setHasConsent(e.target.checked)}
              className="rounded text-neutral-900 focus:ring-0"
            />
            <span>This is my own prompt or reference; public figures are blocked.</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating || !hasConsent}
            className="w-full py-2.5 rounded-xl bg-[#0D0D0D] dark:bg-[#F5F5F5] text-white dark:text-[#0D0D0D] font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center space-x-2"
          >
            <Sparkles size={16} />
            <span>{isGenerating ? 'Generating image in queue (~6s)...' : 'Generate image'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
