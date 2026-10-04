import { useEffect, useState } from "react";

const DARK_CLASS = "mod-skin-dark";
const LIGHT_CLASS = "mod-skin-light";

/** SmartAdmin dark skin is `mod-skin-dark` on body, unless light is also set. */
export function isDarkSkin(className: string): boolean {
  const classes = className.split(/\s+/);
  return classes.includes(DARK_CLASS) && !classes.includes(LIGHT_CLASS);
}

export function bodyIsDarkSkin(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return isDarkSkin(document.body.className);
}

export function useDarkSkin(): boolean {
  const [dark, setDark] = useState(bodyIsDarkSkin);
  useEffect(() => {
    const sync = () => setDark(bodyIsDarkSkin());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return dark;
}
