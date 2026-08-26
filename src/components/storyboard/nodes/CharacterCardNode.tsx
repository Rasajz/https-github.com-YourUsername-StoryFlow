'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';
import { StoryNodeData } from '../../../types';

export const CharacterCardNode: React.FC<{ data: StoryNodeData; selected?: boolean }> = ({ data, selected }) => {
  return (
    <div className={`w-64 rounded-xl bg-[#1B202C] border transition-all duration-150 shadow-xl overflow-hidden ${
      selected ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-white/10 hover:border-white/20'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      <div className="h-1.5 bg-gradient-to-r from-purple-500 to-blue-500" />

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white truncate">{data.title || 'Character'}</h4>
            <span className="text-[10px] text-purple-400 font-medium">Story Persona</span>
          </div>
        </div>

        {data.description && (
          <p className="text-[11px] text-gray-300 line-clamp-3 leading-relaxed font-normal">
            {data.description}
          </p>
        )}

        {data.tags && data.tags.length > 0 && (
          <div className="flex items-center gap-1 pt-1 flex-wrap">
            {data.tags.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  );
};
