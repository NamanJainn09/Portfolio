# Naman Jain · Forensic Intelligence Portfolio

An immersive, "Active Theory" inspired portfolio showcasing Naman Jain's expertise in Forensic Science, AI Systems, and Cognitive Analysis. The project utilizes modern web technologies to create a cinematic, investigative experience.

## Project Overview

- **Purpose:** Professional portfolio for Naman Jain, highlighting Forensic Science background (NFSU, UGC NET) and AI systems engineering.
- **Theme:** Forensic Investigation / Case File.
- **Key Technologies:**
    - **Build Tool:** [Vite](https://vitejs.dev/)
    - **3D Engine:** [Three.js](https://threejs.org/) (Particle fields, WebGL scene)
    - **Animation:** [GSAP](https://gsap.com/) with ScrollTrigger (Reveal animations, timelines)
    - **UI/UX:** Custom CSS, interactive Lab Pipeline, EEG Waveform simulations.

## Project Structure

```text
D:\Projects\Portfolio\
├── index.html            # Main entry point and UI structure
├── package.json          # Project dependencies and scripts
├── vite.config.js        # Vite configuration
├── src/
│   ├── main.js           # Main JS entry point; orchestrates initialization
│   ├── js/
│   │   ├── webgl/        # Three.js scene, camera, and particle systems
│   │   ├── animations/   # GSAP scroll and UI animations
│   │   ├── components/   # Feature-specific logic (EEG, Case Files)
│   │   └── interactions/ # General interactive UI effects
│   └── styles/
│       └── index.css     # Centralized styles and theme variables
```

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Commands
- **Start Development Server:**
  ```bash
  npm run dev
  ```
  Runs the project at `http://localhost:3000` (configured in `vite.config.js`).

- **Build for Production:**
  ```bash
  npm run build
  ```
  Generates optimized assets in the `dist/` directory.

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

## Development Conventions

- **Modular JS:** All logic is organized into ES Modules under `src/js/`.
- **System Orchestration:** `src/main.js` handles the sequential loading and initialization of all subsystems (Loading screen -> WebGL -> Animations -> Components).
- **Styling:** Follows a BEM-like naming convention (e.g., `.hero__badge`, `.case__card`).
- **Performance:** 
    - WebGL rendering is limited to a canvas (`#webgl-canvas`).
    - Intersection Observers are used for heavy animations (e.g., `EEGWaveform.js`) to ensure they only run when visible.
    - Pixel ratio is capped at 2 for performance on high-DPI screens.

## Key Subsystems

1.  **Scene Manager (`Scene.js`):** Manages the Three.js lifecycle, including resizing and the render loop.
2.  **Scroll Animations (`ScrollAnimations.js`):** Uses GSAP ScrollTrigger to reveal content as the user explores the "investigation."
3.  **Lab Pipeline:** An interactive section in `index.html` (Section 04) that demonstrates forensic processes using terminal-like demos.
4.  **Case Files:** A bento-style grid of projects with detailed expand/collapse logic (`CaseFiles.js`).
