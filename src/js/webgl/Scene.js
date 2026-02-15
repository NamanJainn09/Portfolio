import * as THREE from 'three';

/**
 * Three.js Scene Manager
 * Handles scene setup, camera, renderer, and render loop
 */
export class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.clock = new THREE.Clock();
        this.objects = [];

        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.bindEvents();
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 50;
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }

    bindEvents() {
        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    add(object) {
        this.objects.push(object);
        if (object.mesh) {
            this.scene.add(object.mesh);
        } else if (object.group) {
            this.scene.add(object.group);
        }
    }

    update() {
        const elapsed = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        for (const obj of this.objects) {
            if (obj.update) obj.update(elapsed, delta);
        }

        this.renderer.render(this.scene, this.camera);
    }

    startLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.update();
        };
        animate();
    }
}
