import { diffColors } from "./diffColors";
import { isDarkSkin } from "../Theme/darkSkin";

function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ];
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, b] = hexToRgb(hex).map(channel);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("diffColors", () => {
  it.each([false, true])(
    "keeps unchanged preview text readable when dark=%s",
    (dark) => {
      const colors = diffColors(dark);
      expect(contrast(colors.text, colors.surface)).toBeGreaterThan(4.5);
    }
  );

  it("keeps dark-mode additions and removals readable", () => {
    const colors = diffColors(true);
    expect(contrast(colors.addText, colors.addBg)).toBeGreaterThan(4.5);
    expect(contrast(colors.removeText, colors.removeBg)).toBeGreaterThan(4.5);
    expect(contrast(colors.addText, colors.addMark)).toBeGreaterThan(4.5);
    expect(contrast(colors.removeText, colors.removeMark)).toBeGreaterThan(4.5);
  });

  it("uses a dark surface only for the dark skin", () => {
    expect(diffColors(true).surface).not.toBe(diffColors(false).surface);
    expect(isDarkSkin("mod-skin-dark nav-function-fixed")).toBe(true);
    expect(isDarkSkin("mod-skin-dark mod-skin-light")).toBe(false);
    expect(isDarkSkin("")).toBe(false);
  });
});
