import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP ScrollTrigger-based section animations
 */
export function initScrollAnimations() {
    // --- Hero section ---
    const heroTl = gsap.timeline({ delay: 0.5 });

    heroTl
        .to('.hero__badge', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
        })
        .to('.hero__name-line', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power4.out',
        }, '-=0.3')
        .to('.hero__tagline', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
        }, '-=0.4')
        .to('.hero__subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
        }, '-=0.3')
        .to('.hero__stats', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            onStart: () => animateCounters(),
        }, '-=0.2')
        .to('.hero__scroll-indicator', {
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
        }, '-=0.2')
        .to('.floating-marker', {
            opacity: 0.6,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
        }, '-=0.4');

    // --- Section headers ---
    gsap.utils.toArray('.section__title').forEach((title) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        });
    });

    gsap.utils.toArray('.section__number').forEach((num) => {
        gsap.from(num, {
            scrollTrigger: {
                trigger: num,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            x: -20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
        });
    });

    // --- Profile section ---
    gsap.from('.profile__lead', {
        scrollTrigger: {
            trigger: '.profile__lead',
            start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
    });

    gsap.from('.profile__bio p:not(.profile__lead)', {
        scrollTrigger: {
            trigger: '.profile__bio',
            start: 'top 75%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
    });

    gsap.from('.profile__philosophy', {
        scrollTrigger: {
            trigger: '.profile__philosophy',
            start: 'top 80%',
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
    });

    gsap.from('.timeline__item', {
        scrollTrigger: {
            trigger: '.profile__timeline',
            start: 'top 95%',
            toggleActions: 'play none none none',
        },
        x: 30,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
    });

    gsap.from('.profile__domain-block', {
        scrollTrigger: {
            trigger: '.profile__domain-block',
            start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
    });

    // --- Evidence cards ---
    gsap.from('.evidence__card', {
        scrollTrigger: {
            trigger: '.evidence__scroll-track',
            start: 'top 90%',
            toggleActions: 'play none none none',
        },
        x: 60,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
    });

    // --- Interactive Pipeline ---
    gsap.from('.pipeline__tab', {
        scrollTrigger: {
            trigger: '.pipeline-interactive',
            start: 'top 85%',
        },
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
    });

    // --- Case Files ---
    gsap.from('.case__card', {
        scrollTrigger: {
            trigger: '.cases__grid',
            start: 'top 90%',
            toggleActions: 'play none none none',
        },
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
    });

    // --- Field Operations (Experience) ---
    gsap.from('.experience__item', {
        scrollTrigger: {
            trigger: '.experience__grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
    });

    // --- Credentials ---
    gsap.from('.credential__card', {
        scrollTrigger: {
            trigger: '.credentials__grid',
            start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
    });

    // --- Contact ---
    gsap.from('.contact__prompt', {
        scrollTrigger: {
            trigger: '.section--contact',
            start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
    });

    gsap.from('.contact__description', {
        scrollTrigger: {
            trigger: '.section--contact',
            start: 'top 80%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
    });

    gsap.from('.contact__link', {
        scrollTrigger: {
            trigger: '.contact__links',
            start: 'top 95%',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power3.out',
    });

    gsap.from('.contact__footer', {
        scrollTrigger: {
            trigger: '.contact__footer',
            start: 'top 90%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
    });
}

/**
 * Animate stat counter numbers from 0 to target
 */
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach((el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}
