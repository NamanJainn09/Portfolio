/**
 * EEG Waveform Canvas Animation
 * Draws a simulated EEG waveform for the NeuroCognitive case
 */
export class EEGWaveform {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.isVisible = false;
        this.offset = 0;

        this.resize();
        this.observe();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * Math.min(window.devicePixelRatio, 2);
        this.canvas.height = rect.height * Math.min(window.devicePixelRatio, 2);
        this.ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
        this.width = rect.width;
        this.height = rect.height;
    }

    observe() {
        if (!this.canvas) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    this.isVisible = entry.isIntersecting;
                    if (this.isVisible) this.animate();
                });
            },
            { threshold: 0.2 }
        );
        observer.observe(this.canvas);
    }

    drawWave(yOffset, amplitude, frequency, color, lineWidth = 1.5) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineJoin = 'round';

        for (let x = 0; x < this.width; x++) {
            const noise = Math.random() * amplitude * 0.15;
            const y =
                yOffset +
                Math.sin((x + this.offset) * frequency * 0.01) * amplitude +
                Math.sin((x + this.offset) * frequency * 0.023) * amplitude * 0.5 +
                noise;

            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }

    animate() {
        if (!this.isVisible || !this.ctx) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw multiple EEG channels
        const channels = [
            { y: this.height * 0.2, amp: 10, freq: 8, color: 'rgba(37, 99, 235, 0.7)' },
            { y: this.height * 0.4, amp: 14, freq: 12, color: 'rgba(5, 150, 105, 0.6)' },
            { y: this.height * 0.6, amp: 8, freq: 20, color: 'rgba(37, 99, 235, 0.5)' },
            { y: this.height * 0.8, amp: 12, freq: 6, color: 'rgba(5, 150, 105, 0.4)' },
        ];

        channels.forEach((ch) => {
            this.drawWave(ch.y, ch.amp, ch.freq, ch.color);
        });

        this.offset += 1.5;
        requestAnimationFrame(() => this.animate());
    }
}
