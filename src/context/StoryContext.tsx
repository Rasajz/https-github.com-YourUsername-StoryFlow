'use client';

/* eslint-disable react-hooks/set-state-in-effect -- Restore an existing local-first workspace and reflect actual browser write success. */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import {
  WorkspaceView,
  NoteItem,
  ScriptScene,
  MediaItem,
  BreadcrumbStep,
  StoryNodeData,
  GoogleUser,
  ProjectItem,
  StoryTimeline,
  DirectorPlan
} from '../types';
import {
  INITIAL_NOTES,
  INITIAL_SCRIPT_SCENES,
  INITIAL_STORYBOARD_NODES,
  INITIAL_STORYBOARD_EDGES,
  SUBBOARD_MAP,
  INITIAL_MEDIA_ITEMS,
  INITIAL_PROJECT_WORKSPACES,
  ProjectWorkspaceData
} from '../data/mockData';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info';
}

interface StoryContextType {
  activeView: WorkspaceView;
  setActiveView: (view: WorkspaceView) => void;
  projectName: string;
  setProjectName: (name: string) => void;

  // Projects
  projects: ProjectItem[];
  activeProjectId: string;
  switchProject: (projectId: string) => void;
  createProject: (name: string, genre?: string, description?: string) => void;
  renameCurrentProject: (newName: string) => void;
  deleteProject: (projectId: string) => void;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (open: boolean) => void;

  // Timelines & Story Tracks
  timelines: StoryTimeline[];
  activeTimelineId: string;
  setActiveTimelineId: (id: string) => void;
  createTimeline: (name: string, color: string, description?: string) => void;
  deleteTimeline: (id: string) => void;
  assignNodeTimeline: (nodeId: string, timelineId?: string) => void;
  assignSceneTimeline: (sceneId: string, timelineId?: string) => void;
  duplicateNode: (nodeId: string) => void;

  // Notes
  notes: NoteItem[];
  activeNoteId: string;
  setActiveNoteId: (id: string) => void;
  addNote: (note: Partial<NoteItem>) => void;
  updateNote: (id: string, updated: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  sendNoteToStoryboard: (selectedText: string, noteTitle: string) => void;

  // Storyboard
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  addNodeToCanvas: (data: StoryNodeData, position?: { x: number; y: number }) => void;
  updateNodeData: (id: string, updatedData: Partial<StoryNodeData>) => void;
  deleteNode: (id: string) => void;

  // Sub-boards
  breadcrumbStack: BreadcrumbStep[];
  drillDownSubBoard: (subBoardId: string, title: string) => void;
  navigateBreadcrumb: (index: number) => void;

  // Script Studio
  scriptScenes: ScriptScene[];
  activeSceneId: string;
  setActiveSceneId: (id: string) => void;
  addScriptScene: (title?: string) => string;
  updateScriptScene: (id: string, updated: Partial<ScriptScene>) => void;
  reorderScriptScenes: (newScenes: ScriptScene[]) => void;
  createScriptSceneFromCard: (cardId: string, cardTitle: string) => void;
  openScriptScene: (sceneId: string) => void;
  openLinkedCardInStoryboard: (cardId: string) => void;

  // Media Library
  mediaItems: MediaItem[];
  addMediaItem: (item: Partial<MediaItem>) => void;

  // AI Director: generated plans belong to individual projects.
  directorPlans: Record<string, DirectorPlan>;
  saveDirectorPlan: (plan: DirectorPlan) => void;
  addDirectorShotsToStoryboard: (plan: DirectorPlan) => void;

  // Google Account & Cloud Sync / Restore
  googleUser: GoogleUser | null;
  isGoogleModalOpen: boolean;
  setIsGoogleModalOpen: (open: boolean) => void;
  loginWithGoogle: (email: string, name?: string) => void;
  logoutGoogle: () => void;
  backupToGoogle: () => void;
  restoreFromGoogle: (email?: string) => boolean;

  // System & UI
  isSaving: boolean;
  saveStatus: string;
  toast: ToastMessage | null;
  showToast: (title: string, message: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<WorkspaceView>('notes');
  const [projectName, setProjectName] = useState<string>('Last Bus');

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string>('note-1');

  // Storyboard state
  const [nodes, setNodes] = useState<Node[]>(INITIAL_STORYBOARD_NODES as unknown as Node[]);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_STORYBOARD_EDGES as unknown as Edge[]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Sub-board breadcrumb stack
  const [breadcrumbStack, setBreadcrumbStack] = useState<BreadcrumbStep[]>([
    { id: 'main', title: 'Main Story Map' }
  ]);
  const [subBoardStorage, setSubBoardStorage] = useState<Record<string, { nodes: Node[]; edges: Edge[] }>>(SUBBOARD_MAP as Record<string, { nodes: Node[]; edges: Edge[] }>);

  // Script Studio state
  const [scriptScenes, setScriptScenes] = useState<ScriptScene[]>(INITIAL_SCRIPT_SCENES);
  const [activeSceneId, setActiveSceneId] = useState<string>('scene-1');

  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 'proj-1',
      name: 'Last Bus',
      genre: 'Mystery / Noir Short',
      description: 'A lonely college student encounters a mysterious stranger on the last midnight bus.',
      lastEdited: 'Just now',
      notesCount: 4,
      cardsCount: 4,
      scenesCount: 2
    },
    {
      id: 'proj-2',
      name: 'Neon Horizon 2099',
      genre: 'Cyberpunk Sci-Fi',
      description: 'An underground memory hacker investigates corporate blackouts in Sector 4.',
      lastEdited: 'Yesterday',
      notesCount: 3,
      cardsCount: 4,
      scenesCount: 2
    },
    {
      id: 'proj-3',
      name: 'Echoes of Silence',
      genre: 'Psychological Thriller',
      description: 'A sound designer discovers a hidden frequency embedded in forgotten cassette recordings.',
      lastEdited: '3 days ago',
      notesCount: 2,
      cardsCount: 3,
      scenesCount: 1
    }
  ]);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);

  // Project Workspace Registry (Stores each project's isolated notes, nodes, scenes, media)
  const [projectWorkspaces, setProjectWorkspaces] = useState<Record<string, ProjectWorkspaceData>>(INITIAL_PROJECT_WORKSPACES);

  // Timelines & Story Tracks state
  const [timelines, setTimelines] = useState<StoryTimeline[]>([
    { id: 'time-main', name: 'Main Storyline (A-Plot)', color: '#F59E0B', description: 'Primary protagonist journey & central dramatic spine' },
    { id: 'time-subplot', name: 'Subplot / Character B-Story', color: '#8B5CF6', description: 'Secondary character arcs & relationship dynamics' },
    { id: 'time-flashback', name: 'Flashbacks & Origin Lore', color: '#06B6D4', description: 'Past backstory, lore, and memory fragments' },
    { id: 'time-alt', name: 'Alternate Cut / Ending', color: '#10B981', description: 'Branching choices and alternate climax' }
  ]);
  const [activeTimelineId, setActiveTimelineId] = useState<string>('all');

  const [directorPlans, setDirectorPlans] = useState<Record<string, DirectorPlan>>({});

  // Google Account & Cloud Sync state
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);

  // System state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('Saved');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Local-first: hydrate once on the client, before any new state is written.
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('storyflow_local_v2');
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.version === 2 && Array.isArray(data.projects) && Array.isArray(data.notes)) {
          if (typeof data.projectName === 'string') setProjectName(data.projectName);
          if (typeof data.activeProjectId === 'string') setActiveProjectId(data.activeProjectId);
          if (Array.isArray(data.projects)) setProjects(data.projects);
          if (data.directorPlans && typeof data.directorPlans === 'object') setDirectorPlans(data.directorPlans);
          if (data.projectWorkspaces && typeof data.projectWorkspaces === 'object') setProjectWorkspaces(data.projectWorkspaces);
          if (Array.isArray(data.notes)) setNotes(data.notes);
          if (Array.isArray(data.nodes)) setNodes(data.nodes);
          if (Array.isArray(data.edges)) setEdges(data.edges);
          if (Array.isArray(data.scriptScenes)) setScriptScenes(data.scriptScenes);
          if (Array.isArray(data.mediaItems)) setMediaItems(data.mediaItems);
          if (Array.isArray(data.timelines)) setTimelines(data.timelines);
          if (typeof data.activeNoteId === 'string') setActiveNoteId(data.activeNoteId);
          if (typeof data.activeSceneId === 'string') setActiveSceneId(data.activeSceneId);
          if (typeof data.activeTimelineId === 'string') setActiveTimelineId(data.activeTimelineId);
          if (Array.isArray(data.breadcrumbStack)) setBreadcrumbStack(data.breadcrumbStack);
          if (data.subBoardStorage && typeof data.subBoardStorage === 'object') setSubBoardStorage(data.subBoardStorage);
          setSaveStatus('Restored from this device');
        }
      }
    } catch {
      setSaveStatus('Could not read local save. Export a backup after editing.');
    } finally {
      setStorageReady(true);
    }
  }, []);

  // Save all active project content after every edit. React effects run after changes,
  // so refreshing the page restores notes, script blocks, storyboard and other projects.
  useEffect(() => {
    if (!storageReady) return;
    try {
      const completeWorkspaces = {
        ...projectWorkspaces,
        [activeProjectId]: { projectName, notes, nodes, edges, scriptScenes, mediaItems, timelines }
      };
      window.localStorage.setItem('storyflow_local_v2', JSON.stringify({
        version: 2, savedAt: new Date().toISOString(),
        projectName, activeProjectId, projects, projectWorkspaces: completeWorkspaces, directorPlans,
        notes, nodes, edges, scriptScenes, mediaItems, timelines,
        activeNoteId, activeSceneId, activeTimelineId, breadcrumbStack, subBoardStorage
      }));
      setSaveStatus('Saved on this device');
      setIsSaving(false);
    } catch {
      setSaveStatus('Save failed: browser storage may be full. Export your backup.');
      setIsSaving(false);
    }
  }, [storageReady, projectName, activeProjectId, projects, projectWorkspaces, directorPlans,
      notes, nodes, edges, scriptScenes, mediaItems, timelines,
      activeNoteId, activeSceneId, activeTimelineId, breadcrumbStack, subBoardStorage]);

  // Autosave notification effect
  const triggerAutosave = () => {
    // The storage effect, not this indicator, confirms persistence.
    setSaveStatus('Unsaved changes');
  };

  const showToast = (title: string, message: string) => {
    const id = Date.now().toString();
    setToast({ id, title, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Real Google authentication is deliberately unavailable until an auth provider is configured.
  // Never treat an arbitrary email address as proof of identity.
  const loginWithGoogle = (_email: string, _name?: string) => {
    showToast('Sign-in not configured', 'Use local backups now. Verified Google sign-in requires an auth provider.');
  };
  const logoutGoogle = () => { setGoogleUser(null); };
  const backupToGoogle = () => {
    showToast('Local-first backup', 'Open Local Backups to download your data. Google Cloud is not connected.');
    setIsGoogleModalOpen(true);
  };
  const restoreFromGoogle = (_email?: string): boolean => {
    showToast('Local-first restore', 'Open Local Backups and import a JSON backup. Google Cloud is not connected.');
    setIsGoogleModalOpen(true);
    return false;
  };

  const saveDirectorPlan = (plan: DirectorPlan) => {
    setDirectorPlans(prev => ({ ...prev, [activeProjectId]: plan }));
    triggerAutosave();
  };

  const addDirectorShotsToStoryboard = (plan: DirectorPlan) => {
    const batch = Date.now().toString();
    const newNodes: Node[] = plan.shots.map((shot, index) => ({
      id: 'director-' + batch + '-' + index,
      type: 'sceneCard',
      position: { x: 140 + (index % 2) * 370, y: 130 + Math.floor(index / 2) * 220 },
      data: {
        nodeType: 'scene',
        title: 'Shot ' + String(shot.number).padStart(2, '0') + ': ' + shot.title,
        description: shot.action + '\n' +
          'Camera: ' + shot.shotSize + '; ' + shot.movement + '\n' +
          'Lighting: ' + shot.lighting + '\n' +
          'Sound: ' + shot.sound + '\n' +
          'Director: ' + shot.practical,
        statusBadge: shot.time,
        accentColor: '#F59E0B',
        timelineId: 'time-main'
      }
    }));
    setNodes(prev => [...prev, ...newNodes]);
    setActiveView('storyboard');
    setSelectedNodeId(newNodes[0]?.id || null);
    triggerAutosave();
    showToast('10 shots imported', 'The AI plan was added to your Storyboard canvas.');
  };

  // Projects Actions - Full Isolation & Persistence per Project
  const switchProject = (projectId: string) => {
    if (projectId === activeProjectId) {
      setIsProjectModalOpen(false);
      return;
    }
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    // 1. Snapshot and save current active project
    const updatedStore: Record<string, ProjectWorkspaceData> = {
      ...projectWorkspaces,
      [activeProjectId]: {
        projectName,
        notes,
        nodes,
        edges,
        scriptScenes,
        mediaItems,
        timelines
      }
    };

    // 2. Retrieve target project's dedicated workspace
    const targetData = updatedStore[projectId] || INITIAL_PROJECT_WORKSPACES[projectId] || {
      projectName: proj.name,
      notes: [],
      nodes: [],
      edges: [],
      scriptScenes: [],
      mediaItems: [],
      timelines: [
        { id: 'time-main', name: 'Main Storyline (A-Plot)', color: '#F59E0B', description: 'Primary story spine' }
      ]
    };

    // 3. Load target project workspace
    setProjectWorkspaces(updatedStore);
    setActiveProjectId(projectId);
    setProjectName(targetData.projectName || proj.name);
    setNotes(targetData.notes || []);
    if (targetData.notes?.length) setActiveNoteId(targetData.notes[0].id);
    setNodes(targetData.nodes || []);
    setEdges(targetData.edges || []);
    setSelectedNodeId(null);
    setScriptScenes(targetData.scriptScenes || []);
    if (targetData.scriptScenes?.length) setActiveSceneId(targetData.scriptScenes[0].id);
    setMediaItems(targetData.mediaItems || []);
    setTimelines(targetData.timelines?.length ? targetData.timelines : [
      { id: 'time-main', name: 'Main Storyline (A-Plot)', color: '#F59E0B', description: 'Primary story spine' }
    ]);
    setActiveTimelineId('all');

    showToast('Project Switched', `Opened workspace for "${proj.name}"`);
    setIsProjectModalOpen(false);
  };

  const createProject = (name: string, genre?: string, description?: string) => {
    const newId = `proj-${Date.now()}`;
    const newProj: ProjectItem = {
      id: newId,
      name,
      genre: genre || 'Feature Film / Story',
      description: description || 'New creator story project.',
      lastEdited: 'Just now',
      notesCount: 1,
      cardsCount: 1,
      scenesCount: 1
    };

    // 1. Save current active project
    const updatedStore: Record<string, ProjectWorkspaceData> = {
      ...projectWorkspaces,
      [activeProjectId]: {
        projectName,
        notes,
        nodes,
        edges,
        scriptScenes,
        mediaItems,
        timelines
      }
    };

    // 2. Create fresh, dedicated workspace specifically for this project
    const newWorkspaceData: ProjectWorkspaceData = {
      projectName: name,
      timelines: [
        { id: 'time-main', name: 'Main Storyline (A-Plot)', color: '#F59E0B', description: 'Primary story spine' },
        { id: 'time-subplot', name: 'Subplot / B-Story', color: '#8B5CF6', description: 'Secondary character arcs' }
      ],
      notes: [
        {
          id: `note-${Date.now()}-1`,
          title: `${name} — Opening Premise`,
          content: `Write the core logline and character ideas for "${name}" here...`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          tags: ['Ideas'],
          linkedItems: []
        }
      ],
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          type: 'noteCard',
          position: { x: 300, y: 180 },
          data: {
            nodeType: 'note',
            title: `${name} — Concept`,
            description: `Core story hook for ${name}. Right-click to add characters, video references, and scenes.`,
            tags: ['Idea'],
            accentColor: '#F59E0B',
            timelineId: 'time-main'
          }
        }
      ],
      edges: [],
      scriptScenes: [
        {
          id: `scene-${Date.now()}-1`,
          number: 1,
          title: `SCENE 1: EXT. ${name.toUpperCase()} - DAY`,
          pageEstimate: '1 Page',
          durationEstimate: '1:00',
          timelineId: 'time-main',
          characterChips: ['Protagonist'],
          blocks: [
            { id: `b-${Date.now()}-1`, type: 'heading', text: `EXT. ${name.toUpperCase()} - DAY` },
            { id: `b-${Date.now()}-2`, type: 'action', text: `Write the opening action for ${name} here.` }
          ],
          storyPurpose: `Establish the world of ${name}.`,
          shotIdeas: ['Wide establishing shot']
        }
      ],
      mediaItems: []
    };

    updatedStore[newId] = newWorkspaceData;
    setProjectWorkspaces(updatedStore);
    setProjects([newProj, ...projects]);
    setActiveProjectId(newId);
    setProjectName(name);
    setNotes(newWorkspaceData.notes);
    setActiveNoteId(newWorkspaceData.notes[0].id);
    setNodes(newWorkspaceData.nodes);
    setEdges([]);
    setSelectedNodeId(null);
    setScriptScenes(newWorkspaceData.scriptScenes);
    setActiveSceneId(newWorkspaceData.scriptScenes[0].id);
    setMediaItems([]);
    setTimelines(newWorkspaceData.timelines);
    setActiveTimelineId('all');

    showToast('Project Created', `Created and opened workspace for "${name}"`);
    setIsProjectModalOpen(false);
  };

  const renameCurrentProject = (newName: string) => {
    if (!newName.trim()) return;
    setProjectName(newName.trim());
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, name: newName.trim() } : p))
    );
    setProjectWorkspaces((prev) => ({
      ...prev,
      [activeProjectId]: {
        ...prev[activeProjectId],
        projectName: newName.trim()
      }
    }));
    showToast('Project Renamed', `Project renamed to "${newName.trim()}"`);
  };

  const deleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      showToast('Cannot Delete', 'You must have at least one active project.');
      return;
    }
    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);
    setProjectWorkspaces((prev) => {
      const copy = { ...prev };
      delete copy[projectId];
      return copy;
    });
    if (activeProjectId === projectId) {
      switchProject(remaining[0].id);
    } else {
      showToast('Project Deleted', 'Project has been removed.');
    }
  };

  // Timeline Actions
  const createTimeline = (name: string, color: string, description?: string) => {
    const newTimeline: StoryTimeline = {
      id: `time-${Date.now()}`,
      name,
      color: color || '#F59E0B',
      description: description || 'New narrative timeline track'
    };
    setTimelines((prev) => [...prev, newTimeline]);
    showToast('Timeline Created', `Created timeline track "${name}"`);
  };

  const deleteTimeline = (id: string) => {
    if (timelines.length <= 1) {
      showToast('Cannot Delete', 'At least one timeline track must exist.');
      return;
    }
    setTimelines((prev) => prev.filter((t) => t.id !== id));
    if (activeTimelineId === id) setActiveTimelineId('all');
    showToast('Timeline Deleted', 'Timeline track removed');
  };

  const assignNodeTimeline = (nodeId: string, timelineId?: string) => {
    updateNodeData(nodeId, { timelineId });
    const timelineName = timelines.find((t) => t.id === timelineId)?.name || 'Default';
    showToast('Card Assigned', `Assigned card to ${timelineName}`);
  };

  const assignSceneTimeline = (sceneId: string, timelineId?: string) => {
    updateScriptScene(sceneId, { timelineId });
    const timelineName = timelines.find((t) => t.id === timelineId)?.name || 'Default';
    showToast('Scene Assigned', `Assigned scene to ${timelineName}`);
  };

  const duplicateNode = (nodeId: string) => {
    const nodeToDup = nodes.find((n) => n.id === nodeId);
    if (!nodeToDup) return;
    const newId = `node-${Date.now()}`;
    const newNode: Node = {
      ...nodeToDup,
      id: newId,
      position: {
        x: nodeToDup.position.x + 40,
        y: nodeToDup.position.y + 40
      },
      data: {
        ...nodeToDup.data,
        title: `${(nodeToDup.data.title as string) || 'Card'} (Copy)`
      }
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    triggerAutosave();
    showToast('Card Duplicated', `Duplicated "${nodeToDup.data.title || 'Card'}"`);
  };

  // Keyboard shortcut Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Notes Actions
  const addNote = (partialNote: Partial<NoteItem>) => {
    const newId = `note-${Date.now()}`;
    const newNote: NoteItem = {
      id: newId,
      title: partialNote.title || 'Untitled Note',
      content: partialNote.content || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tags: partialNote.tags || ['Ideas'],
      linkedItems: partialNote.linkedItems || []
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newId);
    triggerAutosave();
    showToast('Note Created', `Created "${newNote.title}"`);
  };

  const updateNote = (id: string, updated: Partial<NoteItem>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updated } : n))
    );
    triggerAutosave();
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id && notes.length > 1) {
      const remaining = notes.filter((n) => n.id !== id);
      setActiveNoteId(remaining[0].id);
    }
    triggerAutosave();
    showToast('Note Deleted', 'Selected note was removed');
  };

  const sendNoteToStoryboard = (selectedText: string, noteTitle: string) => {
    const newCardId = `node-sent-${Date.now()}`;
    const newNode: Node = {
      id: newCardId,
      type: 'noteCard',
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 150 },
      data: {
        nodeType: 'note',
        title: noteTitle ? `Idea: ${noteTitle}` : 'Idea from Note',
        description: selectedText,
        tags: ['From Notes'],
        accentColor: '#F59E0B'
      }
    };

    setNodes((prev) => [...prev, newNode]);
    triggerAutosave();
    showToast('Added to Storyboard', `Created card from selected text on Storyboard`);
  };

  // Storyboard Actions
  const addNodeToCanvas = (data: StoryNodeData, position?: { x: number; y: number }) => {
    const newId = `node-${Date.now()}`;
    let nodeType = 'noteCard';

    switch (data.nodeType) {
      case 'character': nodeType = 'characterCard'; break;
      case 'scene': nodeType = 'sceneCard'; break;
      case 'image': nodeType = 'imageCard'; break;
      case 'video': nodeType = 'videoCard'; break;
      case 'timeline': nodeType = 'timelineCard'; break;
      case 'subboard': nodeType = 'subboardCard'; break;
      default: nodeType = 'noteCard'; break;
    }

    const newNode: Node = {
      id: newId,
      type: nodeType,
      position: position || { x: 320, y: 220 },
      data
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    triggerAutosave();
    showToast('Card Added', `Added ${data.title || 'new card'} to canvas`);
  };

  const updateNodeData = (id: string, updatedData: Partial<StoryNodeData>) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData
            }
          };
        }
        return node;
      })
    );
    triggerAutosave();
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
    triggerAutosave();
    showToast('Card Deleted', 'Card removed from storyboard');
  };

  // Sub-board Actions
  const drillDownSubBoard = (subBoardId: string, title: string) => {
    // Save current nodes and edges into subBoardStorage if we are on main
    const currentStackTop = breadcrumbStack[breadcrumbStack.length - 1];
    // Preserve the current canvas before entering a nested board.
    setSubBoardStorage((prev) => ({ ...prev, [currentStackTop.id]: { nodes, edges } }));

    setBreadcrumbStack((prev) => [...prev, { id: subBoardId, title }]);

    // Load sub-board data or fallback
    const targetSubBoard = subBoardStorage[subBoardId] || {
      nodes: [
        {
          id: `sub-node-1-${subBoardId}`,
          type: 'noteCard',
          position: { x: 200, y: 150 },
          data: {
            nodeType: 'note',
            title: `${title} Overview`,
            description: 'Sub-board sequence breakdown.',
            tags: ['Sequence'],
            accentColor: '#10B981'
          }
        }
      ],
      edges: []
    };

    setNodes(targetSubBoard.nodes as unknown as Node[]);
    setEdges(targetSubBoard.edges as unknown as Edge[]);
    setSelectedNodeId(null);
    showToast('Navigated Sub-board', `Opened "${title}" canvas`);
  };

  const navigateBreadcrumb = (index: number) => {
    if (index >= breadcrumbStack.length) return;
    const targetStep = breadcrumbStack[index];
    const currentStep = breadcrumbStack[breadcrumbStack.length - 1];
    setSubBoardStorage((prev) => ({ ...prev, [currentStep.id]: { nodes, edges } }));
    const newStack = breadcrumbStack.slice(0, index + 1);
    setBreadcrumbStack(newStack);

    if (targetStep.id === 'main') {
      setNodes(subBoardStorage.main?.nodes || (INITIAL_STORYBOARD_NODES as unknown as Node[]));
      setEdges(subBoardStorage.main?.edges || (INITIAL_STORYBOARD_EDGES as unknown as Edge[]));
    } else {
      const targetSubBoard = subBoardStorage[targetStep.id];
      if (targetSubBoard) {
        setNodes(targetSubBoard.nodes as unknown as Node[]);
        setEdges(targetSubBoard.edges as unknown as Edge[]);
      }
    }
    setSelectedNodeId(null);
  };

  // Script Studio Actions
  const addScriptScene = (customTitle?: string) => {
    const nextNumber = scriptScenes.length + 1;
    const newId = `scene-${Date.now()}`;
    const newTitle = customTitle || `SCENE ${nextNumber}: EXT. LOCATION – DAY`;

    const newScene: ScriptScene = {
      id: newId,
      number: nextNumber,
      title: newTitle,
      pageEstimate: '1 Page',
      durationEstimate: '1:15',
      blocks: [
        { id: `b-${Date.now()}-1`, type: 'heading', text: newTitle },
        { id: `b-${Date.now()}-2`, type: 'action', text: 'Describe the location and atmospheric action here.' }
      ],
      characterChips: ['Maya'],
      storyPurpose: 'Describe the scene narrative purpose here.',
      shotIdeas: ['Establishing shot', 'Medium close-up']
    };

    setScriptScenes([...scriptScenes, newScene]);
    setActiveSceneId(newId);
    triggerAutosave();
    showToast('Scene Created', `Added "${newTitle}" to Script Studio`);
    return newId;
  };

  const updateScriptScene = (id: string, updated: Partial<ScriptScene>) => {
    setScriptScenes((prev) =>
      prev.map((sc) => (sc.id === id ? { ...sc, ...updated } : sc))
    );
    triggerAutosave();
  };

  const reorderScriptScenes = (newScenes: ScriptScene[]) => {
    const renumbered = newScenes.map((sc, index) => ({
      ...sc,
      number: index + 1
    }));
    setScriptScenes(renumbered);
    triggerAutosave();
  };

  const createScriptSceneFromCard = (cardId: string, cardTitle: string) => {
    const newSceneId = addScriptScene(`SCENE: ${cardTitle.toUpperCase()}`);
    // Link card to new scene
    updateNodeData(cardId, { linkedScriptSceneId: newSceneId });
    openScriptScene(newSceneId);
    showToast('Linked Script Scene', `Created screenplay scene linked to card "${cardTitle}"`);
  };

  const openScriptScene = (sceneId: string) => {
    setActiveView('script');
    setActiveSceneId(sceneId);
  };

  const openLinkedCardInStoryboard = (cardId: string) => {
    setActiveView('storyboard');
    setSelectedNodeId(cardId);
  };

  // Media Library Actions
  const addMediaItem = (item: Partial<MediaItem>) => {
    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      title: item.title || 'Untitled Reference',
      type: item.type || 'image',
      url: item.url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      tags: item.tags || ['General'],
      connectedSceneOrBoard: item.connectedSceneOrBoard || 'Main Story Map',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setMediaItems([newMedia, ...mediaItems]);
    triggerAutosave();
    showToast('Media Uploaded', `Added "${newMedia.title}" to Media Library`);
  };

  return (
    <StoryContext.Provider
      value={{
        activeView,
        setActiveView,
        projectName,
        setProjectName,

        projects,
        activeProjectId,
        directorPlans,
        saveDirectorPlan,
        addDirectorShotsToStoryboard,
        switchProject,
        createProject,
        renameCurrentProject,
        deleteProject,
        isProjectModalOpen,
        setIsProjectModalOpen,

        timelines,
        activeTimelineId,
        setActiveTimelineId,
        createTimeline,
        deleteTimeline,
        assignNodeTimeline,
        assignSceneTimeline,
        duplicateNode,

        notes,
        activeNoteId,
        setActiveNoteId,
        addNote,
        updateNote,
        deleteNote,
        sendNoteToStoryboard,

        nodes,
        setNodes,
        edges,
        setEdges,
        selectedNodeId,
        setSelectedNodeId,
        addNodeToCanvas,
        updateNodeData,
        deleteNode,

        breadcrumbStack,
        drillDownSubBoard,
        navigateBreadcrumb,

        scriptScenes,
        activeSceneId,
        setActiveSceneId,
        addScriptScene,
        updateScriptScene,
        reorderScriptScenes,
        createScriptSceneFromCard,
        openScriptScene,
        openLinkedCardInStoryboard,

        mediaItems,
        addMediaItem,

        googleUser,
        isGoogleModalOpen,
        setIsGoogleModalOpen,
        loginWithGoogle,
        logoutGoogle,
        backupToGoogle,
        restoreFromGoogle,

        isSaving,
        saveStatus,
        toast,
        showToast,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        focusMode,
        setFocusMode
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
