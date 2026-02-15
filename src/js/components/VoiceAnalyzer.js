/**
 * Voice Analyzer Canvas Animation
 * Draws a simulated frequency spectrum for the Nari Rakshak case
 */
export class VoiceAnalyzer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.isVisible = false;
        this.bars = 40;
        this.barData = new Array(this.bars).fill(0);

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

    animate() {
        if (!this.isVisible || !this.ctx) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        const barWidth = this.width / this.bars;
        const padding = 2;

        for (let i = 0; i < this.bars; i++) {
            // Target height based on sine waves and noise
            const target = Math.sin(Date.now() * 0.002 + i * 0.2) * 20 + 
                           Math.sin(Date.now() * 0.005 + i * 0.5) * 10 + 40;
            
            // Smoothly interpolate current bar height
            this.barData[i] += (target - this.barData[i]) * 0.1;

            const h = this.barData[i];
            const x = i * barWidth + padding;
            const y = (this.height - h) / 2;

            // Draw bar
            const gradient = this.ctx.createLinearGradient(0, y, 0, y + h);
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.8)');
            gradient.addColorStop(1, 'rgba(5, 150, 105, 0.8)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            if (this.ctx.roundRect) {
                this.ctx.roundRect(x, y, barWidth - padding * 2, h, 2);
            } else {
                this.ctx.rect(x, y, barWidth - padding * 2, h);
            }
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}
