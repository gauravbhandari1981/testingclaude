# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static frontend-only project with no build system, package manager, or server. Open files directly in a browser.

```
open photovault/index.html
open scifi.html
```

## Architecture

### PhotoVault (`photovault/`)

A zero-dependency, client-side photo gallery. No frameworks, no build step.

- `app.js` owns all state: a `photos` array of `{ url, name, size }` objects where `url` is a `Blob URL` created via `URL.createObjectURL`. URLs must be revoked on delete to avoid memory leaks (`URL.revokeObjectURL`).
- Gallery renders via DOM manipulation only — `rebuildGallery()` clears and re-renders all cards from the `photos` array after any deletion.
- Lightbox tracks the current image by index into `photos`. Navigation wraps around.
- Upload accepts drag-and-drop onto `#dropzone` or `<input type="file" multiple>` — both funnel into `addFiles(FileList)`.

### `scifi.html`

Single self-contained file. Animated star field runs on a `<canvas>` via `requestAnimationFrame`. No external dependencies.
