import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { Scene } from './js/webgl/Scene.js';
import { ParticleField } from './js/webgl/ParticleField.js';
import { initScrollAnimations } from './js/animations/ScrollAnimations.js';
import { CursorEffects } from './js/animations/CursorEffects.js';
import { InteractiveEffects } from './js/interactions/InteractiveEffects.js';
import { EEGWaveform } from './js/components/EEGWaveform.js';
import { VoiceAnalyzer } from './js/components/VoiceAnalyzer.js';
import { HexDataStream } from './js/components/HexDataStream.js';
import { initCaseFiles } from './js/components/CaseFiles.js';
import { initExperienceInteractions } from './js/components/ExperienceInteractions.js';

/**
 * Main Entry Point
 * Initialize all portfolio systems
 */

// --- Loading Screen ---
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');

const loadingSteps = [
    { progress: 15, text: 'Securing perimeter...' },
    { progress: 30, text: 'Loading evidence database...' },
    { progress: 50, text: 'Initializing analysis engine...' },
    { progress: 70, text: 'Calibrating sensors...' },
    { progress: 85, text: 'Reconstructing timeline...' },
    { progress: 100, text: 'Case file ready.' },
];

async function simulateLoading() {
    for (const step of loadingSteps) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (loaderBar) loaderBar.style.width = step.progress + '%';
        if (loaderText) loaderText.textContent = step.text;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (loader) loader.classList.add('is-hidden');
}

// --- Init All Systems ---
async function init() {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Synchronize Lenis with ScrollTrigger
    lenis.on('scroll', () => {
        ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Start and wait for loading animation
    await simulateLoading();

    // Initialize Three.js scene
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
        const scene = new Scene(canvas);
        const particles = new ParticleField(scene);
        scene.add(particles);
        scene.startLoop();
    }

    // Initialize GSAP scroll animations
    initScrollAnimations();

    // Final refresh once everything is hidden and loaded
    ScrollTrigger.refresh();
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // Initialize custom cursor
    new CursorEffects();

    // Initialize Active Theory-style interactive effects
    new InteractiveEffects();

    // Initialize EEG waveform
    new EEGWaveform('eeg-canvas');

    // Initialize Voice analyzer for Case 001
    new VoiceAnalyzer('voice-canvas');

    // Initialize Hex stream for Case 002
    new HexDataStream('hex-canvas');

    // Initialize case file interactions
    initCaseFiles();

    // Initialize internship card interactions
    initExperienceInteractions();

    // Initialize interactive pipeline tabs
    const pipelineTabs = document.querySelectorAll('.pipeline__tab');
    const pipelinePanels = document.querySelectorAll('.pipeline__panel');
    pipelineTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const step = tab.dataset.step;
            pipelineTabs.forEach((t) => t.classList.remove('is-active'));
            pipelinePanels.forEach((p) => p.classList.remove('is-active'));
            tab.classList.add('is-active');
            const panel = document.querySelector(`.pipeline__panel[data-panel="${step}"]`);
            if (panel) panel.classList.add('is-active');
        });
    });

    // Smooth scroll for anchor links using Lenis
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            if (target) {
                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
            }
        });
    });
}

// Run
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
