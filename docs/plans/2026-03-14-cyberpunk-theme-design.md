# Cyberpunk Theme + Theme Switcher Design

## Overview

Add a Cyberpunk visual theme to OpenStock alongside a theme switcher in the header. The existing default dark theme is preserved. Users can toggle between themes via a small dropdown in the header. No new libraries are required — `next-themes` already supports custom theme class names.

## Color Palette

| Role | Default Dark | Cyberpunk |
|------|-------------|-----------|
| Background | `#050505` | `#0a0010` near-black with purple tint |
| Card/surface | `#141414` | `#0d001a` dark purple |
| Surface elevated | `#212328` | `#150025` |
| Border | `#30333A` | `#2a0050` with neon glow |
| Primary accent | `#0FEDBE` teal | `#00F5FF` electric cyan |
| Secondary accent | — | `#FF00AA` hot pink/magenta |
| Text primary | off-white | `#E0E0FF` cool lavender-white |
| Text muted | `#9095A1` | `#8080B0` muted purple-gray |
| Positive/up | green | `#39FF14` neon green |
| Negative/down | red | `#FF3060` hot red |

## Architecture

### 1. CSS Variables (`app/globals.css`)

Add a `.cyberpunk` class block alongside the existing `.dark` block, mapping the same CSS custom property names to cyberpunk values. Tailwind v4 picks these up automatically via the existing `@theme inline` mappings.

Also update the custom color palette (`@theme`) to include cyberpunk-specific tokens (neon cyan, pink, etc).

### 2. `next-themes` Configuration (`app/layout.tsx`)

Change `ThemeProvider` to use `attribute="class"` with `themes={['dark', 'cyberpunk']}`. The provider applies the theme class to `<html>`, which activates the correct CSS variable block.

### 3. Theme Switcher Component (`components/ThemeSwitcher.tsx`)

A small button/dropdown in the header that:
- Shows the current theme with an icon (moon for dark, zap for cyberpunk)
- On click, opens a minimal dropdown listing available themes
- Calls `setTheme()` from `useTheme()` hook
- Uses existing shadcn `DropdownMenu` primitives

### 4. Header Integration (`components/Header.tsx`)

Mount `<ThemeSwitcher />` in the header alongside existing nav items.

## What Changes

- `app/globals.css` — add `.cyberpunk` CSS variable block + new color tokens
- `app/layout.tsx` — update `ThemeProvider` themes list
- `components/ThemeSwitcher.tsx` — new component (theme picker UI)
- `components/Header.tsx` — add `<ThemeSwitcher />` to header

## What Does NOT Change

- No new libraries
- No changes to shadcn component internals
- No TradingView widget styling changes (those use hardcoded `#141414` — cyberpunk can map to its own dark bg)
- All existing utility classes in globals.css continue to work; cyberpunk overrides via CSS variable inheritance
