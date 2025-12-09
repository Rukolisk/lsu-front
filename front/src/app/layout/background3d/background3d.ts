import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

@Component({
  selector: 'app-background-3d',
  imports: [],
  standalone: true,
  templateUrl: './background3d.html',
  styleUrls: ['./background3d.css'],
})
export class Background3d implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId: number | null = null;

  private model: THREE.Object3D | null = null;

  ngOnInit(): void {
    this.init3D();
    this.loadGLB();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }

  private init3D() {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.5,
      1000
    );
    this.camera.position.set(0, 2, 1);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    this.scene.add(light);

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private loadGLB() {
    const loader = new GLTFLoader();
    loader.load('/scene/scene2.glb', (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
      this.camera.lookAt(this.model.position);
    });
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.model) {
      this.model.rotation.y += 0.003;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private onResize() {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
