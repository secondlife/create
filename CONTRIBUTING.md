# Contributing to Second Life Creation Portal

Thank you for your interest in contributing to the Second Life Creation Portal! This guide will help you get started.

## Before You Start

**Please discuss significant changes before starting work.** This ensures your contribution aligns with project priorities and prevents duplicated effort.

## Communication Channels

- **GitHub Issues** - [Report bugs and suggest improvements](https://github.com/secondlife/create/issues)
- **Discord** - Join the [Second Life Official Discord](https://discord.gg/secondlifeofficial) for real-time discussion (see `#opensource-dev` channel)
- **Feedback Forum** - [feedback.secondlife.com](https://feedback.secondlife.com) for user-facing discussions and feature requests
- **Mailing List** - [opensource-dev](https://lists.secondlife.com/cgi-bin/mailman/listinfo/opensource-dev) for announcements and technical discussions

For substantial documentation changes, start a discussion in GitHub Issues or Discord before making a pull request.

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/secondlife/create.git
cd create

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Visit http://localhost:4321 to see your changes.

### Content Generation

The project auto-generates function and event reference pages from LSL definitions:

```bash
# Fetch latest LSL/SLua definitions from GitHub
pnpm fetch:definitions

# Generate all documentation (LSL + SLua functions and events)
pnpm generate:docs
```

## Contributing Documentation

### Where Content Lives

All documentation lives in `src/content/docs/` as Markdown (`.md`) or MDX (`.mdx`) files:

- `script/lsl-reference/` - LSL language reference
- `script/slua-reference/` - SLua language reference
- `script/guides/` - Scripting tutorials and guides
- `build/` - Building and construction documentation

### Writing Style

Use a **balanced, pragmatic tone**:

- Professional but approachable
- Explain the "why" behind concepts, not just the "what"
- Include practical code examples
- Assume readers have some Second Life experience
- Avoid marketing language or excessive enthusiasm

**Example:**
> "Tables are SLua's most powerful data structure. Unlike LSL's separate `list` type, tables serve two purposes: they work as both arrays (like LSL lists) and dictionaries/maps (which LSL doesn't have)."

### Adding New Pages

1. Create a `.md` or `.mdx` file in the appropriate directory
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
4. Update the sidebar in `astro.config.mjs` if needed (or rely on autogenerate)

### Modifying Function/Event References

Function and event reference pages are auto-generated from `src/definitions/lsl_definitions.yaml`:

1. **To update function/event metadata:** Edit the YAML file and run `pnpm generate:docs`
2. **To add examples and notes:** Add content after the component tag in the MDX file:
   ```mdx
   <LSLFunction />

   ## Examples

   Your custom content here...
   ```

Custom content is preserved when regenerating pages.

## Code Examples

### LSL Code Blocks

Use the `lsl` language identifier:

````markdown
```lsl
default {
    state_entry() {
        llSay(0, "Hello, World!");
    }
}
```
````

### SLua Code Blocks

Use `luau` (not `lua`) and **always include type annotations**:

````markdown
```luau
script.on("state_entry", function()
    Chat.say("Hello, World!")
end)
```
````

See [SLUA_REFERENCE.md](SLUA_REFERENCE.md) for detailed SLua documentation guidelines.

## Internationalization

The site supports additional languages. To add translated content:

1. Create localized directories: `docs/de/`, `docs/ja/`, etc.
2. Mirror the English structure
3. Translate content while preserving technical accuracy

## Project Structure

```
.
├── public/             # Static assets (favicons, etc.)
├── scripts/            # Build and generation scripts
├── src/
│   ├── assets/        # Images and media files
│   ├── components/    # Astro components
│   ├── content/
│   │   └── docs/      # Documentation content (Markdown/MDX)
│   ├── definitions/   # LSL/SLua language definitions (YAML)
│   └── styles/        # Custom CSS
├── astro.config.mjs   # Astro configuration
└── CLAUDE.md          # Detailed project guidance
```

## Licensing and Contributions

### Understanding the Licenses

This repository uses different licenses for different types of content:

**Documentation Text:**
- **New content** you contribute is licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Legacy wiki content** (pages with `<WikiAttribution>` component) remains under [CC-BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)

**Code Examples:**
- **All code examples** (LSL, SLua, JavaScript, etc.) must be contributed under [CC0 1.0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)
- This means anyone can use your code examples freely without attribution requirements

### What This Means for Contributors

By submitting a contribution, you agree that:

1. **Documentation text** (explanations, tutorials, guides) you write will be licensed under CC-BY 4.0
2. **All code examples** in your contribution are released to the public domain under CC0 1.0
3. You have the right to license your contributions under these terms
4. You understand that your contributions may be freely used by others under these licenses

### Special Considerations

**When editing legacy wiki content:**
- Pages marked with `<WikiAttribution>` are CC-BY-SA 3.0 licensed
- Substantial modifications to these pages may need to remain CC-BY-SA 3.0
- If you're unsure, ask in your pull request

**Code examples:**
- Keep code examples concise and focused on teaching concepts
- Don't include proprietary code or code you don't have rights to release
- All code examples automatically become public domain (CC0) when merged

## Pull Request Process

1. Fork the repository and create a feature branch
2. Make your changes following the style guidelines
3. Test locally with `pnpm dev`
4. Run type checking: `pnpm astro check`
5. Submit a pull request with a clear description of your changes
6. Confirm in your PR description that you agree to license your contribution under the appropriate license
7. Be responsive to feedback during review