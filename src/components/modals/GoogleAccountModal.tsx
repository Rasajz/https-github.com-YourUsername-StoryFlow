'use client';

import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  CloudUpload, 
  RotateCcw, 
  LogOut, 
  CheckCircle2, 
  Mail, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';

export const GoogleAccountModal: React.FC = () => {
  const { 
    googleUser, 
    isGoogleModalOpen, 
    setIsGoogleModalOpen, 
    loginWithGoogle, 
    logoutGoogle, 
    backupToGoogle, 
    restoreFromGoogle 
  } = useStory();

  const [inputEmail, setInputEmail] = useState('');
  const [restoreEmailInput, setRestoreEmailInput] = useState('');
  const [showRestoreInput, setShowRestoreInput] = useState(false);

  if (!isGoogleModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    loginWithGoogle(inputEmail.trim());
    setInputEmail('');
  };

  const handleCustomRestore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreEmailInput.trim()) return;
    restoreFromGoogle(restoreEmailInput.trim());
    setRestoreEmailInput('');
    setShowRestoreInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#14171F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#181D28] to-[#14171F] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google G Logo icon */}
            <div className="w-8 h-8 rounded-lg bg-white p-1.5 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Google Account & Cloud Backup</h3>
              <p className="text-[11px] text-gray-400">Restore your story, notes, and boards anywhere with your Gmail</p>
            </div>
          </div>
          <button 
            onClick={() => setIsGoogleModalOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {googleUser ? (
            /* Signed In View */
            <div className="space-y-5">
              {/* Account Card */}
              <div className="p-4 rounded-xl bg-[#1B202C] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-base flex items-center justify-center shadow-lg ring-2 ring-amber-500/30">
                    {googleUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{googleUser.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 text-gray-500" />
                      {googleUser.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logoutGoogle}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Sign out of this Gmail account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>

              {/* Cloud Sync Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-gray-500">Cloud Storage Operations</span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Auto-Save Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Backup Button */}
                  <button
                    onClick={backupToGoogle}
                    className="p-4 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 hover:from-amber-500/25 hover:to-orange-500/20 border border-amber-500/30 text-left space-y-2 transition-all group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CloudUpload className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Backup to Gmail</h5>
                      <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">
                        Save all your notes, storyboard cards, scenes, and media to cloud storage.
                      </p>
                    </div>
                  </button>

                  {/* Restore Button */}
                  <button
                    onClick={() => restoreFromGoogle()}
                    className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 hover:from-cyan-500/25 hover:to-blue-500/20 border border-cyan-500/30 text-left space-y-2 transition-all group shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Restore from Gmail</h5>
                      <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">
                        Reload and recover all previously saved work attached to your Gmail account.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Restore From Another Account Toggle */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                {!showRestoreInput ? (
                  <button
                    onClick={() => setShowRestoreInput(true)}
                    className="text-xs text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Restore backup from a different Gmail address...</span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomRestore} className="p-3.5 rounded-xl bg-[#0B0D11] border border-white/10 space-y-2.5">
                    <label className="text-[11px] font-semibold text-gray-300">Enter Gmail to Restore From:</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="other.creator@gmail.com"
                        value={restoreEmailInput}
                        onChange={(e) => setRestoreEmailInput(e.target.value)}
                        className="flex-1 bg-[#14171F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1"
                      >
                        <span>Restore</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Sign In Form View */
            <div className="space-y-5">
              <div className="text-center space-y-1.5 py-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black mx-auto shadow-lg shadow-amber-500/20">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-base font-bold text-white">Sign In with your Gmail</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Never lose your story ideas, boards, or screenplay scenes. Sign in with your Gmail account to enable automatic cloud backup and multi-device restoration.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Gmail Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@gmail.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="w-full bg-[#0B0D11] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In with Gmail & Enable Cloud Backup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* One Click Quick Demo Login */}
              <div className="pt-2">
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-wider mb-2">Or Quick Sign In</p>
                <button
                  type="button"
                  onClick={() => loginWithGoogle('filmmaker.creator@gmail.com', 'Director Maya')}
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign in as filmmaker.creator@gmail.com</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0B0D11] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
          <span>Encrypted with Google Cloud Storage protocol</span>
          <button 
            onClick={() => setIsGoogleModalOpen(false)}
            className="text-gray-400 hover:text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
