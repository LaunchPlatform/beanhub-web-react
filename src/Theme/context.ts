import { createContext } from "react";
import { ThemeConfig, defaulThemeConfig } from "./types";

export default createContext<ThemeConfig>(defaulThemeConfig);
