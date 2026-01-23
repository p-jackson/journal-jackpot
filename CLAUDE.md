# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # start dev server (press i for iOS, a for Android, w for web)
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # web browser
```

## Architecture

Expo React Native app using:
- **expo-router** - file-based routing in `app/` dir
- **NativeWind v5** (preview) + **Tailwind CSS v4** for styling
- **React Native new arch** enabled

### Routing

Routes live in `app/`. `_layout.tsx` = layout wrapper, `index.tsx` = home screen. Stack navigator by default.

### Styling

NativeWind v5 + Tailwind v4 configured via:
- `global.css` - Tailwind v4 imports + `@source` directives for content paths
- `postcss.config.mjs` - uses `@tailwindcss/postcss` plugin
- `metro.config.js` - wraps with `withNativeWind(config)`
- `nativewind-env.d.ts` - TypeScript types for `className` prop

Use `className="..."` with Tailwind classes on RN components.
