# Matrix Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Matrix color theme with falling character rain animation to OpenStock, alongside a header toggle to switch between Default Dark and Matrix themes.

**Architecture:** CSS variables for each theme are defined as class blocks in `globals.css` (`.dark`, `.matrix`). `next-themes` ThemeProvider applies the active theme class to `<html>`. A `MatrixRain` canvas component renders the falling character animation only when the matrix theme is active. A `ThemeSwitcher` dropdown in the header calls `setTheme()` to swap themes.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, next-themes (already installed), shadcn/ui DropdownMenu, Lucide icons, HTML Canvas API.

---

### Task 1: Add ThemeProvider to the root layout

**Files:**
- Modify: `app/layout.tsx`

**Context:**
`next-themes` is already in `package.json`. The current layout hardcodes `className="dark"` on `<html>` — replace this with a `ThemeProvider` that manages the class dynamically. `suppressHydrationWarning` on `<html>` is required by next-themes to avoid hydration mismatch warnings.

**Step 1: Replace `app/layout.tsx` with:**

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
          themes={["dark", "matrix"]}
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

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add next-themes ThemeProvider with dark and matrix themes"
```

---

### Task 2: Add Matrix CSS variable block to globals.css

**Files:**
- Modify: `app/globals.css`

**Context:**
The existing file has `:root { ... }` for light and `.dark { ... }` for dark. Add `.matrix { ... }` that maps the same CSS custom property names to matrix values. Also add matrix color tokens to the `@theme` block.

**Step 1: Add new color tokens inside the existing `@theme { ... }` block**

After the line `--color-purple-500: #D13BFF;` (end of the Vibrant Colors section), add:

```css
    /* Matrix Colors */
    --color-matrix-green: #00FF41;
    --color-matrix-mid: #008F11;
    --color-matrix-dim: #1a6b1a;
    --color-matrix-bg: #000000;
    --color-matrix-surface: #050f05;
    --color-matrix-elevated: #0a1a0a;
    --color-matrix-border: #0d2b0d;
```

**Step 2: Add the `.matrix` CSS variable block after the closing `}` of `.dark { ... }`**

```css
.matrix {
    --background: oklch(from #000000 l c h);
    --foreground: oklch(from #00FF41 l c h);
    --card: oklch(from #050f05 l c h);
    --card-foreground: oklch(from #00FF41 l c h);
    --popover: oklch(from #050f05 l c h);
    --popover-foreground: oklch(from #00FF41 l c h);
    --primary: oklch(from #00FF41 l c h);
    --primary-foreground: oklch(from #000000 l c h);
    --secondary: oklch(from #0a1a0a l c h);
    --secondary-foreground: oklch(from #00FF41 l c h);
    --muted: oklch(from #0a1a0a l c h);
    --muted-foreground: oklch(from #1a6b1a l c h);
    --accent: oklch(from #008F11 l c h);
    --accent-foreground: oklch(from #00FF41 l c h);
    --destructive: oklch(from #FF3333 l c h);
    --border: oklch(from #0d2b0d l c h);
    --input: oklch(from #0d2b0d l c h);
    --ring: oklch(from #00FF41 l c h);
    --chart-1: oklch(from #00FF41 l c h);
    --chart-2: oklch(from #008F11 l c h);
    --chart-3: oklch(from #00cc33 l c h);
    --chart-4: oklch(from #FF3333 l c h);
    --chart-5: oklch(from #1a6b1a l c h);
    --sidebar: oklch(from #050f05 l c h);
    --sidebar-foreground: oklch(from #00FF41 l c h);
    --sidebar-primary: oklch(from #00FF41 l c h);
    --sidebar-primary-foreground: oklch(from #000000 l c h);
    --sidebar-accent: oklch(from #0a1a0a l c h);
    --sidebar-accent-foreground: oklch(from #00FF41 l c h);
    --sidebar-border: oklch(from #0d2b0d l c h);
    --sidebar-ring: oklch(from #00FF41 l c h);

    /* Override custom gray scale for matrix */
    --color-gray-900: #000000;
    --color-gray-800: #050f05;
    --color-gray-700: #0a1a0a;
    --color-gray-600: #0d2b0d;
    --color-gray-500: #1a6b1a;
    --color-gray-400: #00FF41;
    --color-blue-600: #00FF41;
    --color-teal-400: #00FF41;
    --color-teal-500: #008F11;
    --color-red-500: #FF3333;
}
```

**Step 3: Add Matrix TradingView widget overrides at the bottom of `globals.css`**

```css
/* Matrix TradingView overrides */
.matrix .tradingview-widget-container {
    background-color: #050f05 !important;
}
.matrix .tv-embed-widget-wrapper__body,
.matrix .tradingview-widget-container__widget,
.matrix .canvasContainer-tyaAU8aH,
.matrix .widget-stock-heatmap-container .screenerMapWrapper-BBVfGP0b,
.matrix .tv-embed-widget-wrapper .tv-embed-widget-wrapper__body,
.matrix .tradingview-widget-container iframe {
    background-color: #050f05 !important;
}
.matrix .custom-chart.tradingview-widget-container iframe {
    border-color: #0d2b0d !important;
}
```

**Step 4: Start dev server and verify dark theme still looks correct**

```bash
npm run dev
```

Open http://localhost:3000 — default dark theme should look identical to before.

**Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: add matrix CSS theme variables and color tokens"
```

---

### Task 3: Create the MatrixRain canvas component

**Files:**
- Create: `components/MatrixRain.tsx`

**Context:**
Client component. Renders a `<canvas>` fixed to the full viewport behind all content. Uses `requestAnimationFrame` for the animation loop. Cancelled cleanly on unmount. Only rendered when theme is `"matrix"` (checked via `useTheme`). Opacity is 10–15% so content remains readable.

Characters used: katakana block (U+30A0–U+30FF) + digits 0–9.

Animation technique: each frame, fill the canvas with a semi-transparent black rectangle (creates the fade trail effect), then draw a new character at the bottom of each column. Columns reset to top randomly to create continuous rain.

**Step 1: Create `components/MatrixRain.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const FONT_SIZE = 16;
const OPACITY = 0.12; // 12% — within the 10-15% target

function getChar(): string {
  // Katakana range U+30A0–U+30FF plus digits
  const katakana = Array.from({ length: 96 }, (_, i) =>
    String.fromCharCode(0x30a0 + i)
  );
  const digits = "0123456789".split("");
  const chars = [...katakana, ...digits];
  return chars[Math.floor(Math.random() * chars.length)];
}

export default function MatrixRain() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (theme !== "matrix") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const columns = Math.floor(canvas.width / FONT_SIZE);
    const drops: number[] = Array(columns).fill(1);

    let animId: number;

    const draw = () => {
      // Semi-transparent black overlay creates the fade trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = getChar();
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        // Leading character is brighter
        const isLeading = drops[i] * FONT_SIZE > canvas.height * 0.95 || Math.random() > 0.95;
        ctx.fillStyle = isLeading ? "#aaffbb" : "#00FF41";
        ctx.fillText(char, x, y);

        // Reset column to top randomly after it passes bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  if (theme !== "matrix") return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        opacity: OPACITY,
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
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
git add components/MatrixRain.tsx
git commit -m "feat: add MatrixRain canvas animation component"
```

---

### Task 4: Mount MatrixRain in the root layout

**Files:**
- Modify: `app/layout.tsx`

**Context:**
`MatrixRain` is a client component — it must be imported as a client component inside the layout. It needs to be inside `ThemeProvider` so `useTheme()` has access to context. Mount it as a sibling to `{children}` so it renders behind all page content.

**Step 1: Add MatrixRain to `app/layout.tsx`**

Add the import:
```tsx
import MatrixRain from "@/components/MatrixRain";
```

Update the JSX inside `ThemeProvider` to include `<MatrixRain />`:
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  themes={["dark", "matrix"]}
  disableTransitionOnChange
>
  <MatrixRain />
  {children}
  <Toaster />
  <Analytics />
</ThemeProvider>
```

**Step 2: Ensure page content sits above the canvas**

The canvas has `z-index: 0`. The existing header has `z-index: 50` via `.header` class. Verify the `<body>` or root layout wrapper doesn't need an explicit `position: relative` — if content appears behind the canvas, add `relative z-10` to the main content wrapper in `app/(root)/layout.tsx`.

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount MatrixRain in root layout inside ThemeProvider"
```

---

### Task 5: Create the ThemeSwitcher component

**Files:**
- Create: `components/ThemeSwitcher.tsx`

**Context:**
Client component using `useTheme`. Uses shadcn `DropdownMenu` (already used in `UserDropdown`). Shows Moon icon for dark theme, Terminal icon for matrix theme. The `mounted` guard prevents hydration mismatch.

**Step 1: Create `components/ThemeSwitcher.tsx`**

```tsx
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
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add components/ThemeSwitcher.tsx
git commit -m "feat: add ThemeSwitcher component with dark/matrix options"
```

---

### Task 6: Add ThemeSwitcher to the Header

**Files:**
- Modify: `components/Header.tsx`

**Context:**
`Header.tsx` is a server component (async). Client components can be rendered inside server components in Next.js App Router. Add `ThemeSwitcher` between `<nav>` and `<UserDropdown>`, wrapped in a flex container.

**Step 1: Update `components/Header.tsx`**

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

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors

**Step 3: Verify in browser**

```bash
npm run dev
```

Open http://localhost:3000. You should see a Moon icon in the header. Click it — dropdown shows "Dark" and "Matrix". Selecting Matrix should:
- Turn the background black with green tints
- Show green text throughout
- Display the subtle falling character rain in the background

**Step 4: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add ThemeSwitcher to header"
```

---

### Task 7: Smoke test both themes

**Manual checklist — open http://localhost:3000 and verify each in both Dark and Matrix themes:**

- [ ] Auth pages (`/sign-in`, `/sign-up`) — backgrounds, inputs, buttons
- [ ] Dashboard/home — cards, news items, heatmap widget
- [ ] Stock detail page (`/stocks/AAPL`) — chart widget, watchlist button, company info
- [ ] Watchlist page — table rows, alerts panel
- [ ] Header — logo, nav, theme switcher, user dropdown
- [ ] Search (Cmd+K) — dialog background matches theme
- [ ] Matrix rain — visible but subtle, does not block clicks, disappears when switching to Dark

**If any component appears behind the rain canvas:**
- Add `relative z-10` to `app/(root)/layout.tsx` main wrapper

**If text is hard to read in Matrix theme:**
- Increase `--muted-foreground` brightness in the `.matrix` block in `globals.css`

**Final commit**

```bash
git add -A
git commit -m "feat: matrix theme complete — dark/matrix switcher with rain animation"
```
