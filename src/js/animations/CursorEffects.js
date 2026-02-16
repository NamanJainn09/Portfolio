import gsap from 'gsap';

/**
 * Advanced Cursor Effects — Active Theory inspired
 * Morphing cursor shape, click ripple, magnetic pull, trail particles
 */
export class CursorEffects {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.dot = this.cursor?.querySelector('.cursor__dot');
        this.ring = this.cursor?.querySelector('.cursor__ring');

        if (!this.cursor) return;

        this.pos = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.isVisible = false;

        // Trail particles
        this.trail = [];
        this.trailLength = 8;
        this.initTrail();

        this.bindEvents();
        
        // Use GSAP Ticker for better performance and synchronization
        gsap.ticker.add(() => this.update());
    }

    initTrail() {
        for (let i = 0; i < this.trailLength; i++) {
            const dot = document.createElement('div');
            dot.classList.add('cursor__trail-dot');
            dot.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: ${4 - i * 0.4}px;
                height: ${4 - i * 0.4}px;
                background: var(--color-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${0.5 - i * 0.06};
                mix-blend-mode: difference;
                transition: none;
            `;
            document.body.appendChild(dot);
            this.trail.push({ el: dot, x: 0, y: 0 });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.target.x = e.clientX;
            this.target.y = e.clientY;

            if (!this.isVisible) {
                this.isVisible = true;
                this.cursor.style.opacity = '1';
                this.pos.x = e.clientX;
                this.pos.y = e.clientY;
                this.trail.forEach((t) => {
                    t.x = e.clientX;
                    t.y = e.clientY;
                });
            }
        });

        document.addEventListener('mouseleave', () => {
            this.isVisible = false;
            this.cursor.style.opacity = '0';
            this.trail.forEach((t) => (t.el.style.opacity = '0'));
        });

        document.addEventListener('mouseenter', () => {
            this.trail.forEach((t, i) => (t.el.style.opacity = `${0.5 - i * 0.06}`));
        });

        // Click ripple
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });

        // Hover effects for interactive elements
        const hoverTargets = document.querySelectorAll(
            'a, button, .case__card, .evidence__card, .credential__card, .pipeline__node, .contact__link, .hero__stat'
        );

        hoverTargets.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('is-hovering');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('is-hovering');
            });
        });
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            width: 0;
            height: 0;
            border: 2px solid var(--color-primary);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9998;
            opacity: 0.6;
        `;
        document.body.appendChild(ripple);

        // Animate ripple outwards
        ripple.animate(
            [
                { width: '0px', height: '0px', opacity: 0.6 },
                { width: '80px', height: '80px', opacity: 0 },
            ],
            { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        ).onfinish = () => ripple.remove();
    }

    update() {
        // Smooth interpolation — higher = snappier
        // Boosted to 0.35 for maximum responsiveness
        this.pos.x += (this.target.x - this.pos.x) * 0.35;
        this.pos.y += (this.target.y - this.pos.y) * 0.35;

        if (this.cursor) {
            this.cursor.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
        }

        // Update trail — each dot follows the previous one
        let prevX = this.pos.x;
        let prevY = this.pos.y;
        for (const trailDot of this.trail) {
            trailDot.x += (prevX - trailDot.x) * 0.6;
            trailDot.y += (prevY - trailDot.y) * 0.6;
            trailDot.el.style.transform = `translate(${trailDot.x}px, ${trailDot.y}px) translate(-50%, -50%)`;
            prevX = trailDot.x;
            prevY = trailDot.y;
        }
    }
}
