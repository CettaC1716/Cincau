---
name: Playful Tactile Learning
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e11'
  surface-container-low: '#1b1b1f'
  surface-container: '#1f1f23'
  surface-container-high: '#292a2d'
  surface-container-highest: '#343538'
  on-surface: '#e3e2e6'
  on-surface-variant: '#c2cab0'
  inverse-surface: '#e3e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#8c947c'
  outline-variant: '#424936'
  surface-tint: '#98da27'
  primary: '#ccff80'
  on-primary: '#213600'
  primary-container: '#a3e635'
  on-primary-container: '#416400'
  inverse-primary: '#446900'
  secondary: '#ffb5a0'
  on-secondary: '#5f1500'
  secondary-container: '#d73b00'
  on-secondary-container: '#fffbff'
  tertiary: '#ffedc1'
  on-tertiary: '#3c2f00'
  tertiary-container: '#fccd24'
  on-tertiary-container: '#6e5700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b2f746'
  primary-fixed-dim: '#98da27'
  on-primary-fixed: '#121f00'
  on-primary-fixed-variant: '#334f00'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#862200'
  tertiary-fixed: '#ffe087'
  tertiary-fixed-dim: '#efc112'
  on-tertiary-fixed: '#231a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#121316'
  on-background: '#e3e2e6'
  surface-variant: '#343538'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '800'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 2rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 1.75rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is tailored for primary school learners (SD Kelas 1–6 within Indonesia's Kurikulum Merdeka framework) interacting via landscape tablet interfaces. It draws visual inspiration from tactile 3D play environments, CAD-style modeling sandboxes, and modern toy design aesthetics. 

The experience balances two key vectors: structured pedagogical clarity and tactile delight. The visual language utilizes high-energy, low-friction interactions. Deep matte charcoal canvases establish high optical contrast that allows vibrant primary tones (lime green, sunny canary yellow, and electric coral orange) to pop effortlessly without causing visual fatigue. 

Interactions leverage physical metaphors: squishy, tactile 3D buttons, pill-shaped floating docks, and chunky rounded touch surfaces. The interface builds confidence in young creators through direct touch ergonomics, oversized tap targets, and encouraging, friendly typography.

## Colors

The palette is engineered around theatrical contrast: deep, warm-matte charcoal surfaces juxtaposed with high-saturation, toy-like primaries.

- **Primary (`#A3E635` / Lime Spark):** The main call-to-action, success, and energetic highlight color. Conveys growth, active discovery, and play.
- **Secondary (`#FF5722` / Tangerine Coral):** Used for tactile accent badges, creation triggers, high-priority discovery tags, and active state highlights.
- **Tertiary (`#FFD028` / Sunny Canary):** Infuses warmth into learning module backplates, star ratings, and celebratory milestones.
- **Neutral Surface Canvas (`#121316` / Matte Obsidian):** Provides a backdrop that frames the high-key 3D cards and interactive geometry.
- **Surface Elevation Cards (`#1E2025` and `#FFFDF5`):** Card components shift dynamically between rich dark slate layers for project cards and soft warm buttermilk cream (`#FFFDF5`) for high-legibility literacy and tutorial content.
- **Text & Glyph Hierarchy:** `#FFFFFF` for primary display headers on dark backdrops, `#121316` for text housed inside light-cream cards, and `#8F96A3` for inactive icons and secondary metadata.

## Typography

Typographic scale is structured around **Plus Jakarta Sans**, chosen for its friendly geometric architecture, open apertures, and tall x-height, which optimize readability for primary school students.

- **Display & Headlines:** Heavy weights (Bold 700 to ExtraBold 800) offer punchy cadence. Titles use slight negative letter-spacing for a bold, posterized toy-box feel.
- **Body:** Kept at Medium 500 weight with comfortable line heights to ensure early readers easily scan instructional steps and project prompts.
- **Labels & Micro-Tags:** Rendered in Bold or ExtraBold uppercase styling (e.g., "NEW", "TUTORIAL") to deliver scannable badges that match tablet touch visual clarity.

## Layout & Spacing

Designed for landscape tablet orientation (optimized for 10"–12.9" displays, 1024px to 1366px horizontal widths).

- **Grid Architecture:** A responsive 12-column fluid grid governed by generous `margin` (2rem / 32px) and flexible `gutter` (1.25rem / 20px). This provides sufficient margin safety from bezel edges where children naturally grip devices.
- **Thumb Zones:** Primary navigational docks and major creative action hubs (like the primary floating "Draw/Create" button) are anchored horizontally along the bottom center or within easy thumb sweeps.
- **Touch Ergonomics:** All touchable elements adhere strictly to kid-friendly minimums: no primary interactive target is smaller than 52x52px, preventing missed taps from small hands or stylus pens.

## Elevation & Depth

Depth mimics high-end vinyl toys and tactile molded plastic blocks rather than ephemeral digital layers.

1. **Plinth & Canvas Base:** Flat, matte obsidian backdrop (`#121316`) provides visual absorption that lets foreground interactive objects stand out.
2. **Tactile Surface Containers:** Cards use slight ambient occlusions (`0 12px 32px -4px rgba(0, 0, 0, 0.45)`) combined with subtle inner bevel highlights (`inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)`) to give surfaces a curved, 3D molded plastic feel.
3. **Floating Floating Controls:** Navbars and top segmented controls float above canvas backdrops with blurred glassmorphism scrims (`rgba(24, 25, 29, 0.75)` backdrop filter: `blur(20px)`) framed by a micro-border (`1px solid rgba(255, 255, 255, 0.08)`).
4. **Interactive Depression:** Press states do not use simple opacity drops; components translate along the Y-axis (+2px) with flattened shadows, providing physical button feedback.

## Shapes

The shape system adopts a pill-shaped and ultra-rounded vernacular (Level 3):

- **Interactive Triggers & Buttons:** Full stadium pills (`border-radius: 9999px`) on floating capsules, segmented switch controls, and action bars.
- **Card Units:** Chunky, hyper-curved corners spanning from `rounded-2xl` (24px) up to `rounded-3xl` (32px), creating child-safe visual geometry free of harsh vertices.
- **Badges & Micro-tags:** Pill capsules with generous internal padding ensuring pill-shapes remain intact across variable Indonesian vocabulary lengths.

## Components

### Buttons & Interactive Controls
- **Primary Hero Action (Floating "Draw" / "Create"):** Pure circular or pill-shaped button elevated above dock navigation. Features pure white (`#FFFFFF`) or lime green fill with deep, saturated icon glyphs and tactile downward drop states.
- **Floating Segmented Switch:** Dual-pill layout resting in a dark container (`#000000`/`#1E2025`). The active item shifts to bright white background with crisp dark text, while inactive items remain subdued translucent slate.
- **Utility Buttons:** Stylus draw buttons and import actions incorporate subtle outlines (`1.5px solid rgba(255, 255, 255, 0.15)`) with rounded circular icon enclosures.

### Touch Cards (The Toy Shelf)
- **Cream Learning Cards:** Warm buttermilk card stock (`#FFFDF5`) housing dark high-contrast typography, category eyebrow tags, and rich 3D rendered character previews.
- **Matte Charcoal Project Cards:** Deep obsidian tiles (`#1E2025`) highlighting vibrant 3D models with contextual status badges in the top corners (e.g., date stamps or pencil edit icons).
- **Option Overflows:** Round circular tap targets (44px) positioned at top-right card corners containing chunky triple-dot icons for asset actions.

### Floating Bottom Navigation Dock
- Centered, pill-shaped capsule grouping 5 key destinations (Home, Library, Create, Plans, Profile).
- Houses an oversized, center-promoted creative action button that breaks the upper boundary of the dock.
- Monochromatic line icons with supportive micro-labels beneath (`label-sm`), transitioning to high-contrast white when selected.

### Chips & Badges
- **Status Pills:** Vivid coral (`#FF5722`) with bold uppercase white text ("NEW", "SD 1", "TUTORIAL") seated at top-left corners of cards.
- **Progress Trackers:** Rounded pagination dots at the viewport's bottom, with active indicators expanded into stadium-shaped mini-pills.

### Modals & Dialogs
- Inset floating sheets with 36px radii, anchored in the screen center with a dimming backdrop overlay (`rgba(10, 11, 14, 0.8)`). Clear dismiss controls and large touch-friendly completion triggers.