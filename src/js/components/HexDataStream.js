/**
 * Hex Data Stream Canvas Animation
 * Draws a scrolling matrix of hex codes for the Hex Repair case
 */
export class HexDataStream {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.isVisible = false;
        this.fontSize = 12;
        this.rows = [];
        this.maxRows = 12;
        this.lastUpdate = 0;
        this.chars = "0123456789ABCDEF";

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
        this.ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;
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

    generateRow() {
        let row = "";
        for (let i = 0; i < 8; i++) {
            const h1 = this.chars[Math.floor(Math.random() * 16)];
            const h2 = this.chars[Math.floor(Math.random() * 16)];
            row += h1 + h2 + " ";
        }
        return {
            text: row,
            opacity: 1,
            isCritical: Math.random() > 0.9
        };
    }

    animate(time) {
        if (!this.isVisible || !this.ctx) return;

        // Slow down update rate
        if (time - this.lastUpdate > 100) {
            this.rows.unshift(this.generateRow());
            if (this.rows.length > this.maxRows) this.rows.pop();
            this.lastUpdate = time;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.rows.forEach((row, i) => {
            const y = (i + 1) * (this.fontSize + 8);
            const opacity = 1 - (i / this.maxRows);
            
            if (row.isCritical) {
                this.ctx.fillStyle = `rgba(220, 38, 38, ${opacity})`;
            } else {
                this.ctx.fillStyle = `rgba(37, 99, 235, ${opacity * 0.6})`;
            }
            
            this.ctx.fillText(row.text, 10, y);
            
            if (row.isCritical && i === 0) {
                this.ctx.fillStyle = `rgba(5, 150, 105, ${opacity})`;
                this.ctx.fillText("REPAIRING...", 160, y);
            }
        });

        requestAnimationFrame((t) => this.animate(t));
    }
}
