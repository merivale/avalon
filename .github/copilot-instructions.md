# Avalon

## Project Overview

This is a web-based implementation of the social deduction game Avalon, built
with **Deno**, **TypeScript**, and **Preact**. The application uses Server-Sent
Events (SSE) for real-time game state updates and Deno KV for persistence.

The implementation is all on the server side, with Preact used for rendering
HTML templates. There is no client-side interactivity beyond what is available
with standard HTML forms and links. The only client-side JavaScript is for
subscribing to SSE updates, which send updated HTML fragments to replace the
game content.

## Tech Stack

- **Runtime**: Deno (with `--unstable-kv` flag)
- **Frontend**: Preact with JSX precompilation
- **Backend**: Native Deno HTTP server
- **Persistence**: Deno KV (key-value store)
- **Real-time**: Server-Sent Events (SSE)
- **Testing**: Deno's built-in test runner with `@std/assert` and `@std/testing`
- **Styling**: Custom CSS with utility classes

## Project Structure

- `/core` Pure game logic (no side effects, no I/O)
- `/server` HTTP server, routing, handlers, persistence
  - `/handlers` Request handlers for actions, pages, assets, SSE
  - `/persistence` Deno KV database operations
  - `/utils` Session management, response utilities
- `/ui` Preact components (rendered server-side)
  - `/components` Game-specific UI components
  - `/elements` Reusable UI primitives (Button, Card, Input, etc.)
- `/client` Client-side JavaScript (minimal, only for SSE)

## Key Architectural Patterns

### 1. Core Game Logic (`/core`)

- **Pure functions only** - no side effects, no database calls, no I/O
- All game state mutations return new objects (immutable updates)
- Validation functions return detailed error information
- Action functions assume valid input; validation functions are called
  beforehand in handlers

### 2. Server Architecture (`/server`)

- **Routing**: Simple pattern matching to map requests to handler functions
- **Handlers**: Each handler function processes requests, performs validation,
  updates game state via core functions, and returns HTML responses
- **Session management**: Player ID stored in cookie, can be overridden by a URL
  param for easy development/testing
- **Persistence**: Deno KV used for storing/retrieving game and player data,
  some fixtures provided for easy development/testing
- **SSE for real-time updates**: `handleGameEvents` maintains persistent
  connections, sending full game HTML updates on state changes
- **Forms and actions**: Standard HTML forms with POST requests, server
  redirects back to game page after processing

### 3. UI Rendering (`/ui` and `/client`)

- **Server-side rendering** with Preact's `preact-render-to-string`
- Components are **pure functions** returning VNodes
- Client-side JavaScript is minimal (only SSE subscription in `client/main.js`)
- SSE sends updated HTML fragments that replace `#content` div

## Coding Conventions

- **Strict compiler options**:
  - `noUncheckedIndexedAccess: true` (always check array/object access)
  - `noImplicitOverride: true`
- **Import paths**: Use `@/` alias for root-relative imports
- **Type imports**: Use `import type` for type-only imports
- Arrow functions for all functions
- Prefer one function/component per file
- Prefer pure functions and immutability
