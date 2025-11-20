# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Second Life's creation-focused documentation site, built with Astro + Starlight. The site is currently a basic template that will be built out starting with the LSL (Linden Scripting Language) portal. It covers both building and scripting aspects of Second Life content creation.

## Development Commands

All commands use pnpm:

- `pnpm install` - Install dependencies
- `pnpm dev` - Start dev server at http://localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm preview` - Preview production build locally
- `pnpm astro check` - Run TypeScript type checking
- `pnpm generate:docs` - Generate all reference pages (functions, events, and constants) for both LSL and SLua from src/definitions/lsl_definitions.yaml

## Architecture

### Content Organization

Documentation lives in `src/content/docs/` with two main areas:

**build/** - Building and construction documentation
- `build/guides/` - Build tutorials and guides
- `build/reference/` - Build reference materials

**script/** - Scripting documentation (primary focus: LSL portal)
- `script/guides/` - Scripting guides
- `script/lsl-reference/` - LSL language reference
- `script/slua-reference/` - SLua reference
- `script/learn-slua/` - SLua learning materials

Files are `.md` or `.mdx` format. Routes auto-generate from file paths (e.g., `docs/script/lsl-reference/example.md` → `/script/lsl-reference/example/`).

### Internationalization

Configured in `astro.config.mjs` with additional locales:
- `root` (English, default)
- `de` (German), `es` (Spanish), `fr` (French), `it` (Italian)
- `ja` (Japanese), `ko` (Korean), `nl` (Dutch), `pt` (Portuguese), `ru` (Russian)

To add translated content, create localized directories like `docs/de/`, `docs/ja/`, etc.

### Navigation

Sidebar configuration in `astro.config.mjs`:
- Manual entries: Define with `label` and `slug`
- Auto-generated: Use `autogenerate: { directory: 'reference' }` to include all files in a directory

### Configuration Files

- `astro.config.mjs` - Starlight integration, sidebar, locales
- `src/content.config.ts` - Content collections using Starlight's schema
- `tsconfig.json` - Extends Astro's strict TypeScript preset

## Documentation Tone and Style

**Approved Tone: Balanced & Pragmatic**

All documentation should use a balanced and pragmatic tone that:
- Is professional but approachable
- Maintains technical accuracy with clear explanations
- Acknowledges both benefits and challenges
- Respects the reader's existing knowledge (especially for LSL scripters and SL builders)
- Works well for both learning new concepts and later reference use

**Writing Guidelines:**
- Use "you" to address the reader directly
- Be clear and precise without being overly formal
- Explain the "why" behind concepts, not just the "what"
- Anticipate common confusion points (especially for LSL-to-SLua migration)
- Use code examples to illustrate concepts
- Avoid excessive enthusiasm or marketing language
- Don't oversimplify or condescend to the reader

**Example of preferred tone:**
> "Tables are SLua's most powerful data structure. Unlike LSL's separate `list` type, tables serve two purposes: they work as both arrays (like LSL lists) and dictionaries/maps (which LSL doesn't have)."

## Adding Documentation

1. Create `.md` or `.mdx` file in appropriate `src/content/docs/` subdirectory
2. Add frontmatter:
   ```yaml
   ---
   title: Page Title
   description: Brief description for SEO
   ---
   ```
3. For `.mdx`, import Starlight components as needed:
   ```mdx
   import { Card, CardGrid, Tabs, TabItem } from '@astrojs/starlight/components';
   ```
4. Update sidebar in `astro.config.mjs` if needed (or rely on autogenerate)

## Assets

- `src/assets/` - Images embedded in Markdown with relative links
- `public/` - Static assets (favicons, etc.) served directly

## Source Material

The repository includes reference materials in the `context/` directory (gitignored):

**context/lsl_definitions.yaml** - Comprehensive language definitions for both LSL and SLua, including:
- Constants with types, values, and tooltips
- Functions with signatures, parameters, return types, and descriptions
- Events and their parameters
- Function IDs for LSO compilation
- Structured in YAML format for programmatic processing

**context/wiki.secondlife.com/** - Exported MediaWiki markup from Second Life's current wiki:
- `constants/` - Constant documentation pages
- `functions/` - Function documentation pages
- `flow-control/` - Control flow documentation
- `lsl-portal/` - General LSL portal pages, tutorials, protocols, examples

**context/slua-guide/** - Suzanna's SLua Guide (https://suzanna-linn.github.io/slua/):
- Comprehensive educational resource for the SLua language
- Jekyll-based documentation with markdown files in `docs/` directory
- Content includes:
  - Language fundamentals: `language1.md`, `language2.md`
  - Migration guides for LSL scripters: `moving-*.md` files covering datatypes, events, functions, operators, lists, strings, control flow, and libraries
  - Practical examples: `scripts-*.md` files with working examples (coroutines, enums, floating texts, sets, web integration)
  - Reference materials: `classes.md`, `transpiler.md`, `beta.md`, `future.md`, `history.md`
- Licensed under Creative Commons Attribution 4.0 (text) and MIT License (code examples)
- Use as reference for SLua language documentation and migration patterns

**IMPORTANT: For SLua documentation guidelines, see [SLUA_REFERENCE.md](SLUA_REFERENCE.md)**
This file contains:
- Language basics and syntax differences from LSL
- Code style conventions and best practices
- Documentation patterns (tabs, code blocks, callouts)
- Type annotation guidelines (ALWAYS use types in examples)
- Common patterns and idioms (events, timers, error handling)
- Migration quick reference tables

**context/taxonomy.md** - Proposed site architecture and content taxonomy:
- Scripting portal structure with sections for Getting Started, Features, Guides, and Recipes
- Planned organization for SLua/LSL language documentation
- Standard library/reference organization patterns
- Site-wide SLua/LSL toggle considerations

These files are reference materials for building the new documentation. They should be transformed into clean, modern Markdown/MDX format in `src/content/docs/`.

## LSL Portal Development

The LSL portal is the initial focus area. Documentation should go in:
- `src/content/docs/script/lsl-reference/` - Language reference, functions, events, constants
- `src/content/docs/script/guides/` - Tutorials, examples, best practices

Consider organizing LSL content by:
- Language syntax and structure
- Built-in functions (organized by category)
- Events
- Constants and types
- Examples and common patterns

When building documentation, use `context/lsl_definitions.yaml` as the authoritative source for technical accuracy, and reference `context/wiki.secondlife.com/` for existing documentation patterns and examples.

## SLua Documentation Guidelines

**When creating or editing SLua documentation, always refer to [SLUA_REFERENCE.md](SLUA_REFERENCE.md) for:**
- Syntax conventions (use `luau` not `lua` for code blocks)
- Type annotation requirements (ALWAYS include types in examples)
- Documentation patterns (tabs, asides, code formatting)
- Common patterns and idioms
- LSL-to-SLua migration examples

## Reference Page Generation

The project includes an automated generator for creating LSL and SLua reference pages for functions, events, and constants:

**Generator Script:** `scripts/generate-docs.js`
- Parses `src/definitions/lsl_definitions.yaml` to extract definitions
- Supports both LSL and SLua/Luau generation
- Creates MDX pages with appropriate components (LSLFunction/SLuaFunction, LSLEvent/SLuaEvent, LSLConstant/SLuaConstant)
- Run with: `pnpm generate:docs`
- Generates pages in:
  - LSL functions: `src/content/docs/script/lsl-reference/functions/`
  - SLua functions: `src/content/docs/script/slua-reference/functions/`
  - LSL events: `src/content/docs/script/lsl-reference/events/`
  - SLua events: `src/content/docs/script/slua-reference/events/`
  - LSL constants: `src/content/docs/script/lsl-reference/constants/`
  - SLua constants: `src/content/docs/script/slua-reference/constants/`

**Custom Content Preservation:**
Generated pages support custom content that persists across regenerations. Any content after the component tag (e.g., `<LSLFunction />`, `<LSLEvent />`, `<LSLConstant />`) and before the optional attribution footer will be preserved when re-running the generator. This allows you to:
- Add usage examples
- Include additional notes and caveats
- Link to related functions, events, or constants
- Provide tutorials or best practices

**Generated Page Structure:**
1. Frontmatter with title and description
2. Component import statements
3. Reference component tag (LSLFunction/SLuaFunction, LSLEvent/SLuaEvent, or LSLConstant/SLuaConstant)
4. Custom content marker comment: `{/* DO NOT EDIT ABOVE THIS LINE */}`
5. Custom content section for examples, notes, and related links
6. Optional WikiAttribution footer (for LSL pages)

**Component Locations:**

Functions:
- `src/components/FunctionReference.astro` - Base function reference component
- `src/components/LSLFunction.astro` - LSL function wrapper
- `src/components/SLuaFunction.astro` - SLua function wrapper

Events:
- `src/components/EventReference.astro` - Base event reference component
- `src/components/LSLEvent.astro` - LSL event wrapper
- `src/components/SLuaEvent.astro` - SLua event wrapper

Constants:
- `src/components/ConstantReference.astro` - Base constant reference component
- `src/components/LSLConstant.astro` - LSL constant wrapper
- `src/components/SLuaConstant.astro` - SLua constant wrapper

These components dynamically load data from `src/definitions/lsl_definitions.yaml` at build time, requiring only the name as a prop. All metadata (signatures, parameters, types, values, energy costs, sleep times, badges) is loaded from the YAML file.

When importing custom components in MDX use the `@component` alias, ex.:
```mdx
import SLuaConstant from '@components/SluaConstant.astro';
```