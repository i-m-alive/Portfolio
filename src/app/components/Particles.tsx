"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function ParticleBackground() {
  const initParticles = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={initParticles}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "#050505" },
        particles: {
          number: { value: 50 },
          size: { value: 2 },
          move: { enable: true, speed: 0.7 },
          opacity: { value: 0.7 },
          color: { value: "#0affff" },
          links: {
            enable: true,
            color: "#0affff",
            opacity: 0.2,
            distance: 120,
          },
        },
      }}
    />
  );
}
