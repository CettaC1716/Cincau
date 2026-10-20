# Layout & Spatial Reorganization Implementation Plan

Reorganize the main dashboard layout to reposition the learning bento cards, verticalize the bottom navigation/action bar, align the mascot and sidebar, and place Father's chat bubble and daily mission (with Shin-chan mascot) into the left column space.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Confirmed Choices**: Subtle tier difference between reading bento and drawing bento; 4-item bottom bar verticalized and flush aligned with the right edge of the drawing card; Father's chat bubble stacked above daily mission with Shin-chan mascot in the left column.

## 1. Overview & Core Concept

- **What It Changes**: Repositions layout elements into a clean asymmetrical grid where reading, gaming, and drawing bentos are elevated (reading bento slightly higher than drawing), the 4-item action bar becomes a vertical sidebar on the right aligned with the drawing card, the big mascot sits to the right of this vertical sidebar, and the left column houses Father's chat bubble and the daily mission / Shin-chan mascot.
- **Target Audience / Persona**: Children and parents using the interactive Cincau learning platform.

## 2. User Experience & Visual Design

- **Layout Grid & Structure**:
  - **Left Column**: Father's chat bubble (top) stacked above Daily Mission & Crayon Shin-chan child mascot (bottom), aligned with the grid side of the reading bento.
  - **Center/Main Bento Grid**: Reading bento (slightly higher vertical offset / staggered tier), Gaming bento, and Drawing bento.
  - **Right Sidebar / Bottom Bar**: The 4 bottom items converted into a vertical sidebar aligned flush with the right edge of the drawing card.
  - **Big Mascot**: Positioned to the right of the verticalized sidebar.
- **Visual Identity & Theme**: Playful, warm, child-friendly educational dashboard styling with Cincau branding.

## 3. Key Product Decisions & Trade-Offs

- **Decision**: CSS Grid / Flexbox restructuring for responsive desktop layout (1440px baseline).
  - *Why*: Ensures precise alignment between the vertical bar and drawing card edge, and cleanly separates left information panels from center learning bentos and right navigation/mascots.

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              TOP HEADER                                │
├──────────────────────────┬──────────────────────┬──────────┬───────────┤
│                          │                      │          │           │
│  LEFT COLUMN (Stack)     │  CENTER BENTO GRID   │ VERTICAL │    BIG    │
│  1. Father Chat Bubble   │  - Reading Bento (↑) │  BAR     │  MASCOT   │
│  2. Daily Mission &      │  - Gaming Bento      │ (Flush w/│ (Right of │
│     Shin-chan Mascot     │  - Drawing Bento     │  Drawing │  Sidebar) │
│                          │                      │  Right)  │           │
└──────────────────────────┴──────────────────────┴──────────┴───────────┘
```

- **Component Updates**: Modify `src/App.tsx` and related dashboard layout components to apply the requested positioning, verticalization, and spacing.
