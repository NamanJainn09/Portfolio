import gsap from 'gsap';

/**
 * Internship card morphing interactions using GSAP
 */
export function initExperienceInteractions() {
    const expCards = document.querySelectorAll('.experience__card');
    const overlay = document.getElementById('experience-overlay');
    let activeCard = null;

    const closeAll = () => {
        if (!activeCard) return;

        const details = activeCard.querySelector('.experience__card-details');
        const summary = activeCard.querySelector('.experience__card-summary');
        const state = activeCard.getBoundingClientRect();

        // Animate back to card position
        gsap.to(details, {
            top: state.top + state.height / 2,
            left: state.left + state.width / 2,
            width: state.width,
            height: state.height,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.inOut',
            onComplete: () => {
                details.style.visibility = 'hidden';
                details.style.pointerEvents = 'none';
                activeCard.classList.remove('is-expanded');
                activeCard = null;
            }
        });

        gsap.to(overlay, { opacity: 0, visibility: 'hidden', duration: 0.4 });
        document.body.classList.remove('has-modal');
    };

    expCards.forEach((card) => {
        const summary = card.querySelector('.experience__card-summary');
        const details = card.querySelector('.experience__card-details');
        const closeBtn = card.querySelector('.experience__close-btn');

        summary.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeCard) closeAll();

            activeCard = card;
            const startRect = card.getBoundingClientRect();
            
            // 1. Prepare details box at card's position
            gsap.set(details, {
                top: startRect.top + startRect.height / 2,
                left: startRect.left + startRect.width / 2,
                width: startRect.width,
                height: startRect.height,
                opacity: 0,
                visibility: 'visible',
                pointerEvents: 'auto'
            });

            // 2. Morph to center
            card.classList.add('is-expanded');
            document.body.classList.add('has-modal');

            gsap.to(details, {
                top: '50%',
                left: '50%',
                width: 'min(90%, 650px)',
                height: 'auto',
                opacity: 1,
                duration: 0.6,
                ease: 'expo.out'
            });

            gsap.to(overlay, { opacity: 1, visibility: 'visible', duration: 0.4 });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAll();
            });
        }
    });

    overlay?.addEventListener('click', closeAll);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
}
