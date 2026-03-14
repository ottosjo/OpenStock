# Matrix Theme + Theme Switcher Design

## Overview

Add a Matrix visual theme to OpenStock alongside a theme switcher in the header. The existing default dark theme is preserved. Users can toggle between themes via a small dropdown in the header. No new libraries are required.

## Color Palette

| Role | Default Dark | Matrix |
|------|-------------|--------|
| Background | `#050505` | `#000000` pure black |
| Card/surface | `#141414` | `#050f05` black with green tint |
| Surface elevated | `#212328` | `#0a1a0a` |
| Border | `#30333A` | `#0d2b0d` dark green |
| Primary accent | `#0FEDBE` teal | `#00FF41` matrix green |
| Secondary accent | — | `#008F11` medium green |
| Text primary | off-white | `#00FF41` matrix green |
| Text muted | `#9095A1` | `#1a6b1a` dim green |
| Positive/up | green | `#00FF41` bright green |
| Negative/down | red | `#FF3333` red |

## Matrix Rain Animation

A canvas element fixed to the viewport background, rendered only when the Matrix theme is active.

- **Characters:** Katakana + digits (0–9) + a few latin letters
- **Opacity:** 10–15% — subtle, atmospheric, does not impede readability
- **Color:** `#00FF41` matrix green
- **Behavior:** Columns of characters fall at varied speeds; leading character is brighter, trailing characters fade
- **Performance:** Uses `requestAnimationFrame`, canvas cleared each frame with semi-transparent black overlay to create trail fade effect
- **Lifecycle:** Component mounts/unmounts with theme; animation loop cancelled on unmount via cleanup in `useEffect`

## Architecture

### 1. CSS Variables (`app/globals.css`)
Add a `.matrix` class block alongside `.dark`, mapping the same CSS custom property names to matrix values. Also update custom color tokens with matrix-specific values.

### 2. `next-themes` Configuration (`app/layout.tsx`)
Change `ThemeProvider` to `attribute="class"`, `defaultTheme="dark"`, `themes={["dark", "matrix"]}`.

### 3. MatrixRain Component (`components/MatrixRain.tsx`)
Client component. Renders a `<canvas>` fixed to the full viewport, `z-index: 0`, pointer-events none. Runs the falling character animation. Only mounted when theme is `"matrix"`.

### 4. Theme Switcher Component (`components/ThemeSwitcher.tsx`)
Client component. Small icon button in the header using shadcn `DropdownMenu`. Shows Moon icon for dark, Terminal icon for matrix.

### 5. Root Layout Integration (`app/layout.tsx`)
Mount `<MatrixRain />` inside the ThemeProvider (conditionally renders itself based on theme).

### 6. Header Integration (`components/Header.tsx`)
Mount `<ThemeSwitcher />` in the header alongside existing nav items.

## What Changes

- `app/globals.css` — add `.matrix` CSS variable block + color tokens
- `app/layout.tsx` — add ThemeProvider + MatrixRain
- `components/MatrixRain.tsx` — new canvas animation component
- `components/ThemeSwitcher.tsx` — new theme picker UI component
- `components/Header.tsx` — add ThemeSwitcher to header

## What Does NOT Change

- No new libraries
- No changes to shadcn component internals
- TradingView widget background gets matrix overrides via CSS
- All existing utility classes continue to work via CSS variable inheritance
