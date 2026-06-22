"use client";

import type { LiquidMetalProps } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const LiquidMetal = dynamic(
  async () => {
    const shaders = await import("@paper-design/shaders-react");
    return shaders.LiquidMetal;
  },
  {
    loading: () => null,
    ssr: false,
  }
);

export type AiOrbState = "active" | "resting" | "thinking";

const defaultOrbShaderProps = {
  angle: 70,
  colorBack: "#00000000",
  colorTint: "#f0f0f2",
  contour: 0.45,
  distortion: 0.08,
  fit: "cover",
  originX: 0.5,
  originY: 0.5,
  repetition: 2.5,
  scale: 1,
  shape: "circle",
  shiftBlue: 0.28,
  shiftRed: 0.28,
  softness: 0.12,
  speed: 1,
} satisfies Partial<LiquidMetalProps>;

interface AnimatedShaderProps {
  angle: number;
  distortion: number;
  scale: number;
  shiftBlue: number;
}

const restingShaderProps = {
  angle: defaultOrbShaderProps.angle,
  distortion: defaultOrbShaderProps.distortion,
  scale: defaultOrbShaderProps.scale,
  shiftBlue: defaultOrbShaderProps.shiftBlue,
} satisfies AnimatedShaderProps;

const activeShaderProps = {
  angle: 98,
  distortion: 0.2,
  scale: 1.08,
  shiftBlue: 0.52,
} satisfies AnimatedShaderProps;

const thinkingShaderProps = {
  angle: 115,
  distortion: 0.3,
  scale: 1.1,
  shiftBlue: 0.62,
} satisfies AnimatedShaderProps;

const shaderPropsByState: Record<AiOrbState, AnimatedShaderProps> = {
  active: activeShaderProps,
  resting: restingShaderProps,
  thinking: thinkingShaderProps,
};

const sizeRatioByState: Record<AiOrbState, number> = {
  active: 1,
  resting: 0.82,
  thinking: 1,
};

const shaderSpeedByState: Record<AiOrbState, number> = {
  active: 1,
  resting: 1,
  thinking: 2.4,
};

const shaderTransitionMs = 380;

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

function lerpValue(from: number, to: number, progress: number): number {
  const eased = easeOutCubic(progress);
  return from + (to - from) * eased;
}

function lerpShaderProps(
  from: AnimatedShaderProps,
  to: AnimatedShaderProps,
  progress: number
): AnimatedShaderProps {
  return {
    angle: lerpValue(from.angle, to.angle, progress),
    distortion: lerpValue(from.distortion, to.distortion, progress),
    scale: lerpValue(from.scale, to.scale, progress),
    shiftBlue: lerpValue(from.shiftBlue, to.shiftBlue, progress),
  };
}

function useAnimatedOrbState(
  state: AiOrbState,
  reducedMotion: boolean,
  activeSize: number
): {
  animatedProps: AnimatedShaderProps;
  displaySize: number;
  shaderSpeed: number;
} {
  const propsRef = useRef<AnimatedShaderProps>(restingShaderProps);
  const sizeRef = useRef(Math.round(activeSize * sizeRatioByState.resting));
  const [animatedProps, setAnimatedProps] =
    useState<AnimatedShaderProps>(restingShaderProps);
  const [displaySize, setDisplaySize] = useState(
    Math.round(activeSize * sizeRatioByState.resting)
  );
  const [shaderSpeed, setShaderSpeed] = useState(shaderSpeedByState.resting);

  useEffect(() => {
    const targetProps = shaderPropsByState[state];
    const targetSize = Math.round(activeSize * sizeRatioByState[state]);
    const targetSpeed = shaderSpeedByState[state];

    if (reducedMotion) {
      propsRef.current = targetProps;
      sizeRef.current = targetSize;
      setAnimatedProps(targetProps);
      setDisplaySize(targetSize);
      setShaderSpeed(targetSpeed);
      return;
    }

    const fromProps = { ...propsRef.current };
    const fromSize = sizeRef.current;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / shaderTransitionMs);
      const nextProps = lerpShaderProps(fromProps, targetProps, progress);
      const nextSize = Math.round(lerpValue(fromSize, targetSize, progress));

      propsRef.current = nextProps;
      sizeRef.current = nextSize;
      setAnimatedProps(nextProps);
      setDisplaySize(nextSize);
      setShaderSpeed(targetSpeed);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    setShaderSpeed(targetSpeed);
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [activeSize, reducedMotion, state]);

  return { animatedProps, displaySize, shaderSpeed };
}

function AiOrbShader({
  animatedProps,
  reducedMotion,
  shaderProps,
  shaderSpeed,
  size,
}: {
  animatedProps: AnimatedShaderProps;
  reducedMotion: boolean;
  shaderProps?: Partial<LiquidMetalProps>;
  shaderSpeed: number;
  size: number;
}): React.ReactElement {
  const speed = reducedMotion ? 0 : shaderSpeed;

  return (
    <LiquidMetal
      {...defaultOrbShaderProps}
      {...animatedProps}
      {...shaderProps}
      className="block shrink-0 rounded-full bg-transparent"
      height={size}
      minPixelRatio={2}
      speed={shaderProps?.speed ?? speed}
      style={{
        height: size,
        maxHeight: size,
        maxWidth: size,
        minHeight: size,
        minWidth: size,
        width: size,
      }}
      width={size}
    />
  );
}

export function AiOrb({
  className,
  shaderProps,
  size = 36,
  state = "resting",
}: {
  className?: string;
  shaderProps?: Partial<LiquidMetalProps>;
  size?: number;
  state?: AiOrbState;
}): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const { animatedProps, displaySize, shaderSpeed } = useAnimatedOrbState(
    state,
    Boolean(reducedMotion),
    size
  );

  return (
    <div
      aria-hidden
      className={cn("grid shrink-0 place-items-center", className)}
      style={{
        height: size,
        maxHeight: size,
        minHeight: size,
        width: size,
      }}
    >
      <div
        className="relative aspect-square shrink-0 overflow-hidden rounded-full"
        style={{
          height: displaySize,
          maxHeight: displaySize,
          maxWidth: displaySize,
          minHeight: displaySize,
          minWidth: displaySize,
          width: displaySize,
        }}
      >
        <AiOrbShader
          animatedProps={animatedProps}
          reducedMotion={Boolean(reducedMotion)}
          shaderProps={shaderProps}
          shaderSpeed={shaderSpeed}
          size={displaySize}
        />
      </div>
    </div>
  );
}
