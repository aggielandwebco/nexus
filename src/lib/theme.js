export function getStoredTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("integris-nexus-theme") || "dark";
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("integris-nexus-theme", theme);
}
