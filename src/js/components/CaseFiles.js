/**
 * Case file card expand/collapse interactions
 */
export function initCaseFiles() {
    const caseCards = document.querySelectorAll('.case__card');

    caseCards.forEach((card) => {
        const toggle = card.querySelector('.case__toggle');
        if (!toggle) return;

        toggle.addEventListener('click', () => {
            const isOpen = card.classList.contains('is-open');

            // Close all other cards
            caseCards.forEach((c) => c.classList.remove('is-open'));

            if (!isOpen) {
                card.classList.add('is-open');
                toggle.textContent = 'Hide Details ↑';
            } else {
                toggle.textContent = 'View Case Details →';
            }
        });
    });
}
