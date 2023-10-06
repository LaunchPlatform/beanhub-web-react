export interface ThemeConfig {
  readonly iconPrefix: string;
  readonly calendarIcon: string;
  readonly originalBs5InputAppend: boolean;
}

export const defaulThemeConfig: ThemeConfig = {
  iconPrefix: "fal",
  calendarIcon: "fa-calendar-alt",
  originalBs5InputAppend: false,
};
