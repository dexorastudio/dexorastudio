import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, [role="button"], [tabindex]:not([tabindex="-1"])';

export const LuxuryCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;

    const finePointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    if (!finePointerQuery.matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let currentScale = 1;
    let targetScale = 1;
    let isVisible = false;
    let isHovering = false;
    let isPressed = false;
    let rafId = 0;
    let running = false;
    let lastTime = performance.now();

    const applyVisualState = () => {
      if (isPressed) {
        targetScale = isHovering ? 1.35 : 0.85;
      } else {
        targetScale = isHovering ? 1.55 : 1;
      }

      if (isHovering) {
        ring.style.borderColor = 'rgba(232, 213, 172, 0.78)';
        ring.style.backgroundColor = 'rgba(201, 169, 110, 0.08)';
      } else {
        ring.style.borderColor = 'rgba(201, 169, 110, 0.52)';
        ring.style.backgroundColor = 'transparent';
      }
    };

    const startLoop = () => {
      if (running || document.hidden) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const tick = (now: number) => {
      if (document.hidden) {
        running = false;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const posAlpha = 1 - Math.exp(-14 * dt);
      const scaleAlpha = 1 - Math.exp(-16 * dt);

      currentX += (targetX - currentX) * posAlpha;
      currentY += (targetY - currentY) * posAlpha;
      currentScale += (targetScale - currentScale) * scaleAlpha;

      ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale.toFixed(3)})`;

      const settled =
        Math.abs(targetX - currentX) < 0.08 &&
        Math.abs(targetY - currentY) < 0.08 &&
        Math.abs(targetScale - currentScale) < 0.005;

      if (settled) {
        running = false;
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;

      if (!isVisible) {
        currentX = e.clientX;
        currentY = e.clientY;
        isVisible = true;
        ring.style.opacity = '1';
      }

      targetX = e.clientX;
      targetY = e.clientY;

      const targetEl = e.target as Element | null;
      const interactive = Boolean(targetEl?.closest(INTERACTIVE_SELECTOR));
      if (interactive !== isHovering) {
        isHovering = interactive;
        applyVisualState();
      }

      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      isPressed = true;
      applyVisualState();
      startLoop();
    };

    const onPointerUp = () => {
      if (!isPressed) return;
      isPressed = false;
      applyVisualState();
      startLoop();
    };

    const onMouseLeave = () => {
      isVisible = false;
      isHovering = false;
      isPressed = false;
      ring.style.opacity = '0';
      applyVisualState();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        running = false;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden md:block h-8 w-8 rounded-full border border-[#C9A96E]/52 opacity-0 transition-opacity duration-200 will-change-transform"
      style={{
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(1)',
      }}
    />
  );
};
