export type WorkspaceView = 'notes' | 'storyboard' | 'script' | 'media' | 'director';

export type NoteTag = 'All' | 'Ideas' | 'Characters' | 'Dialogue' | 'References' | 'Locations';

export interface LinkedRef {
  id: string;
  type: 'character' | 'scene' | 'reference' | 'location' | 'subboard';
  name: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: NoteTag[];
  linkedItems: LinkedRef[];
}

export type StoryNodeType = 'note' | 'character' | 'scene' | 'image' | 'video' | 'timeline' | 'subboard';

export interface StoryTimeline {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface StoryNodeData {
  nodeType: StoryNodeType;
  title: string;
  description?: string;
  tags?: string[];
  accentColor?: string;
  statusBadge?: string;
  imageUrl?: string;
  videoUrl?: string;
  creatorNotes?: string;
  sequenceNumber?: number;
  linkedScriptSceneId?: string;
  subBoardId?: string;
  subBoardTitle?: string;
  timelineId?: string;
  [key: string]: unknown;
}

export type ScreenplayBlockType = 
  | 'heading' 
  | 'action' 
  | 'character' 
  | 'dialogue' 
  | 'parenthetical' 
  | 'transition' 
  | 'shot';

export interface ScreenplayBlock {
  id: string;
  type: ScreenplayBlockType;
  text: string;
}

export interface ScriptScene {
  id: string;
  number: number;
  title: string;
  pageEstimate: string;
  durationEstimate: string;
  blocks: ScreenplayBlock[];
  linkedCardId?: string;
  characterChips: string[];
  moodImage?: string;
  storyPurpose?: string;
  shotIdeas: string[];
  timelineId?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'sketch' | 'pdf' | 'audio';
  url: string;
  tags: string[];
  connectedSceneOrBoard?: string;
  createdAt: string;
}

export interface BreadcrumbStep {
  id: string;
  title: string;
}

export interface GoogleUser {
  name: string;
  email: string;
  avatarUrl: string;
  lastBackupTime?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  genre?: string;
  description?: string;
  lastEdited?: string;
  notesCount?: number;
  cardsCount?: number;
  scenesCount?: number;
}

export type DirectorMode = 'quick' | 'balanced' | 'deep';
export interface DirectorShot {
  number: number; title: string; shotSize: string; movement: string;
  seconds: number; time: string; action: string; lighting: string;
  sound: string; purpose: string; practical: string;
}
export interface DirectorMusic { range: string; heading: string; cue: string; note: string; silence: boolean; }
export interface DirectorPlan {
  title: string; logline: string; arc: string; upgrade: string;
  musicPlan: DirectorMusic[]; shots: DirectorShot[];
}
