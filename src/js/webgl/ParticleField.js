import * as THREE from 'three';

/**
 * Enhanced DNA Double-Helix Particle Field
 * Stronger mouse interaction, color shifts on hover, burst on click
 */
export class ParticleField {
    constructor(scene) {
        this.scene = scene;
        this.mouse = new THREE.Vector2(0, 0);
        this.mouseTarget = new THREE.Vector2(0, 0);
        this.particleCount = this.getParticleCount();
        this.helixRadius = 12;
        this.helixHeight = 120;
        this.helixTurns = 6;
        this.scrollY = 0;
        this.clickBurst = 0;
        this.mouseSpeed = 0;
        this.lastMouse = new THREE.Vector2(0, 0);

        this.initParticles();
        this.bindEvents();
    }

    getParticleCount() {
        const dpr = window.devicePixelRatio || 1;
        if (dpr > 2 || window.innerWidth < 768) return 1000;
        return 2000;
    }

    initParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const originalPositions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount * 3); // for burst

        const colorPrimary = new THREE.Color(0x2563eb);
        const colorAccent = new THREE.Color(0x059669);
        const colorLight = new THREE.Color(0x93c5fd);

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const t = (i / this.particleCount) * Math.PI * 2 * this.helixTurns;
            const y = ((i / this.particleCount) - 0.5) * this.helixHeight;

            if (i < this.particleCount * 0.35) {
                const x = Math.cos(t) * this.helixRadius + (Math.random() - 0.5) * 2;
                const z = Math.sin(t) * this.helixRadius + (Math.random() - 0.5) * 2;
                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = z;
            } else if (i < this.particleCount * 0.7) {
                const idx = i - Math.floor(this.particleCount * 0.35);
                const t2 = (idx / (this.particleCount * 0.35)) * Math.PI * 2 * this.helixTurns;
                const y2 = ((idx / (this.particleCount * 0.35)) - 0.5) * this.helixHeight;
                const x = Math.cos(t2 + Math.PI) * this.helixRadius + (Math.random() - 0.5) * 2;
                const z = Math.sin(t2 + Math.PI) * this.helixRadius + (Math.random() - 0.5) * 2;
                positions[i3] = x;
                positions[i3 + 1] = y2;
                positions[i3 + 2] = z;
            } else {
                positions[i3] = (Math.random() - 0.5) * 80;
                positions[i3 + 1] = (Math.random() - 0.5) * 80;
                positions[i3 + 2] = (Math.random() - 0.5) * 40;
            }

            originalPositions[i3] = positions[i3];
            originalPositions[i3 + 1] = positions[i3 + 1];
            originalPositions[i3 + 2] = positions[i3 + 2];

            // Random burst velocities (dormant until click)
            velocities[i3] = (Math.random() - 0.5) * 2;
            velocities[i3 + 1] = (Math.random() - 0.5) * 2;
            velocities[i3 + 2] = (Math.random() - 0.5) * 2;

            const mixFactor = Math.random();
            const color = new THREE.Color();
            if (mixFactor < 0.4) color.copy(colorPrimary);
            else if (mixFactor < 0.7) color.copy(colorAccent);
            else color.copy(colorLight);

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 3 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        this.originalPositions = originalPositions;
        this.velocities = velocities;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uMouseSpeed: { value: 0 },
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vAlpha;
                uniform float uTime;
                uniform float uPixelRatio;
                uniform float uMouseSpeed;

                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    float dist = length(mvPosition.xyz);
                    vAlpha = smoothstep(100.0, 15.0, dist) * (0.6 + uMouseSpeed * 0.4);
                    float sizeBoost = 1.0 + uMouseSpeed * 0.5;
                    gl_PointSize = size * uPixelRatio * (40.0 / -mvPosition.z) * sizeBoost;
                    gl_PointSize = max(gl_PointSize, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.mesh = new THREE.Points(geometry, material);
        this.geometry = geometry;
        this.material = material;
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });

        // Click burst
        window.addEventListener('click', () => {
            this.clickBurst = 1.0;
        });
    }

    update(elapsed) {
        // Mouse speed tracking
        const dx = this.mouseTarget.x - this.lastMouse.x;
        const dy = this.mouseTarget.y - this.lastMouse.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        this.mouseSpeed += (speed * 10 - this.mouseSpeed) * 0.1;
        this.mouseSpeed = Math.min(this.mouseSpeed, 1.0);
        this.lastMouse.copy(this.mouseTarget);

        // Smooth mouse follow
        this.mouse.x += (this.mouseTarget.x - this.mouse.x) * 0.08;
        this.mouse.y += (this.mouseTarget.y - this.mouse.y) * 0.08;

        // Rotate helix — speed influenced by mouse movement
        const rotSpeed = 0.08 + this.mouseSpeed * 0.15;
        this.mesh.rotation.y = elapsed * rotSpeed;
        this.mesh.rotation.x = Math.sin(elapsed * 0.05) * 0.15 + this.mouse.y * 0.1;

        // Tilt toward mouse
        this.mesh.rotation.z = this.mouse.x * 0.05;

        // Scroll-based offset
        const scrollOffset = this.scrollY * 0.02;
        this.mesh.position.y = -scrollOffset;

        // Mouse-reactive displacement — STRONGER
        const positions = this.geometry.attributes.position.array;
        const mouseX = this.mouse.x * 40;
        const mouseY = this.mouse.y * 40;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const ox = this.originalPositions[i3];
            const oy = this.originalPositions[i3 + 1];
            const oz = this.originalPositions[i3 + 2];

            const distX = ox - mouseX;
            const distY = oy - mouseY;
            const dist = Math.sqrt(distX * distX + distY * distY);
            const maxDist = 30;

            // Click burst effect
            if (this.clickBurst > 0.01) {
                positions[i3] += this.velocities[i3] * this.clickBurst * 3;
                positions[i3 + 1] += this.velocities[i3 + 1] * this.clickBurst * 3;
                positions[i3 + 2] += this.velocities[i3 + 2] * this.clickBurst * 3;
            }

            if (dist < maxDist) {
                const force = (1 - dist / maxDist) * (8 + this.mouseSpeed * 12);
                const angle = Math.atan2(distY, distX);
                positions[i3] = ox + Math.cos(angle) * force;
                positions[i3 + 1] = oy + Math.sin(angle) * force;
                positions[i3 + 2] = oz + Math.sin(angle + elapsed) * force * 0.3;
            } else {
                // Organic floating
                positions[i3] = ox + Math.sin(elapsed * 0.8 + i * 0.01) * 0.5;
                positions[i3 + 1] = oy + Math.cos(elapsed * 0.6 + i * 0.01) * 0.5;
                positions[i3 + 2] = oz + Math.sin(elapsed * 0.4 + i * 0.02) * 0.3;
            }
        }

        // Decay click burst
        this.clickBurst *= 0.92;

        this.geometry.attributes.position.needsUpdate = true;
        this.material.uniforms.uTime.value = elapsed;
        this.material.uniforms.uMouseSpeed.value = this.mouseSpeed;

        // Decay mouse speed
        this.mouseSpeed *= 0.95;
    }
}
