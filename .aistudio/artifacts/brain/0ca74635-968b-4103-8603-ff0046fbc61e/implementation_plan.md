# Cingcau: Apple Catch! — Premium 2D Casual Browser Game

A complete, highly-polished, responsive browser game for children and casual players featuring Cingcau—an adorable, squishy, expressive cube mascot who physically catches falling apples. Built with custom vector SVG artwork, smooth canvas & CSS physics animations, multi-expression facial reactions, Web Audio API sound effects, and persistent local high scores.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Game Mechanics & Visual Choices**:
> - **Cingcau as the Catcher**: Cingcau is the active player character positioned at the bottom of the screen. Apples land directly on top of Cingcau's squishy head to score points.
> - **Rich Item Types**: Red Apples (+1 pt), Golden Apples (+3 pts & speed boost), Sparkling Stars (+5 pts), and Rotten/Dangerous Apples (-1 Life & recoil animation).
> - **Responsive Control Options**: Smooth Pointer/Touch Dragging (follows cursor/finger with spring elasticity), Left/Right Keyboard Arrows (A/D keys), and On-Screen Touch Buttons for mobile web.
> - **Dynamic Facial Expressions**: Cingcau smoothly switches expressions based on game events (`idle`, `looking_at_apple`, `happy_catch`, `surprised`, `disappointed_miss`, `recoil_damage`, `celebrating`).
> - **Audio & Game Juice**: Synthesized Web Audio API sound effects for pops, catches, golden chimes, damage thuds, particle bursts, and floating score labels.

---

## 1. Overview & Core Concept

- **What It Does**: A 60-second action-arcade catch game where players maneuver Cingcau left and right under an orchard canopy to catch falling fresh apples and stars while dodging rotten apples.
- **Target Audience**: Elementary school kids (Grade 1–6), parents, and casual arcade lovers seeking a charming, responsive, non-violent web game experience.
- **Key Value**: Delivers console/indie-mobile tier visual fidelity, responsive physics controls, instant browser playability, zero external asset dependencies, and local high-score tracking.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Screen A (Start Menu)**: Animated hero scene with Cingcau bouncing gently under floating apples, game title banner, "Mulai Bermain 🚀" primary button, "Cara Bermain 📖" guide button, and Sound Toggle.
2. **Screen B (How to Play)**: 3-step illustrated guide showing movement, scoring items (Red +1, Gold +3, Star +5), and hazards (Rotten -1 Life).
3. **Screen C (Main Gameplay)**:
   - **Top HUD**: Live Score, High Score, 3 Heart Lives, Pause Button.
   - **Play Area**: Sky backdrop with moving clouds, distant orchard hills, falling apples/stars/hazards with shadow indicators, particle bursts, floating "+1"/"+3" score labels.
   - **Bottom Area**: Cingcau mascot moving smoothly with body tilt and squish/stretch recoil upon catches.
4. **Screen D (Pause Menu)**: Translucent glassmorphism overlay freezing game updates with "Lanjutkan", "Ulangi", and "Menu Utama" options.
5. **Screen E (Game Over)**: Displays sad/adorable Cingcau, final score, best score badge, "Coba Lagi" button, and main menu button.
6. **Screen F (Level Complete / Victory)**: Triggered upon high score milestones or 60s timer survival with star rating, celebrating Cingcau bouncing with confetti particles.

### Visual Identity & Theme
- **Color Palette**:
  - Sky Blue: `#BDEBFF` (Background atmosphere)
  - Cream/Warm Sunshine: `#FFF7DF` (Card backings & HUD)
  - Apple Red: `#FF4D57` (Primary juicy apple)
  - Golden Yellow: `#FFC107` (Golden bonus apple & stars)
  - Leaf Green: `#78C96B` (Orchard foliage & success states)
  - Rotten Purple/Brown: `#6B4668` (Dangerous fruit hazard)
  - Warm Orange: `#FFB347` (UI Accents & buttons)
  - Deep Navy: `#28334A` (High-contrast typography)
  - Soft Pink: `#FFB6C8` (Cheek blush & soft glows)
- **Typography & Layout**: Bold, friendly rounded display typography (`Outfit`, `Plus Jakarta Sans`, system rounded fonts), high readability contrast, and 44px+ touch-friendly buttons.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual SVG + Canvas Render Architecture**
  - *Chosen Approach*: Render HUD, menus, overlay panels, and Cingcau's complex vector facial expressions using modular SVG components, while using an optimized HTML5 Canvas loop for smooth 60fps falling item physics and particle effects.
  - *Why*: Provides crystal-clear vector scaling across high-DPI retina screens while maintaining 60fps performance without DOM overload during multi-particle cascades.
- **Decision 2: Synthesized Web Audio API vs. External MP3 Audio**
  - *Chosen Approach*: Synthesize all game sound effects (pop, chime, thud, fanfares) directly using Web Audio API oscillators and gain envelopes.
  - *Why*: Guarantees 100% offline reliability, instant playback without audio load delays, zero external network requests, and zero broken URL dependencies.
- **Decision 3: Local Storage High-Score Persistence**
  - *Chosen Approach*: Save player best score and audio settings directly in `localStorage` under key `cingcau_apple_catch_highscore`.
  - *Why*: Instant persistence across sessions without requiring user login or backend servers.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Container (App.tsx)                         │
│  State: gameState ('TITLE'|'TUTORIAL'|'PLAYING'|'PAUSED'|'OVER'|'WIN') │
│  State: score, highScore, lives, soundEnabled, activeAppleType        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│   StartMenu     │        │  HowToPlayGuide │        │  GameScene      │
│ - Hero Cingcau  │        │ - Illustrated   │        │ - Canvas Physics│
│ - Play / Guide  │        │   3-Step Rules  │        │ - Cingcau Mascot│
└─────────────────┘        └─────────────────┘        │ - Fall Spawner  │
                                                      │ - Collision Reg │
                                                      │ - Particles     │
                                                      └────────┬────────┘
                                                               │
                                         ┌─────────────────────┴─────────────────────┐
                                         ▼                                           ▼
                              ┌─────────────────────┐                     ┌─────────────────────┐
                              │     PauseMenu       │                     │ GameOver / Complete │
                              │ - Resume / Restart  │                     │ - Score Summary     │
                              └─────────────────────┘                     │ - Best Score Badge  │
                                                                          └─────────────────────┘
```

### Game Engine State Mapping

| Game State | Cingcau Expression | Spawner Status | Physics Loop | Interactive Controls |
| :--- | :--- | :--- | :--- | :--- |
| `TITLE` | `idle` (breathing, blinking) | Disabled | Menu Float Animation | Play & Guide Buttons |
| `TUTORIAL` | `thinking` | Disabled | Static | Back & Start Buttons |
| `PLAYING` | `looking_at_apple` / `happy_catch` / `recoil_damage` | Active (Red/Gold/Rotten) | 60fps delta-time collision loop | Touch Drag / Arrow Keys / On-screen Buttons |
| `PAUSED` | `surprised` | Frozen | Frozen | Resume / Restart / Menu |
| `GAME_OVER`| `disappointed` | Stopped | Particles dissipate | Retry / Menu |
| `LEVEL_COMPLETE` | `celebrating` (bouncing) | Confetti active | Confetti floating | Next Level / Play Again |

---

## 5. File Structure & Component Strategy

1. `src/types/game.ts`: Game Types (`GameState`, `AppleItem`, `Particle`, `CingcauEmotion`, `ScoreRecord`).
2. `src/utils/audio.ts`: Web Audio API sound synthesizer (catch pop, gold sparkle, damage thud, game over tune, victory chime).
3. `src/components/CingcauMascot.tsx`: Vector SVG mascot component with dynamic facial expressions, glossy jelly highlights, independent eye tracking, and squish/stretch transform support.
4. `src/components/SVGAssets.tsx`: Vector illustrations for Red Apple, Golden Apple, Rotten Apple, Star Item, Tree Orchard, Sky Clouds, and Trophy icons.
5. `src/components/GameScene.tsx`: Main gameplay engine with HTML5 Canvas falling physics, AABB collision box detection, particle generator, and touch/keyboard input handling.
6. `src/components/StartMenu.tsx`: Main title screen with hero Cingcau, floating apples, title banner, and navigation.
7. `src/components/HowToPlayModal.tsx`: Illustrated 3-step rules overlay.
8. `src/components/PauseOverlay.tsx`: Pause menu overlay with frozen game state.
9. `src/components/GameOverModal.tsx`: End of game modal with score tally and retry trigger.
10. `src/components/LevelCompleteModal.tsx`: Victory modal with 3-star rating system and confetti.
11. `src/App.tsx`: Main state coordinator connecting screen views, local storage high scores, and audio toggles.

---

## 6. Verification & Quality Assurance

1. **Compilation Check**: Run `compile_applet` to verify TypeScript types, imports, and JSX structure.
2. **Lint Validation**: Run `lint_applet` (`tsc --noEmit`) to guarantee zero syntax or type errors.
3. **Gameplay Validation**: Test keyboard left/right, touch/mouse dragging, collision accuracy, item scoring, lives deduction on missed/rotten apples, pause/resume freeze, and high score persistence in `localStorage`.
