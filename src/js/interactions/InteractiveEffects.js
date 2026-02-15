import gsap from 'gsap';

/**
 * Active Theory-inspired Interactive Effects
 * Mouse parallax, magnetic elements, 3D tilt cards, text scramble, scroll velocity
 */

export class InteractiveEffects {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.smoothMouse = { x: 0, y: 0 };
        this.scrollVelocity = 0;
        this.lastScrollY = 0;
        this.rafId = null;

        this.initMouseTracking();
        this.initParallaxLayers();
        this.initMagneticElements();
        this.initTiltCards();
        this.initHoverRevealCards();
        this.initSectionTransitions();
        this.initDragScroll();
        this.animate();
    }

    // ─── GLOBAL MOUSE TRACKING ──────────────────────
    initMouseTracking() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        });
    }

    // ─── MOUSE PARALLAX ON LAYERS ──────────────────────
    initParallaxLayers() {
        // Add data-speed attributes to elements for parallax
        const layers = [
            { sel: '.hero__blob--1', speed: 0.04 },
            { sel: '.hero__blob--2', speed: 0.06 },
            { sel: '.hero__blob--3', speed: 0.03 },
            { sel: '.floating-marker--1', speed: 0.025 },
            { sel: '.floating-marker--2', speed: 0.035 },
            { sel: '.floating-marker--3', speed: 0.045 },
            { sel: '.floating-marker--4', speed: 0.03 },
            { sel: '.hero__orbit', speed: 0.015 },
            { sel: '.hero__name', speed: 0.008 },
            { sel: '.hero__tagline', speed: 0.012 },
        ];

        this.parallaxLayers = layers
            .map((l) => {
                const el = document.querySelector(l.sel);
                return el ? { el, speed: l.speed } : null;
            })
            .filter(Boolean);
    }

    updateParallax() {
        for (const layer of this.parallaxLayers) {
            const x = this.smoothMouse.x * layer.speed * 100;
            const y = this.smoothMouse.y * layer.speed * 100;
            layer.el.style.transform = `translate(${x}px, ${y}px)`;
        }
    }

    // ─── MAGNETIC ELEMENTS ──────────────────────
    initMagneticElements() {
        this.magneticElements = [];
        const selectors = '.case__toggle, .hero__badge, .contact__link, .hero__stat, .credential__card';

        document.querySelectorAll(selectors).forEach((el) => {
            const magnetic = {
                el,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                centerX: 0,
                centerY: 0,
                isHovering: false,
                strength: el.classList.contains('contact__link') ? 0.4 : 0.3,
            };

            el.style.transition = 'none';
            el.style.willChange = 'transform';

            el.addEventListener('mouseenter', (e) => {
                magnetic.isHovering = true;
                const rect = el.getBoundingClientRect();
                magnetic.width = rect.width;
                magnetic.height = rect.height;
                magnetic.centerX = rect.left + rect.width / 2;
                magnetic.centerY = rect.top + rect.height / 2;
            });

            el.addEventListener('mousemove', (e) => {
                if (!magnetic.isHovering) return;
                const dx = e.clientX - magnetic.centerX;
                const dy = e.clientY - magnetic.centerY;
                magnetic.x = dx * magnetic.strength;
                magnetic.y = dy * magnetic.strength;
            });

            el.addEventListener('mouseleave', () => {
                magnetic.isHovering = false;
                magnetic.x = 0;
                magnetic.y = 0;
            });

            this.magneticElements.push(magnetic);
        });
    }

    updateMagnetic() {
        for (const m of this.magneticElements) {
            const currentTransform = m.el.style.transform || '';
            // Smooth lerp toward target
            const lerpX = parseFloat(m.el.dataset._mx || 0);
            const lerpY = parseFloat(m.el.dataset._my || 0);
            const newX = lerpX + (m.x - lerpX) * 0.15;
            const newY = lerpY + (m.y - lerpY) * 0.15;
            m.el.dataset._mx = newX;
            m.el.dataset._my = newY;
            m.el.style.transform = `translate(${newX}px, ${newY}px)`;
        }
    }

    // ─── 3D TILT CARDS ──────────────────────
    initTiltCards() {
        this.tiltCards = [];
        const cards = document.querySelectorAll('.evidence__card, .capability__card');

        cards.forEach((card) => {
            const tilt = {
                el: card,
                rotateX: 0,
                rotateY: 0,
                isHovering: false,
            };

            card.style.transformStyle = 'preserve-3d';
            card.style.willChange = 'transform';

            card.addEventListener('mouseenter', () => {
                tilt.isHovering = true;
            });

            card.addEventListener('mousemove', (e) => {
                if (!tilt.isHovering) return;
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                tilt.rotateY = (x - 0.5) * 20; // ±10 degrees
                tilt.rotateX = (y - 0.5) * -20;
            });

            card.addEventListener('mouseleave', () => {
                tilt.isHovering = false;
                tilt.rotateX = 0;
                tilt.rotateY = 0;
            });

            this.tiltCards.push(tilt);
        });
    }

    updateTilt() {
        for (const t of this.tiltCards) {
            const currentRX = parseFloat(t.el.dataset._rx || 0);
            const currentRY = parseFloat(t.el.dataset._ry || 0);
            const newRX = currentRX + (t.rotateX - currentRX) * 0.1;
            const newRY = currentRY + (t.rotateY - currentRY) * 0.1;
            t.el.dataset._rx = newRX;
            t.el.dataset._ry = newRY;

            const glare = t.isHovering ? 1 : 0;
            t.el.style.transform = `perspective(800px) rotateX(${newRX}deg) rotateY(${newRY}deg) scale(${t.isHovering ? 1.02 : 1})`;
        }
    }



    // ─── HOVER REVEAL CARDS (glare effect) ──────────────────────
    initHoverRevealCards() {
        const cards = document.querySelectorAll('.evidence__card, .credential__card');

        cards.forEach((card) => {
            // Create glare overlay
            const glare = document.createElement('div');
            glare.classList.add('card-glare');
            glare.style.cssText = `
                position: absolute;
                inset: 0;
                border-radius: inherit;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 2;
                background: radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%),
                    rgba(37, 99, 235, 0.12) 0%,
                    transparent 60%);
            `;
            card.style.position = 'relative';
            card.appendChild(glare);

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                glare.style.setProperty('--glare-x', x + '%');
                glare.style.setProperty('--glare-y', y + '%');
                glare.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                glare.style.opacity = '0';
            });
        });
    }

    // ─── SECTION TRANSITION GRADIENT ──────────────────────
    initSectionTransitions() {
        const sections = document.querySelectorAll('.section');

        // Create a gradient overlay that morphs between section colors
        this.sectionColors = [
            { r: 248, g: 249, b: 250 }, // hero - light
            { r: 240, g: 242, b: 248 }, // profile - slight blue
            { r: 248, g: 249, b: 250 }, // evidence
            { r: 237, g: 242, b: 253 }, // analysis - blue tint
            { r: 248, g: 249, b: 250 }, // cases
            { r: 255, g: 255, b: 255 }, // findings - white
            { r: 248, g: 249, b: 250 }, // credentials
            { r: 240, g: 244, b: 250 }, // contact
        ];

        // Subtle background morph on scroll
        window.addEventListener('scroll', () => {
            const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const idx = Math.min(Math.floor(scrollProgress * this.sectionColors.length), this.sectionColors.length - 2);
            const t = (scrollProgress * this.sectionColors.length) - idx;
            const c1 = this.sectionColors[idx];
            const c2 = this.sectionColors[idx + 1];
            const r = Math.round(c1.r + (c2.r - c1.r) * t);
            const g = Math.round(c1.g + (c2.g - c1.g) * t);
            const b = Math.round(c1.b + (c2.b - c1.b) * t);
            document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        });
    }

    // ─── DRAG SCROLL FOR HORIZONTAL TRACK ──────────────────────
    initDragScroll() {
        const track = document.querySelector('.evidence__scroll-track');
        if (!track) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => { isDown = false; });
        track.addEventListener('mouseup', () => { isDown = false; });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            track.scrollLeft = scrollLeft - walk;
        });
    }

    // ─── ANIMATION LOOP ──────────────────────
    animate() {
        // Smooth mouse
        this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * 0.08;
        this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * 0.08;

        this.updateParallax();
        this.updateMagnetic();
        this.updateTilt();

        this.rafId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        cancelAnimationFrame(this.rafId);
    }
}
