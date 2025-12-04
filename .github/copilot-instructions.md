# Copilot Instructions for Avalon (Deno + Fresh)

This project is a web implementation of Avalon using TypeScript, Deno, and Preact as a server-side templating library.

The codebase is fully functional. Use arrow functions everywhere, avoid classes and OOP, and prefer immutable data. Use type aliases instead of interfaces.

The implementation is all on the server side, with Preact used for rendering HTML templates. There is no client-side interactivity beyond what is available with standard HTML forms and links.

## Architecture

- **Language**: TypeScript
- **Framework**: Deno + JSX
- **Coding Style**: Functional, arrow functions only
- **Game Logic**: Pure functions for Avalon rules
- **CSS**: A utility-based approach like Tailwind CSS, but implemented manually with utility classes defined in CSS files
- **Testing**: E2E tests only using Deno's built-in testing framework and Playwright

### Folder Structure

- `/assets`: images and CSS files
- `/components`: Reusable Preact components (for shared UI elements in the pages)
- `/core`: Core game logic
- `/handlers`: HTTP request handlers
- `/pages`: Preact components representing pages/routes
- `/tests`: E2E tests using Playwright
- `/utils`: Reusable utility functions not related to the game logic
- `/main.ts`: Server entry point
- `/deno.json`: Deno config

## Guidance for AI Agents

- Use arrow functions and functional style only
- Use type aliases instead of interfaces
- Validation functions should return null (no error) or string (error message)
- Functions should not throw errors, but assume valid inputs and that validation is done elsewhere
- Avoid classes, OOP, and mutable state
- For styling, use flexbox and grid layouts with gaps for spacing (don't use margins)
