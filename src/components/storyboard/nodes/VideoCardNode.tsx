'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Video, ExternalLink, Pause } from 'lucide-react';
import { StoryNodeData } from '../../../types';

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
}

function getYouTubeThumbnail(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match && match[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export const VideoCardNode: React.FC<{ data: StoryNodeData; selected?: boolean }> = ({ data, selected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(data.videoUrl);
  const thumbnailUrl = getYouTubeThumbnail(data.videoUrl);

  return (
    <div className={`w-72 rounded-xl bg-[#1B202C] border transition-all duration-150 shadow-xl overflow-hidden ${
      selected ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-white/10 hover:border-white/20'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-cyan-400" />
      
      {/* Video Container */}
      <div className="relative h-36 w-full bg-black/60 overflow-hidden group">
        {isPlaying && embedUrl ? (
          <iframe
            src={embedUrl}
            title={data.title || 'Video reference'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-950">
            {thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={thumbnailUrl} 
                alt={data.title || 'Video thumbnail'} 
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            
            {embedUrl ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(true);
                }}
                className="relative z-10 w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-transform hover:scale-110 active:scale-95"
                title="Play Video"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            ) : (
              <div className="relative z-10 w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            )}
          </div>
        )}

        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30 flex items-center gap-1 z-20">
          <Video className="w-3 h-3" />
          <span>Video Reference</span>
        </div>

        {isPlaying && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(false);
            }}
            className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-gray-300 hover:text-white flex items-center gap-1 z-20"
          >
            <Pause className="w-3 h-3" />
            <span>Stop</span>
          </button>
        )}
      </div>

      <div className="p-3 space-y-2">
        <h4 className="font-semibold text-xs text-white truncate">{data.title || 'Video Reference'}</h4>
        {data.creatorNotes && (
          <p className="text-[10px] text-gray-300 line-clamp-2 leading-relaxed">
            {data.creatorNotes}
          </p>
        )}
        
        {data.videoUrl && (
          <a
            href={data.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-1.5 px-2.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-cyan-500/20 truncate"
          >
            <span className="truncate">Open Video URL</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400" />
    </div>
  );
};
