/**
 * Text animation effects: typing, scramble
 */

/**
 * Typing animation for a target element
 */
export function typeText(element, text, speed = 50) {
    return new Promise((resolve) => {
        let i = 0;
        element.textContent = '';
        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

/**
 * Scramble text effect — cycles through random characters before revealing
 */
export function scrambleText(element, finalText, duration = 1000) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const frames = Math.floor(duration / 30);
    let frame = 0;

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const progress = frame / frames;
            let result = '';

            for (let i = 0; i < finalText.length; i++) {
                if (finalText[i] === ' ') {
                    result += ' ';
                } else if (i < finalText.length * progress) {
                    result += finalText[i];
                } else {
                    result += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            element.textContent = result;
            frame++;

            if (frame > frames) {
                element.textContent = finalText;
                clearInterval(interval);
                resolve();
            }
        }, 30);
    });
}
