# Second Life Creation Portal

Official documentation for building and scripting in Second Life at **[create.secondlife.com](https://create.secondlife.com)**.

## About

This site provides comprehensive documentation for Second Life creators, covering:

- **LSL (Linden Scripting Language)** - Complete language reference, guides, and examples
- **SLua (Second Life Lua)** - Modern scripting with Luau, including migration guides from LSL
- **Building & Construction** - Tutorials and reference materials for creating in Second Life

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server at http://localhost:4321
pnpm dev

# Build for production
pnpm build
```

## Contributing

We welcome contributions! **Please discuss significant changes before starting work** to ensure alignment with project goals.

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Communication channels (Discord, GitHub Issues, forums)
- Setup and development workflow
- Documentation style guide
- How to add or modify content

## Project Structure

```
src/
├── content/docs/          # Documentation (Markdown/MDX)
│   ├── script/           # LSL & SLua documentation
│   └── build/            # Building documentation
├── components/           # Astro components
├── definitions/          # LSL/SLua language definitions (YAML)
└── assets/              # Images and media
```

## Communication

- **Discord** - [Second Life Official](https://discord.gg/secondlifeofficial) (`#scripting-*` channels)
- **GitHub Issues** - [Report bugs or suggest improvements](https://github.com/secondlife/create/issues)
- **Feedback Forum** - [feedback.secondlife.com](https://feedback.secondlife.com)

## License

This documentation is open source. Code examples may be used freely in Second Life scripts.

## Links

- [Live Site](https://create.secondlife.com)
- [Contributing Guide](CONTRIBUTING.md)
- [Detailed Project Guidance](CLAUDE.md)
