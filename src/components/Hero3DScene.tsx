import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { AGENCY_CONFIG } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Hero3DSceneProps {
  className?: string;
}

function detectSoftwareWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl =
      probeCanvas.getContext('webgl2') ||
      (probeCanvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) {
      return { supported: false, isSoftwareGl: false };
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl =
      /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftwareGl };
  } catch {
    return { supported: false, isSoftwareGl: false };
  }
}

function createSoftGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(232, 213, 172, 1)');
    gradient.addColorStop(0.35, 'rgba(201, 169, 110, 0.5)');
    gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBrushedMetalRoughnessMap(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#323232';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) {
      const shade = 34 + Math.floor(Math.random() * 26);
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillRect(0, y, 256, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = maxAniso;
  return tex;
}

function createStudioContactTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 124);
    grad.addColorStop(0, 'rgba(201, 169, 110, 0.22)');
    grad.addColorStop(0.45, 'rgba(212, 212, 216, 0.06)');
    grad.addColorStop(1, 'rgba(5, 5, 5, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTaperedBladeGeometry(
  length: number,
  height: number,
  depth: number,
  direction: 1 | -1
): THREE.ExtrudeGeometry {
  const halfH = height / 2;
  const shape = new THREE.Shape();
  if (direction === 1) {
    shape.moveTo(0, -halfH);
    shape.lineTo(length * 0.78, -halfH * 0.38);
    shape.lineTo(length, 0);
    shape.lineTo(length * 0.78, halfH * 0.38);
    shape.lineTo(0, halfH);
    shape.lineTo(length * 0.14, 0);
  } else {
    shape.moveTo(0, -halfH);
    shape.lineTo(-length * 0.78, -halfH * 0.38);
    shape.lineTo(-length, 0);
    shape.lineTo(-length * 0.78, halfH * 0.38);
    shape.lineTo(0, halfH);
    shape.lineTo(-length * 0.14, 0);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

function createMonogramSculpture(
  goldMat: THREE.Material,
  platinumMat: THREE.Material,
  obsidianMat: THREE.Material,
  segmentCurve: number
): THREE.Group {
  const root = new THREE.Group();

  // 1. Dominant Sculpted Aerodynamic "D" Outer Frame
  const dShape = new THREE.Shape();
  dShape.moveTo(-0.22, 1.06);
  dShape.lineTo(0.46, 1.06);
  dShape.bezierCurveTo(1.26, 1.06, 1.54, 0.56, 1.54, 0.0);
  dShape.bezierCurveTo(1.54, -0.56, 1.22, -1.06, 0.36, -1.06);
  dShape.lineTo(-0.34, -1.06);
  dShape.lineTo(-0.08, -0.68);
  dShape.lineTo(0.34, -0.68);
  dShape.bezierCurveTo(0.88, -0.68, 1.1, -0.36, 1.1, 0.0);
  dShape.bezierCurveTo(1.1, 0.38, 0.88, 0.68, 0.38, 0.68);
  dShape.lineTo(-0.02, 0.68);
  dShape.closePath();

  const dExtrude = new THREE.ExtrudeGeometry(dShape, {
    steps: 1,
    depth: 0.3,
    curveSegments: segmentCurve,
    bevelEnabled: true,
    bevelThickness: 0.065,
    bevelSize: 0.048,
    bevelSegments: 5,
  });
  dExtrude.translate(0, 0, -0.15);
  const dMesh = new THREE.Mesh(dExtrude, goldMat);
  dMesh.castShadow = true;
  dMesh.receiveShadow = true;
  root.add(dMesh);

  // 2. Interlocking Integrated "S" Ribbon (Platinum Silver)
  const sShape = new THREE.Shape();
  sShape.moveTo(0.3, 0.64);
  sShape.lineTo(-0.58, 0.64);
  sShape.bezierCurveTo(-1.12, 0.64, -1.2, 0.08, -0.66, 0.02);
  sShape.lineTo(0.16, -0.06);
  sShape.bezierCurveTo(0.48, -0.1, 0.44, -0.46, 0.06, -0.52);
  sShape.lineTo(-0.96, -0.52);
  sShape.lineTo(-1.18, -0.86);
  sShape.lineTo(0.08, -0.86);
  sShape.bezierCurveTo(0.78, -0.86, 0.9, -0.18, 0.28, 0.16);
  sShape.lineTo(-0.5, 0.24);
  sShape.bezierCurveTo(-0.74, 0.27, -0.74, 0.36, -0.46, 0.36);
  sShape.lineTo(0.14, 0.36);
  sShape.closePath();

  const sExtrude = new THREE.ExtrudeGeometry(sShape, {
    steps: 1,
    depth: 0.36,
    curveSegments: segmentCurve,
    bevelEnabled: true,
    bevelThickness: 0.058,
    bevelSize: 0.042,
    bevelSegments: 5,
  });
  sExtrude.translate(0, 0, -0.18);
  const sMesh = new THREE.Mesh(sExtrude, platinumMat);
  sMesh.castShadow = true;
  sMesh.receiveShadow = true;
  root.add(sMesh);

  // 3. Recessed Obsidian Core Spine for architectural contrast
  const coreShape = new THREE.Shape();
  coreShape.moveTo(-0.24, 0.84);
  coreShape.lineTo(0.36, 0.84);
  coreShape.bezierCurveTo(0.98, 0.84, 1.2, 0.42, 1.2, 0.0);
  coreShape.bezierCurveTo(1.2, -0.42, 0.98, -0.84, 0.28, -0.84);
  coreShape.lineTo(-0.56, -0.84);
  coreShape.lineTo(-0.24, 0.84);
  coreShape.closePath();

  const coreGeo = new THREE.ExtrudeGeometry(coreShape, {
    steps: 1,
    depth: 0.12,
    curveSegments: segmentCurve,
    bevelEnabled: true,
    bevelThickness: 0.022,
    bevelSize: 0.02,
    bevelSegments: 3,
  });
  coreGeo.translate(0, 0, -0.22);
  const coreMesh = new THREE.Mesh(coreGeo, obsidianMat);
  root.add(coreMesh);

  // 4-6. Tapered Beveled Aerodynamic Blades mirroring the cutout emblem speed lines
  const topBlade = new THREE.Mesh(
    createTaperedBladeGeometry(0.95, 0.055, 0.05, -1),
    platinumMat
  );
  topBlade.position.set(-0.32, 0.86, 0.04);
  root.add(topBlade);

  const leftBlade = new THREE.Mesh(
    createTaperedBladeGeometry(1.05, 0.048, 0.045, -1),
    platinumMat
  );
  leftBlade.position.set(-0.98, -0.22, 0.02);
  root.add(leftBlade);

  const rightBlade = new THREE.Mesh(
    createTaperedBladeGeometry(0.74, 0.052, 0.045, 1),
    goldMat
  );
  rightBlade.position.set(1.5, -0.06, 0.02);
  root.add(rightBlade);

  root.position.set(-0.08, 0.04, 0);
  return root;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({ className = '' }) => {
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

    const getMobileFlag = () => window.innerWidth < 768;
    const getTargetCameraZ = () => {
      const w = window.innerWidth;
      if (w < 480) return 7.4;
      if (w < 768) return 6.8;
      if (w < 1024) return 6.3;
      return 5.95;
    };

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

    const isMobile = getMobileFlag();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.26;
    renderer.setPixelRatio(
      isSoftwareGl
        ? 1
        : Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl && !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height);

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    let targetCameraZ = getTargetCameraZ();
    camera.position.set(0, 0.1, targetCameraZ);

    // Studio IBL Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Three-point luxury studio rig + grazing specular highlight & warm/cool contrast
    const hemiLight = new THREE.HemisphereLight(0xdadbe2, 0x12100d, 0.82);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffe9c8, 2.85);
    keyLight.position.set(4.2, 5.2, 6.2);
    if (!isSoftwareGl && !isMobile) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 18;
      const d = 3.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xe8d5ac, 6.2, 18, 1.35);
    rimLight.position.set(-3.6, -1.4, -3.2);
    scene.add(rimLight);

    const grazingFillLight = new THREE.DirectionalLight(0xf2dec0, 1.25);
    grazingFillLight.position.set(2.4, -3.2, 4.6);
    scene.add(grazingFillLight);

    const coolAccentLight = new THREE.DirectionalLight(0xe8e9f2, 1.3);
    coolAccentLight.position.set(-4.8, 3.4, 3.2);
    scene.add(coolAccentLight);

    if (!isSoftwareGl && !isMobile) {
      RectAreaLightUniformsLib.init();
      const softboxTop = new THREE.RectAreaLight(0xf5e6c8, 3.8, 5.8, 1.8);
      softboxTop.position.set(0.4, 4.4, 3.2);
      softboxTop.lookAt(0, 0, 0);
      scene.add(softboxTop);
    }

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const brushedRoughnessMap = createBrushedMetalRoughnessMap(maxAniso);

    // Calibrated Luxury PBR Materials
    const champagneGoldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd4b478),
      metalness: 0.95,
      roughness: 0.21,
      roughnessMap: brushedRoughnessMap,
      clearcoat: 0.82,
      clearcoatRoughness: 0.08,
      anisotropy: 0.9,
      anisotropyRotation: Math.PI * 0.15,
      specularIntensity: 1.15,
      specularColor: new THREE.Color(0xfff4de),
      envMapIntensity: 1.78,
    });

    const platinumMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xe2e2e8),
      metalness: 0.96,
      roughness: 0.18,
      roughnessMap: brushedRoughnessMap,
      clearcoat: 0.82,
      clearcoatRoughness: 0.09,
      anisotropy: 0.9,
      envMapIntensity: 1.65,
    });

    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x151519),
      metalness: 0.86,
      roughness: 0.28,
      clearcoat: 0.62,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1.28,
    });

    const darkMetallicMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x222227),
      metalness: 0.88,
      roughness: 0.25,
      envMapIntensity: 1.35,
    });

    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    const curveSegments = isMobile ? 16 : 30;
    const monogramSculpture = createMonogramSculpture(
      champagneGoldMat,
      platinumMat,
      obsidianMat,
      curveSegments
    );
    assemblyGroup.add(monogramSculpture);

    // Precision Orbital Rings
    const ringSegs = isMobile ? 68 : 120;
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.16, 0.017, 16, ringSegs),
      champagneGoldMat
    );
    ring1.rotation.set(Math.PI * 0.34, Math.PI * 0.12, 0);
    assemblyGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.52, 0.011, 14, ringSegs),
      platinumMat
    );
    ring2.rotation.set(-Math.PI * 0.26, Math.PI * 0.28, Math.PI * 0.1);
    assemblyGroup.add(ring2);

    const arcRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.86, 0.025, 14, ringSegs, Math.PI * 1.25),
      darkMetallicMat
    );
    arcRing.rotation.set(Math.PI * 0.15, -Math.PI * 0.18, 0.4);
    assemblyGroup.add(arcRing);

    const nodeGeo = new THREE.OctahedronGeometry(0.052, 0);
    const nodeA = new THREE.Mesh(nodeGeo, champagneGoldMat);
    nodeA.position.set(2.16, 0, 0);
    ring1.add(nodeA);

    const nodeB = new THREE.Mesh(nodeGeo, platinumMat);
    nodeB.position.set(-2.52, 0, 0);
    ring2.add(nodeB);

    // Soft Studio Contact Halo beneath sculpture
    const contactTex = createStudioContactTexture();
    const contactPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({
        map: contactTex,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      })
    );
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.set(0, -1.68, 0);
    scene.add(contactPlane);

    // Adaptive Atmospheric Light Motes
    const particleCount = isMobile ? 40 : 110;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi) * 0.82;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi) - 0.4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const glowTex = createSoftGlowTexture();
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.075 : 0.06,
      map: glowTex,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let scrollProgress = 0;
    let currentScroll = 0;
    let isTabHidden = document.hidden;
    let isInViewport = true;
    let contextLost = false;

    const updateScrollTarget = () => {
      const vh = Math.max(window.innerHeight, 1);
      scrollProgress = THREE.MathUtils.clamp(window.scrollY / vh, 0, 1.5);
    };
    updateScrollTarget();
    currentScroll = scrollProgress;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetPointerX = THREE.MathUtils.clamp(nx, -1, 1);
      targetPointerY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const handlePointerLeave = () => {
      targetPointerX = 0;
      targetPointerY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1;
      targetPointerX = THREE.MathUtils.clamp(nx, -1, 1);
      targetPointerY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const handleTouchEnd = () => {
      targetPointerX = 0;
      targetPointerY = 0;
    };

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      targetCameraZ = getTargetCameraZ();
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const handleVisibility = () => {
      isTabHidden = document.hidden;
      if (!isTabHidden && isInViewport && !contextLost) {
        clock.getDelta();
        scheduleNext();
      }
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      setFallbackActive(true);
    };

    const handleContextRestored = () => {
      contextLost = false;
      setFallbackActive(false);
      clock.getDelta();
      scheduleNext();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, {
      passive: true,
    });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      handleContextRestored
    );

    const observer = new IntersectionObserver(
      (entries) => {
        isInViewport = entries[0]?.isIntersecting ?? true;
        if (isInViewport && !isTabHidden && !contextLost) {
          clock.getDelta();
          scheduleNext();
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    const clock = new THREE.Clock();
    let elapsed = 0;
    let frameId = 0;
    let disposed = false;

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
        isTabHidden ||
        !isInViewport ||
        contextLost ||
        reducedMotionRef.current
      ) {
        return;
      }
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    function tick() {
      if (disposed || isTabHidden || !isInViewport || contextLost) return;
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.05);
      const isReduced = reducedMotionRef.current;

      if (!isReduced) {
        elapsed += delta;
      }

      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetCameraZ,
        5,
        delta
      );

      currentPointerX = THREE.MathUtils.damp(
        currentPointerX,
        targetPointerX,
        4.2,
        delta
      );
      currentPointerY = THREE.MathUtils.damp(
        currentPointerY,
        targetPointerY,
        4.2,
        delta
      );
      currentScroll = THREE.MathUtils.damp(
        currentScroll,
        scrollProgress,
        6,
        delta
      );

      const floatY = isReduced ? 0 : Math.sin(elapsed * 1.12) * 0.13;
      const scrollLift = currentScroll * 0.45;
      const scrollSpin = currentScroll * Math.PI * 0.42;

      assemblyGroup.position.y = floatY + scrollLift * 0.35;

      const targetRotY =
        (isReduced ? -0.18 : Math.sin(elapsed * 0.4) * 0.28) +
        currentPointerX * 0.34 +
        scrollSpin;
      const targetRotX =
        (isReduced ? 0.08 : Math.cos(elapsed * 0.34) * 0.09) -
        currentPointerY * 0.22 -
        currentScroll * 0.16;

      assemblyGroup.rotation.y = THREE.MathUtils.damp(
        assemblyGroup.rotation.y,
        targetRotY,
        4.5,
        delta
      );
      assemblyGroup.rotation.x = THREE.MathUtils.damp(
        assemblyGroup.rotation.x,
        targetRotX,
        4.5,
        delta
      );

      if (!isReduced) {
        const nextScale = THREE.MathUtils.damp(
          assemblyGroup.scale.x,
          1,
          4.2,
          delta
        );
        assemblyGroup.scale.setScalar(nextScale);

        rimLight.position.x =
          -3.6 + Math.sin(elapsed * 0.55) * 0.65 + currentPointerX * 0.75;
        rimLight.position.y =
          -1.4 + Math.cos(elapsed * 0.45) * 0.45 - currentPointerY * 0.45;

        ring1.rotation.z += delta * 0.22;
        ring2.rotation.z -= delta * 0.15;
        arcRing.rotation.z += delta * 0.1;
        particles.rotation.y += delta * 0.032;
      }

      renderer.render(scene, camera);
      if (!isReduced) {
        scheduleNext();
      }
    }

    resumeRenderRef.current = () => {
      if (disposed || contextLost) return;
      if (reducedMotionRef.current) {
        assemblyGroup.scale.setScalar(1);
        assemblyGroup.rotation.set(0.08, -0.18, 0);
        assemblyGroup.position.y = 0;
        rimLight.position.set(-3.6, -1.4, -3.2);
        renderer.render(scene, camera);
      } else {
        clock.getDelta();
        scheduleNext();
      }
    };

    // Set graceful initial orientation before first frame (prevents frame-1 jump)
    assemblyGroup.rotation.set(0.08, -0.18, 0);
    if (!reducedMotionRef.current) {
      assemblyGroup.scale.setScalar(0.93);
    }
    renderer.render(scene, camera);
    if (!reducedMotionRef.current) {
      scheduleNext();
    }

    return () => {
      disposed = true;
      resumeRenderRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', updateScrollTarget);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        handleContextLost
      );
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      );

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      brushedRoughnessMap.dispose();
      contactTex.dispose();
      glowTex.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none touch-pan-y ${className}`}
      aria-label="Interactive 3D DEXORA STUDIO metallic monogram sculpture"
    >
      <div
        ref={mountRef}
        className={`w-full h-full transition-opacity duration-500 ${
          fallbackActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Ambient Studio Glow Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-[300px] w-[300px] sm:h-[440px] sm:w-[440px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.14)_0%,rgba(212,212,216,0.04)_48%,transparent_72%)]" />
      </div>

      {/* Graceful CSS fallback if WebGL is unavailable */}
      {fallbackActive && (
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
          <div className="relative flex h-60 w-60 sm:h-80 sm:w-80 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#C9A96E]/30 animate-slow-orbit" />
            <div className="absolute inset-5 rounded-full border border-[#D4D4D8]/20" />
            <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(232,213,172,0.18),rgba(17,17,17,0.94)_70%)] border border-[#C9A96E]/25 shadow-[0_24px_80px_rgba(0,0,0,0.85)]" />
            <img
              src={AGENCY_CONFIG.logoCutoutPath}
              alt="DEXORA STUDIO Metallic Monogram"
              className="relative z-10 w-44 sm:w-56 object-contain animate-subtle-float logo-cutout-glow"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
