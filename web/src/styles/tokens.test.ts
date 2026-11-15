import { describe, expect, it } from "vitest";
import css from "./tokens.css?raw";

// Contraste WCAG de los pares de color que usa la interfaz, leídos del propio tokens.css.

function token(name: string): string {
  const match = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6,8})\\s*;`).exec(css);
  if (!match?.[1]) throw new Error(`falta el token --${name}`);
  return match[1].slice(0, 7);
}

function luminance(hex: string): number {
  const channel = (offset: number) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

const SURFACES = ["cc-bg", "cc-surface", "cc-surface-2", "cc-surface-3"];

describe("contraste de los tokens", () => {
  it("el texto y el acento superan 4.5:1 sobre todas las superficies", () => {
    for (const surface of SURFACES) {
      for (const text of ["cc-text", "cc-text-muted", "cc-accent", "cc-accent-strong", "cc-warn", "cc-scale-mid", "cc-scale-high"]) {
        expect(contrast(token(text), token(surface)), `${text} sobre ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("el texto sobre el acento (botones) supera 4.5:1", () => {
    expect(contrast(token("cc-accent-ink"), token("cc-accent"))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("cc-accent-ink"), token("cc-accent-strong"))).toBeGreaterThanOrEqual(4.5);
  });

  it("el borde del foco se distingue del fondo (3:1)", () => {
    for (const surface of SURFACES) {
      expect(contrast(token("cc-focus"), token(surface)), surface).toBeGreaterThanOrEqual(3);
    }
  });

  it("el borde de los controles se distingue de todas las superficies (3:1)", () => {
    for (const surface of SURFACES) {
      expect(contrast(token("cc-control-line"), token(surface)), surface).toBeGreaterThanOrEqual(3);
    }
  });

  it("los bordes finos se ven sin competir con el texto (1.3:1 a 3:1)", () => {
    const ratio = contrast(token("cc-border-strong"), token("cc-surface"));
    expect(ratio).toBeGreaterThanOrEqual(1.3);
    expect(ratio).toBeLessThan(3);
  });
});
