"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Terminal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const themes = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "matrix", label: "Matrix", icon: Terminal },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = themes.find((t) => t.id === theme) ?? themes[0];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-200 hover:bg-transparent cursor-pointer"
          aria-label="Switch theme"
        >
          <Icon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[130px]">
        {themes.map(({ id, label, icon: ItemIcon }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => setTheme(id)}
            className={`cursor-pointer gap-2 ${theme === id ? "font-semibold" : ""}`}
          >
            <ItemIcon className="h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
