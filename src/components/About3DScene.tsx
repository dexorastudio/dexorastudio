import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AGENCY_CONFIG } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';

function detectSoftwareWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl =
      probeCanvas.getContext('webgl2') ||
      (probeCanvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) return { supported: false, isSoftwareGl: false };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return {
      supported: true,
      isSoftwareGl:
        /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu),
    };
  } catch {
    return { supported: false, isSoftwareGl: false };
  }
}

export const About3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const resumeRenderRef = useRef<(() => void) | null>(null);
  const [fallbackActive, setFallbackActive] = useState(false);

  useEffect(() => {
    resumeRenderRef.current?.();
  }, [reducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    const { supported, isSoftwareGl } = detectSoftwareWebGL();
    if (!supported) {
      setFallbackActive(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallbackActive(true);
      return;
    }

    const isMobile = window.innerWidth < 768;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    );
    renderer.setClearColor(0x000000, 0);

    const w = Math.max(container.clientWidth, 1);
    const h = Math.max(container.clientHeight, 1);
    renderer.setSize(w, h);
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 40);
    camera.position.set(0, 0, 5.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0xd4d4d8, 0x050505, 0.72);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffe6ba, 2.1);
    key.position.set(3, 4, 4);
    scene.add(key);

    const rim = new THREE.PointLight(0xc9a96e, 3.4, 12);
    rim.position.set(-3, -2, -2);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x121215,
      metalness: 0.86,
      roughness: 0.24,
      clearcoat: 0.72,
      envMapIntensity: 1.25,
    });

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a96e,
      metalness: 0.94,
      roughness: 0.18,
      clearcoat: 0.65,
      envMapIntensity: 1.45,
    });

    const platinumMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8d8df,
      metalness: 0.95,
      roughness: 0.14,
      envMapIntensity: 1.45,
    });

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), obsidianMat);
    group.add(core);

    const innerFacet = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.97, 0),
      new THREE.MeshBasicMaterial({
        color: 0xc9a96e,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      })
    );
    group.add(innerFacet);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.025, 16, isMobile ? 64 : 100),
      goldMat
    );
    outerRing.rotation.set(Math.PI * 0.3, Math.PI * 0.2, 0);
    group.add(outerRing);

    const midRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.018, 16, isMobile ? 64 : 100),
      platinumMat
    );
    midRing.rotation.set(-Math.PI * 0.28, Math.PI * 0.4, 0.2);
    group.add(midRing);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let isVisible = false;
    let isTabHidden = document.hidden;
    let contextLost = false;
    let disposed = false;
    let frameId = 0;
    let elapsed = 0;
    let pointerX = 0;
    let pointerY = 0;
    const clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (isVisible && !isTabHidden && !contextLost && !reducedMotionRef.current) {
          clock.getDelta();
          scheduleNext();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerX = THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      pointerY = THREE.MathUtils.clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    };

    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
    };

    const onResize = () => {
      const nw = Math.max(container.clientWidth, 1);
      const nh = Math.max(container.clientHeight, 1);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    const onVisibility = () => {
      isTabHidden = document.hidden;
      if (!isTabHidden && isVisible && !contextLost && !reducedMotionRef.current) {
        clock.getDelta();
        scheduleNext();
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      setFallbackActive(true);
    };

    const onContextRestored = () => {
      contextLost = false;
      setFallbackActive(false);
      clock.getDelta();
      scheduleNext();
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function scheduleNext() {
      if (
        disposed ||
        !isVisible ||
        isTabHidden ||
        contextLost ||
        reducedMotionRef.current
      ) {
        return;
      }
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    function tick() {
      if (disposed || !isVisible || isTabHidden || contextLost) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      if (!reducedMotionRef.current) {
        elapsed += delta;
        core.rotation.y += delta * 0.25;
        core.rotation.x += delta * 0.12;
        innerFacet.rotation.copy(core.rotation);
        outerRing.rotation.z += delta * 0.2;
        midRing.rotation.z -= delta * 0.28;
        group.position.y = Math.sin(elapsed * 1.1) * 0.08;
        group.rotation.y = THREE.MathUtils.damp(group.rotation.y, pointerX * 0.28, 4, delta);
        group.rotation.x = THREE.MathUtils.damp(group.rotation.x, -pointerY * 0.2, 4, delta);
      }
      renderer.render(scene, camera);
      if (!reducedMotionRef.current) scheduleNext();
    }

    resumeRenderRef.current = () => {
      if (disposed || contextLost) return;
      if (reducedMotionRef.current) {
        renderer.render(scene, camera);
      } else if (isVisible && !isTabHidden) {
        clock.getDelta();
        scheduleNext();
      }
    };

    renderer.render(scene, camera);

    return () => {
      disposed = true;
      resumeRenderRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      observer.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280px] sm:h-[360px] lg:h-[440px] select-none touch-pan-y"
      aria-label="3D metallic architectural geometry"
    >
      <div
        ref={mountRef}
        className={`w-full h-full ${fallbackActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.12)_0%,transparent_70%)]" />
      </div>
      {fallbackActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[#C9A96E]/25 bg-[#111111]/80">
            <img
              src={AGENCY_CONFIG.logoCutoutPath}
              alt="DEXORA STUDIO Monogram"
              className="w-36 object-contain logo-cutout-glow"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
