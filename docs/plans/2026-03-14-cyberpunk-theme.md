# Cyberpunk Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Cyberpunk color theme alongside the existing dark theme, with a header toggle so users can switch between them.

**Architecture:** CSS variables for each theme are defined as class blocks in `globals.css` (`.dark`, `.cyberpunk`). `next-themes` ThemeProvider applies the active theme class to `<html>`. A new client component `ThemeSwitcher` in the header calls `setTheme()` to swap classes.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, next-themes (already installed), shadcn/ui DropdownMenu, Lucide icons.

---

### Task 1: Add ThemeProvider to the root layout

**Files:**
- Modify: `app/layout.tsx`

**Context:**
`next-themes` is already in `package.json`. The current layout hardcodes `className="dark"` on `<html>` — replace this with a `ThemeProvider` that manages the class dynamically.

**Step 1: Read the current layout**

File: `app/layout.tsx` (already read — see lines 1–38)

**Step 2: Replace the layout with ThemeProvider wrapping**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenStock",
  description: "OpenStock is an open-source alternative to expensive market platforms. Track real-time prices, set personalized alerts, and explore detailed company insights — built openly, for everyone, forever free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "cyberpunk"]}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Note: `suppressHydrationWarning` on `<html>` is required by next-themes to avoid hydration mismatch warnings.

**Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add next-themes ThemeProvider with dark and cyberpunk themes"
```

---

### Task 2: Add Cyberpunk CSS variable block to globals.css

**Files:**
- Modify: `app/globals.css`

**Context:**
The existing file has `:root { ... }` for light and `.dark { ... }` for dark. We add `.cyberpunk { ... }` that maps the same CSS custom property names to cyberpunk values. Tailwind picks them up automatically via the existing `@theme inline` block. We also add new cyberpunk color tokens to the `@theme` block.

**Step 1: Add new color tokens to the `@theme` block**

In `app/globals.css`, inside the `@theme { ... }` block (around line 116), add these tokens after the existing `--color-purple-500` line:

```css
    /* Cyberpunk Colors */
    --color-cyber-cyan: #00F5FF;
    --color-cyber-pink: #FF00AA;
    --color-cyber-green: #39FF14;
    --color-cyber-red: #FF3060;
    --color-cyber-bg: #0a0010;
    --color-cyber-surface: #0d001a;
    --color-cyber-elevated: #150025;
    --color-cyber-border: #2a0050;
    --color-cyber-muted: #8080B0;
    --color-cyber-text: #E0E0FF;
```

**Step 2: Add the `.cyberpunk` CSS variable block**

After the closing `}` of the `.dark { ... }` block (around line 113), add:

```css
.cyberpunk {
    --background: oklch(from #0a0010 l c h);
    --foreground: oklch(from #E0E0FF l c h);
    --card: oklch(from #0d001a l c h);
    --card-foreground: oklch(from #E0E0FF l c h);
    --popover: oklch(from #0d001a l c h);
    --popover-foreground: oklch(from #E0E0FF l c h);
    --primary: oklch(from #00F5FF l c h);
    --primary-foreground: oklch(from #0a0010 l c h);
    --secondary: oklch(from #150025 l c h);
    --secondary-foreground: oklch(from #E0E0FF l c h);
    --muted: oklch(from #150025 l c h);
    --muted-foreground: oklch(from #8080B0 l c h);
    --accent: oklch(from #FF00AA l c h);
    --accent-foreground: oklch(from #E0E0FF l c h);
    --destructive: oklch(from #FF3060 l c h);
    --border: oklch(from #2a0050 l c h);
    --input: oklch(from #2a0050 l c h);
    --ring: oklch(from #00F5FF l c h);
    --chart-1: oklch(from #00F5FF l c h);
    --chart-2: oklch(from #39FF14 l c h);
    --chart-3: oklch(from #FF00AA l c h);
    --chart-4: oklch(from #FF3060 l c h);
    --chart-5: oklch(from #8080B0 l c h);
    --sidebar: oklch(from #0d001a l c h);
    --sidebar-foreground: oklch(from #E0E0FF l c h);
    --sidebar-primary: oklch(from #00F5FF l c h);
    --sidebar-primary-foreground: oklch(from #0a0010 l c h);
    --sidebar-accent: oklch(from #150025 l c h);
    --sidebar-accent-foreground: oklch(from #E0E0FF l c h);
    --sidebar-border: oklch(from #2a0050 l c h);
    --sidebar-ring: oklch(from #00F5FF l c h);
}
```

Also update the `.cyberpunk` custom gray scale overrides by adding this block after the `.cyberpunk { ... }` block above:

```css
.cyberpunk {
    --color-gray-900: #0a0010;
    --color-gray-800: #0d001a;
    --color-gray-700: #150025;
    --color-gray-600: #2a0050;
    --color-gray-500: #8080B0;
    --color-gray-400: #E0E0FF;
    --color-blue-600: #00F5FF;
    --color-teal-400: #00F5FF;
    --color-teal-500: #00d4e8;
    --color-red-500: #FF3060;
}
```

Note: Two separate `.cyberpunk { ... }` blocks is fine — CSS merges them. Or combine into one block for cleanliness.

**Step 3: Update TradingView widget background override**

The TradingView styles use hardcoded `#141414`. Add cyberpunk overrides after the existing tradingview block at the bottom of globals.css:

```css
/* Cyberpunk TradingView overrides */
.cyberpunk .tradingview-widget-container {
    background-color: #0d001a !important;
}
.cyberpunk .tv-embed-widget-wrapper__body,
.cyberpunk .tradingview-widget-container__widget,
.cyberpunk .canvasContainer-tyaAU8aH,
.cyberpunk .widget-stock-heatmap-container .screenerMapWrapper-BBVfGP0b,
.cyberpunk .tv-embed-widget-wrapper .tv-embed-widget-wrapper__body,
.cyberpunk .tradingview-widget-container iframe {
    background-color: #0d001a !important;
}
.cyberpunk .custom-chart.tradingview-widget-container iframe {
    border-color: #2a0050 !important;
}
```

**Step 4: Start the dev server and verify the dark theme still looks correct**

```bash
npm run dev
```

Open http://localhost:3000 — default dark theme should look identical to before.

**Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: add cyberpunk CSS theme variables and color tokens"
```

---

### Task 3: Create the ThemeSwitcher component

**Files:**
- Create: `components/ThemeSwitcher.tsx`

**Context:**
This is a client component (needs `useTheme` hook). It renders a button that opens a shadcn `DropdownMenu` with two options: Dark and Cyberpunk. The existing `DropdownMenu` is already used in `UserDropdown`, so the import pattern is established. Uses Lucide icons `Moon` (dark) and `Zap` (cyberpunk).

**Step 1: Create the component**

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const themes = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "cyberpunk", label: "Cyberpunk", icon: Zap },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
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
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add components/ThemeSwitcher.tsx
git commit -m "feat: add ThemeSwitcher component with dark/cyberpunk options"
```

---

### Task 4: Add ThemeSwitcher to the Header

**Files:**
- Modify: `components/Header.tsx`

**Context:**
`Header.tsx` is a server component (async). `ThemeSwitcher` is a client component — this is fine in Next.js App Router; server components can render client components. Add it between the `<nav>` and `<UserDropdown>`.

**Step 1: Read the current header**

File: `components/Header.tsx` (already read — see lines 1–30)

**Step 2: Add ThemeSwitcher import and render it**

```tsx
import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    const initialStocks = await searchStocks();

    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="/" className="flex items-center justify-center gap-2">
                    <Image
                        src="/assets/images/logo.png"
                        alt="OpenStock"
                        width={200}
                        height={50}
                    />
                </Link>
                <nav className="hidden sm:block">
                    <NavItems initialStocks={initialStocks} />
                </nav>
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <UserDropdown user={user} initialStocks={initialStocks} />
                </div>
            </div>
        </header>
    );
};

export default Header;
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 4: Verify in browser**

```bash
npm run dev
```

Open http://localhost:3000. You should see a icon (Moon) in the header. Click it — a dropdown appears with "Dark" and "Cyberpunk". Selecting Cyberpunk should switch the app to the purple/neon palette.

**Step 5: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add ThemeSwitcher to header"
```

---

### Task 5: Persist theme preference across page loads

**Context:**
`next-themes` handles localStorage persistence automatically when `attribute="class"` is used. No extra work needed — verify it works.

**Step 1: Verify persistence**

1. In the browser, switch to Cyberpunk theme
2. Refresh the page (Cmd+R)
3. Theme should still be Cyberpunk

Expected: theme persists across refresh. If it flickers briefly on load, that's normal (SSR limitation) and acceptable.

**Step 2: Verify no console errors**

Open browser DevTools → Console. There should be no React hydration warnings (the `suppressHydrationWarning` and `mounted` guard handle this).

**Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: ensure cyberpunk theme hydration and persistence work correctly"
```

---

### Task 6: Smoke test the full app in both themes

**Manual checklist — open http://localhost:3000 and verify each page in both Dark and Cyberpunk themes:**

- [ ] Auth pages (`/sign-in`, `/sign-up`) — backgrounds, inputs, buttons render correctly
- [ ] Dashboard/home — cards, news items, heatmap widget visible
- [ ] Stock detail page (`/stocks/AAPL`) — chart widget, watchlist button, company info
- [ ] Watchlist page — table rows, alerts panel
- [ ] Header — logo, nav, theme switcher, user dropdown all visible
- [ ] Search (Cmd+K) — dialog background matches theme

**If any component looks broken in Cyberpunk theme:**
- It's likely using a hardcoded hex color instead of a CSS variable
- Fix by tracing the component's Tailwind classes back to `globals.css` utility classes and ensuring the variable is overridden in `.cyberpunk`

**Final commit**

```bash
git add -A
git commit -m "feat: cyberpunk theme complete — dark/cyberpunk switcher in header"
```
