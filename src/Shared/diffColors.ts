export interface DiffColors {
  readonly surface: string;
  readonly text: string;
  readonly addBg: string;
  readonly addText: string;
  readonly addMark: string;
  readonly removeBg: string;
  readonly removeText: string;
  readonly removeMark: string;
}

/** Solid colors so line text stays readable on the preview surface. */
export function diffColors(dark: boolean): DiffColors {
  if (!dark) {
    return {
      surface: "#f8f9fa",
      text: "#212529",
      addBg: "#e6ffed",
      addText: "#22863a",
      addMark: "#acf2bd",
      removeBg: "#ffeef0",
      removeText: "#b31d28",
      removeMark: "#fdb8c0",
    };
  }
  return {
    surface: "#202225",
    text: "#e6edf3",
    addBg: "#14301f",
    addText: "#7ee787",
    addMark: "#166432",
    removeBg: "#3d1a1e",
    removeText: "#ffa198",
    removeMark: "#7a3038",
  };
}
