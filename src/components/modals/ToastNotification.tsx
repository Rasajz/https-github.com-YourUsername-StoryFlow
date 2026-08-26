'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useStory } from '../../context/StoryContext';

export const ToastNotification: React.FC = () => {
  const { toast } = useStory();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#14171F] border border-amber-500/40 text-white shadow-2xl shadow-black/80 backdrop-blur-md">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-amber-400">{toast.title}</h4>
          <p className="text-[11px] text-gray-300 font-medium">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
