export type AppleCatchGameState = 'start' | 'tutorial' | 'playing' | 'paused' | 'gameover' | 'levelcomplete';

export type AppleType = 'red_apple' | 'golden_apple' | 'rotten_apple' | 'star_cincau';

export type CingcauMascotEmotion = 
  | 'idle' 
  | 'tracking' 
  | 'happy_catch' 
  | 'surprised' 
  | 'worried' 
  | 'recoil_damage' 
  | 'celebrating' 
  | 'disappointed';

export interface FallingItem {
  id: number;
  type: AppleType;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  speed: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  caught?: boolean;
}

export interface CatchParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  shape: 'circle' | 'star' | 'leaf';
}

export interface FloatingScore {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
}
