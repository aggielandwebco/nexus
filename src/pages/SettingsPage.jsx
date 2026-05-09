import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getStoredTheme } from "@/lib/theme";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const updateTheme = (nextTheme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace preferences.
        </p>
      </div>

      <section className="rounded-lg border bg-card p-6 text-card-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark mode.
            </p>
          </div>

          <div className="grid grid-cols-2 overflow-hidden rounded-md border bg-secondary p-1">
            <button
              type="button"
              onClick={() => updateTheme("light")}
              className={`flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition ${
                theme === "light"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>

            <button
              type="button"
              onClick={() => updateTheme("dark")}
              className={`flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition ${
                theme === "dark"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
