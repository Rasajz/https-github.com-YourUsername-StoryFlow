'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { StoryNodeData } from '../../../types';

export const TimelineCardNode: React.FC<{ data: StoryNodeData; selected?: boolean }> = ({ data, selected }) => {
  return (
    <div className={`w-60 rounded-xl bg-[#1B202C] border transition-all duration-150 shadow-xl overflow-hidden ${
      selected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-white/10 hover:border-white/20'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <div className="h-1.5 bg-blue-500" />

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/40">
            {data.sequenceNumber || 1}
          </div>
          <div>
            <h4 className="font-bold text-xs text-white truncate">{data.title || 'Timeline Beat'}</h4>
            <span className="text-[9px] text-blue-400 font-medium">Story Event</span>
          </div>
        </div>

        {data.description && (
          <p className="text-[10px] text-gray-300 line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  );
};
