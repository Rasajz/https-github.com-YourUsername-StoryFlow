'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';
import { StoryNodeData } from '../../../types';
import { ArtworkPreview, useArtworkUrl } from '../../media/ArtworkPreview';

export const ImageCardNode: React.FC<{ data: StoryNodeData; selected?: boolean }> = ({ data, selected }) => {
  const imageUrl = data.imageUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop';
  const resolvedImageUrl = useArtworkUrl(imageUrl);

  return (
    <div className={`w-64 rounded-xl bg-[#1B202C] border transition-all duration-150 shadow-xl overflow-hidden ${
      selected ? 'border-pink-500 ring-2 ring-pink-500/30' : 'border-white/10 hover:border-white/20'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-pink-500" />
      
      {/* Image Preview Container */}
      <div className="relative h-36 w-full bg-black/40 overflow-hidden group flex items-center justify-center">
        <ArtworkPreview source={imageUrl} alt={String(data.title || 'Storyboard visual')} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-pink-300 border border-pink-500/30 flex items-center gap-1 z-10">
          <ImageIcon className="w-3 h-3" />
          <span>Image Reference</span>
        </div>
      </div>

      <div className="p-3 space-y-1.5">
        <h4 className="font-semibold text-xs text-white truncate">{data.title || 'Image Reference'}</h4>
        {data.description && (
          <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}
        {data.imageUrl && resolvedImageUrl && (
          <a
            href={resolvedImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-pink-400/80 hover:text-pink-300 flex items-center gap-1 pt-1 truncate"
          >
            <span className="truncate">View full image</span>
            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
          </a>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-pink-500" />
    </div>
  );
};
