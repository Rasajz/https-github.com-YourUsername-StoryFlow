'use client';

import React, { useState } from 'react';
import { Sparkles, Clapperboard, Music2, Save, Download, ChevronDown, ChevronUp, ArrowRight, Loader2 } from 'lucide-react';
import { useStory } from '../../context/StoryContext';
import type { DirectorPlan, DirectorMode } from '../../types';

export const DirectorWorkspace: React.FC = () => {
  const { activeProjectId, projectName, directorPlans, saveDirectorPlan, addDirectorShotsToStoryboard } = useStory();
  const plan = directorPlans[activeProjectId];
  const [story, setStory] = useState('');
  const [level, setLevel] = useState<DirectorMode>('balanced');
  const [genre, setGenre] = useState('Drama');
  const [mood, setMood] = useState('Emotional');
  const [gear, setGear] = useState('Phone only');
  const [location, setLocation] = useState('One accessible location');
  const [duration, setDuration] = useState(90);
  const [oneLocation, setOneLocation] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(0);
  const [notice, setNotice] = useState('');

  const run = async () => {
    setError(''); setNotice('');
    if (story.trim().length < 20) { setError('Enter at least 20 characters describing your story.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/storyboard', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story, level, genre, mood, gear, location, duration, oneLocation })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not generate the plan.');
      saveDirectorPlan(data.plan as DirectorPlan);
      setNotice('Your new plan was saved on this device. Import the shots into your storyboard when ready.');
      setExpanded(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.');
    } finally { setBusy(false); }
  };

  const download = () => {
    if (!plan) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url;
    link.download = 'StoryFlow-' + projectName.replace(/[^a-z0-9-_]+/gi, '-') + '-Director-Plan.json';
    link.click(); URL.revokeObjectURL(url);
  };
  const fillExample = () => {
    setStory('A student sits beside a lake after a difficult day, holding a photograph of his mother. He wants to pursue filmmaking but feels guilty about leaving home. An unexpected phone call changes what he decides to do next.');
    setGenre('Drama'); setMood('Hopeful'); setGear('Phone only');
    setOneLocation(true); setDuration(90);
  };

  const control = 'w-full rounded-lg border border-white/10 bg-[#161A23] px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/60';
  return (
    <div className="flex-1 overflow-y-auto bg-[#0B0D11] pb-20 md:pb-6">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="mb-1 flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest"><Sparkles className="h-4 w-4" /> StoryFlow AI Director</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">From idea to shootable scene.</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">Create ten purposeful cinematic shots, a four-part sound map, and a stronger story arc. Keep your artistic voice.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">Project: {projectName}</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(330px,1fr)]">
          <section className="rounded-2xl border border-white/10 bg-[#12151D] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-semibold">Your story</h2><button onClick={fillExample} className="text-xs font-semibold text-amber-400 hover:underline">Use example</button></div>
            <textarea aria-label="Your story" rows={8} className={control + ' resize-y leading-relaxed'} value={story} onChange={e=>setStory(e.target.value)} placeholder="What happens? Who wants what? What emotion should the audience feel?" maxLength={6000}/>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-gray-400 space-y-1">Genre
                <select className={control} value={genre} onChange={e=>setGenre(e.target.value)}><option>Drama</option><option>Thriller</option><option>Romance</option><option>Comedy</option><option>Documentary</option><option>Experimental</option></select>
              </label>
              <label className="text-xs text-gray-400 space-y-1">Emotional mood
                <select className={control} value={mood} onChange={e=>setMood(e.target.value)}><option>Emotional</option><option>Hopeful</option><option>Suspenseful</option><option>Melancholic</option><option>Energetic</option><option>Quiet</option></select>
              </label>
              <label className="text-xs text-gray-400 space-y-1">Equipment
                <select className={control} value={gear} onChange={e=>setGear(e.target.value)}><option>Phone only</option><option>Phone + tripod</option><option>DSLR + tripod</option><option>Mirrorless + gimbal</option><option>Basic crew</option></select>
              </label>
              <label className="text-xs text-gray-400 space-y-1">Film length
                <select className={control} value={duration} onChange={e=>setDuration(Number(e.target.value))}><option value={30}>30 seconds</option><option value={60}>60 seconds</option><option value={90}>90 seconds</option><option value={180}>3 minutes</option></select>
              </label>
            </div>
            <label className="block text-xs text-gray-400 space-y-1">Where can you film?
              <input className={control} value={location} onChange={e=>setLocation(e.target.value)} maxLength={150} placeholder="Lake, dorm room, home..."/>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={oneLocation} onChange={e=>setOneLocation(e.target.checked)} className="accent-amber-500"/> Keep everything in one location</label>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Choose creative depth</p>
              <div className="grid grid-cols-3 gap-2">
                {([['quick','Quick'],['balanced','Balanced'],['deep',"Director's Cut"]] as const).map(([id,label])=>
                  <button key={id} type="button" onClick={()=>setLevel(id)} className={'rounded-lg border px-2 py-3 text-xs font-semibold transition-colors ' + (level===id?'border-amber-500 bg-amber-500/15 text-amber-300':'border-white/10 bg-white/5 text-gray-400 hover:border-white/30')}>{label}</button>
                )}
              </div>
            </div>
            <button disabled={busy} onClick={run} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 font-bold text-black disabled:opacity-60 hover:bg-amber-400">
              {busy?<Loader2 className="h-4 w-4 animate-spin"/>:<Sparkles className="h-4 w-4"/>}
              {busy?'Directing your scene...':'Generate 10 cinematic shots'}
            </button>
            {error && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
            {notice && <p role="status" className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">{notice}</p>}
            <p className="text-xs text-gray-500">Real AI requires an API key on the private server. Usage may cost money. Plans save locally in this browser, not to the cloud.</p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#12151D] p-5 space-y-4">
            {plan ? <>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{plan.title}</h2>
                <span className="text-xs text-gray-500">Saved locally</span>
              </div>
              <p className="text-sm text-gray-300">{plan.logline}</p>
              <div className="rounded-xl border border-white/10 bg-[#0D1016] p-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Emotional arc</p><p className="text-sm text-gray-300">{plan.arc}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 pt-2">Strengthen the story</p><p className="text-sm text-gray-300">{plan.upgrade}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <button onClick={()=>addDirectorShotsToStoryboard(plan)} className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-3 py-3 text-xs font-bold text-black"><Clapperboard className="h-4 w-4"/> Add all 10 to Storyboard <ArrowRight className="h-3 w-3"/></button>
                <button onClick={download} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-xs font-semibold"><Download className="h-4 w-4"/> Export plan JSON</button>
              </div>
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold"><Clapperboard className="h-4 w-4 text-amber-400"/> Ten-shot plan</h3>
                {plan.shots.map((shot,index)=>(
                  <div key={index} className="rounded-xl border border-white/10 bg-[#0C1018] overflow-hidden">
                    <button className="w-full text-left p-3 flex items-center gap-3" onClick={()=>setExpanded(expanded===index?null:index)}>
                      <span className="rounded-lg bg-amber-500/15 px-2 py-2 text-sm font-bold text-amber-300">{String(shot.number).padStart(2,'0')}</span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{shot.title}</span><span className="block text-xs text-gray-500">{shot.time} · {shot.shotSize} · {shot.seconds}s</span></span>
                      {expanded===index?<ChevronUp className="h-4 w-4 text-gray-500"/>:<ChevronDown className="h-4 w-4 text-gray-500"/>}
                    </button>
                    {expanded===index&&<div className="border-t border-white/10 px-3 pb-4 pt-3 space-y-2 text-sm text-gray-300">
                      <p>{shot.action}</p><p><b className="text-amber-300">Camera:</b> {shot.movement}</p><p><b className="text-amber-300">Lighting:</b> {shot.lighting}</p><p><b className="text-amber-300">Sound:</b> {shot.sound}</p><p><b className="text-amber-300">Why it works:</b> {shot.purpose}</p><p><b className="text-amber-300">On set:</b> {shot.practical}</p>
                    </div>}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold"><Music2 className="h-4 w-4 text-amber-400"/> Music and silence map</h3>
                {plan.musicPlan.map((part,i)=><div key={i} className="rounded-xl border border-white/10 p-3">
                  <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{part.heading}</span><span className="text-xs text-amber-400">{part.silence?'Silence':part.range}</span></div>
                  <p className="text-xs text-gray-300 mt-2">{part.cue}</p><p className="text-xs text-gray-500 mt-1">{part.note}</p>
                </div>)}
              </div>
            </>:<div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10"><Clapperboard className="h-9 w-9 text-amber-400"/></div>
              <h2 className="text-xl font-semibold">Your director's desk is ready.</h2>
              <p className="max-w-sm text-sm text-gray-400">Describe a story on the left, choose your creative depth, and generate a shootable storyboard with music cues and deliberate silence.</p>
              <span className="text-xs text-gray-500"><Save className="inline h-3 w-3 mr-1"/> Plans save on your device after generation.</span>
            </div>}
          </section>
        </div>
      </div>
    </div>
  );
};
