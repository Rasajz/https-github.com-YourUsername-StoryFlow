'use client';

import React from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Sparkles, 
  Link2, 
  MousePointerClick,
  CheckCircle2
} from 'lucide-react';

interface MediaHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaHelpModal: React.FC<MediaHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#14171F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/40 via-[#181D28] to-[#14171F] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">How to Use the Media & Reference Library</h3>
              <p className="text-xs text-gray-400">Everything you need to know about visual, video, and audio assets in StoryFlow</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 4 Feature Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Images & Mood */}
            <div className="p-4 rounded-xl bg-[#1A1F2C] border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span>1. Visual & Lighting References</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Add mood board pictures, costume sketches, color palettes, and lighting setups. You can paste any image URL directly or upload assets.
              </p>
            </div>

            {/* Card 2: Video Reference Links */}
            <div className="p-4 rounded-xl bg-[#1A1F2C] border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Video className="w-4 h-4" />
                </div>
                <span>2. Video Links & Action Clips</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Paste any YouTube, Vimeo, or video link. StoryFlow automatically extracts thumbnails and embeds playable clips for camera movements and pacing.
              </p>
            </div>

            {/* Card 3: Audio & Soundscapes */}
            <div className="p-4 rounded-xl bg-[#1A1F2C] border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-purple-400 font-bold text-xs">
                <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Music className="w-4 h-4" />
                </div>
                <span>3. Music, Foley & Ambience</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Store sound effects, rain ambiances, dramatic orchestral cues, and dialogue voice notes to set the auditory mood for your production.
              </p>
            </div>

            {/* Card 4: Storyboard & Script Linking */}
            <div className="p-4 rounded-xl bg-[#1A1F2C] border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Link2 className="w-4 h-4" />
                </div>
                <span>4. Connected Story Assets</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Every media item connects to a Storyboard Card or Screenplay Scene. When writing your script, referenced images appear in your scene side panel!
              </p>
            </div>
          </div>

          {/* Pro Tips Section */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <MousePointerClick className="w-4 h-4" />
              <span>Pro Tip: Instant Right-Click Insertion</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              You don&apos;t even have to upload here first! In the <strong className="text-white">Storyboard</strong> view, simply <span className="text-amber-400 font-semibold">right-click anywhere</span> on the board to add video and image references directly onto your canvas with any URL.
            </p>
          </div>

          {/* Quick Summary Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Quick Workflow Summary</h4>
            <div className="space-y-1.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Click <strong>&quot;Upload Media Asset&quot;</strong> in top-right to add images, video links, or audio.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Filter by <strong>Images, Sketches, Videos, or Audios</strong> to keep references organized.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>View connected story beats, mood previews, and director notes in the side inspector.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0B0D11] border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-500">StoryFlow Media Engine v2.0</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md"
          >
            Got it, Let&apos;s Create!
          </button>
        </div>
      </div>
    </div>
  );
};
