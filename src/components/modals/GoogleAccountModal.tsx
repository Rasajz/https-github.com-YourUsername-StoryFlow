'use client';
import React, { useRef, useState } from 'react';
import { Download, Upload, HardDrive, X, ShieldAlert } from 'lucide-react';
import { useStory } from '../../context/StoryContext';

export const GoogleAccountModal: React.FC = () => {
  const { isGoogleModalOpen, setIsGoogleModalOpen } = useStory();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  if (!isGoogleModalOpen) return null;

  const download = () => {
    setError('');
    try {
      const raw = window.localStorage.getItem('storyflow_local_v2');
      if (!raw) throw new Error('No saved project yet. Edit a note or script first.');
      const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'StoryFlow-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not export this backup.');
    }
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    setError('');
    try {
      if (file.size > 8_000_000) throw new Error('Backup exceeds the 8 MB import limit.');
      const raw = await file.text();
      const data = JSON.parse(raw);
      if (data?.version !== 2 || !Array.isArray(data.projects) ||
          !Array.isArray(data.notes) || !Array.isArray(data.scriptScenes)) {
        throw new Error('This file is not a valid StoryFlow v2 backup.');
      }
      if (!window.confirm('Replace the local StoryFlow workspace on this browser with this backup? Download your existing backup first.')) return;
      window.localStorage.setItem('storyflow_local_v2', raw);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not import this backup.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151921] text-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <HardDrive className="h-7 w-7 text-amber-400" />
            <div>
              <h2 className="text-base font-bold">Local Backups & Recovery</h2>
              <p className="text-xs text-gray-400">Your writing is saved in this browser, not in Google Cloud.</p>
            </div>
          </div>
          <button aria-label="Close backup dialog" onClick={() => setIsGoogleModalOpen(false)} className="rounded-lg p-2 hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm text-gray-300">Notes, scripts, storyboards, and projects now auto-save on this device. Download a JSON backup regularly so that browser resets or device loss do not erase your work.</p>
          <button onClick={download} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-black hover:bg-amber-400">
            <Download className="h-4 w-4" /> Download my backup
          </button>
          <input ref={fileInput} aria-label="Select StoryFlow backup" type="file" accept=".json,application/json" className="hidden" onChange={e => { void importBackup(e.target.files?.[0]); e.target.value = ''; }} />
          <button onClick={() => fileInput.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/10">
            <Upload className="h-4 w-4" /> Restore a backup file
          </button>
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Google email login is not configured yet. Entering an email cannot authenticate you. This version never claims to be synced across devices.</span>
          </div>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
};
