
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    console.log("Theme switched to:", newTheme);
    
    // Force immediate DOM update
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");
    root.classList.add(newTheme);
    body.classList.add(newTheme);
    root.setAttribute('data-theme', newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 px-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-0"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-600 dark:text-gray-400" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-600 dark:text-gray-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
