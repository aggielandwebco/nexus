export function getStoredTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("aw-nexus-theme") || "dark";
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("aw-nexus-theme", theme);
}
