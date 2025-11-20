# Scripting Documentation Taxonomy

**Site:** create.secondlife.io
**Base Path:** `/script/`

This document defines the information architecture for the scripting section of Second Life's creation documentation site. The structure supports both LSL (Linden Scripting Language) and SLua (Lua for Second Life).

---

## Design Principles

1. **Progressive Learning Path**: Getting Started → Learn → Guides → Recipes → Reference
   - Beginners start with "getting-started" and follow tutorials in "learn"
   - Intermediate users jump to "guides" for deeper topics
   - All users reference "recipes" for quick solutions
   - "reference" is comprehensive API documentation

2. **Language-Agnostic Structure**: Most top-level sections work for both LSL and SLua
   - Only "learn" section splits by language since fundamentals differ
   - Functions/events/constants are shared (with SLua-specific additions)
   - Guides and recipes can include code examples in both languages using tabs

3. **Flat, Discoverable Hierarchy**: Maximum 3 levels deep
   - Easier navigation and search
   - Clear mental model for users
   - Better for SEO and linking

4. **Clear Content Types**:
   - **Getting Started**: Onboarding for absolute beginners
   - **Learn**: Systematic language tutorials
   - **Guides**: Topic-deep dives (vehicles, HTTP, pathfinding)
   - **Recipes**: Task-focused solutions (door, chair, teleporter)
   - **Reference**: Comprehensive API docs

5. **Migration-Friendly**: SLua includes "from-lsl" subsection to help LSL scripters transition

---

## Site Structure

```
script/
├── index.md                          # Scripting portal landing page
│
├── getting-started/
│   ├── index.md                      # Quick intro for beginners
│   ├── your-first-script.md          # Tutorial: Hello World
│   ├── editor-setup.md               # VS Code extension setup
│   └── lsl-vs-slua.md               # Choosing your language
│
├── learn/
│   ├── lsl/                          # LSL Language Tutorial
│   │   ├── index.md                  # LSL overview
│   │   ├── basics.md                 # Variables, types, operators
│   │   ├── control-flow.md           # if, while, for, do-while
│   │   ├── functions.md              # Defining functions
│   │   ├── states-events.md          # State machines & events
│   │   └── lists-strings.md          # Working with lists & strings
│   │
│   └── slua/                         # SLua Language Tutorial
│       ├── index.md                  # SLua overview & why Lua
│       ├── basics.md                 # Variables, types, operators
│       ├── control-flow.md           # if, while, for, repeat
│       ├── functions.md              # Function definitions
│       ├── tables.md                 # Tables & arrays
│       ├── metatables.md             # Metatables & OOP
│       ├── error-handling.md         # pcall, error handling
│       ├── libraries.md              # Standard Lua libraries
│       ├── ll-events.md              # LLEvents
│       ├── ll-timers.md              # LLTimers
│       └── from-lsl/                 # Migration guides
│           ├── index.md              # Migration overview
│           ├── datatypes.md          # Type differences
│           ├── operators.md          # Operator differences
│           ├── control-flow.md       # Loop differences
│           ├── functions.md          # Function differences
│           ├── events.md             # Event handling
│           ├── lists.md              # Lists vs tables
│           └── strings.md            # String handling
│
├── guides/                           # Long-form topic guides
│   ├── index.md                      # Guides overview
│   ├── http-requests.md              # Working with HTTP
│   ├── vehicle-physics.md            # Scripting vehicles
│   ├── pathfinding.md                # Pathfinding & navigation
│   ├── experience-tools.md           # Experience permissions
│   ├── mesh-animation.md             # Animating mesh
│   └── inventory-management.md       # Managing inventory
│
├── recipes/                          # Short, focused how-tos
│   ├── index.md                      # Recipes overview
│   ├── door.md                       # How to script a door
│   ├── chair.md                      # How to script a chair
│   ├── teleporter.md                 # How to script a teleporter
│   ├── chat-commands.md              # Adding chat commands
│   ├── touch-giver.md                # Creating a vendor/giver
│   └── particle-effects.md           # Particle effect presets
│
└── reference/                        # API Reference
    ├── lsl/
    │   ├── index.md                  # LSL reference overview
    │   ├── functions/                # Individual function pages
    │   │   ├── index.md              # Functions overview (searchable/filterable)
    │   │   ├── llSay.mdx
    │   │   ├── llListen.mdx
    │   │   └── ...                   # (auto-generated from lsl_definitions.yaml)
    │   ├── events/
    │   │   ├── index.md              # Events overview
    │   │   ├── state_entry.md
    │   │   ├── touch_start.md
    │   │   └── ...
    │   └── constants/
    │       ├── index.md              # Constants overview (searchable)
    │       ├── agent.md              # AGENT_* constants
    │       ├── permissions.md        # PERMISSION_* constants
    │       └── ...                   # Grouped by prefix/category
    │
    └── slua/
        ├── index.md                  # SLua reference overview
        ├── functions/                # ll* functions (same as LSL)
        ├── events/                   # Event handling reference
        ├── constants/                # Constants reference
        └── libraries/                # SLua-specific libraries
            ├── index.md
            ├── ll-events.md          # LLEvents API
            ├── ll-timers.md          # LLTimers API
            └── luau.md               # Luau standard library
```

---

## Content Type Definitions

### Scripting Portal (`/script/`)
Landing page with the goal of routing users to their destination as quickly as possible. Features:
- Quick links for different user types (beginner, LSL scripter, experienced)
- Recent updates and new features
- Popular guides and recipes
- Search functionality

### Getting Started (`/script/getting-started/`)
Onboarding content for absolute beginners:
- No prior scripting knowledge assumed
- Step-by-step first script tutorial
- Editor setup instructions
- Guidance on choosing LSL vs SLua

### Learn (`/script/learn/`)
Systematic language tutorials teaching fundamentals:
- **LSL section**: State-based scripting, LSL-specific patterns
- **SLua section**: Lua fundamentals, modern scripting concepts
- **SLua from-lsl**: Migration guides leveraging existing LSL knowledge
- Progressive difficulty within each section
- Hands-on examples and exercises

### Guides (`/script/guides/`)
Long-form, topic-focused articles explaining complex concepts:
- Deep dives into specific domains (vehicles, HTTP, pathfinding)
- Multiple approaches and best practices
- Advanced techniques and optimizations
- Both LSL and SLua examples (using tabs)
- Example: "Scripting Vehicles" covers Physical Linden Vehicles, raycast vehicles, custom physics, non-physical movement, wearable vehicles

### Recipes (`/script/recipes/`)
Short, task-focused how-tos with working examples:
- Single, specific task (e.g., "How to script a door")
- Copy-paste-ready code with explanations
- Beginner-friendly
- Both LSL and SLua versions
- Quick solutions for common needs

### Reference (`/script/reference/`)
Comprehensive API documentation:
- **Functions**: Auto-generated from `lsl_definitions.yaml` with custom examples
- **Events**: Complete event reference with parameters and usage
- **Constants**: Searchable/filterable constant reference, grouped by category
- **SLua Libraries**: Documentation for LLEvents, LLTimers, Luau standard library
- Searchable and filterable overview pages
- Consistent formatting across all entries

---

## Implementation Notes

### Navigation
- Primary navigation shows all top-level sections
- Section index pages provide secondary navigation within that section
- Breadcrumbs for deep pages
- Related content links at bottom of pages

### Code Examples
- Use Starlight's `<Tabs>` and `<TabItem>` components for LSL/SLua side-by-side
- Syntax highlighting for both languages
- Copy buttons on all code blocks
- Link to relevant reference pages from examples

### Search & Discovery
- Full-text search across all content
- Tag-based filtering (topics: physics, communication, inventory, etc.)
- Function/event/constant search on reference index pages
- Related content suggestions

### Auto-Generated Content
- Function reference pages generated from `context/lsl_definitions.yaml`
- Custom content preservation between generations (<!-- CUSTOM_CONTENT_START --> markers)
- Consistent metadata and formatting

### Cross-Linking Strategy
- Learn pages link to relevant reference pages
- Guides link to related recipes
- Recipes link to guides for deeper understanding
- All content links to reference documentation
- Reference pages include "See also" sections

### Future Expansion
This taxonomy is designed to scale:
- `/build/` section can follow similar patterns (getting-started, learn, guides, recipes, reference)
- `/avatar/` section for avatar creation content
- Top-level structure remains consistent across domains

---

## Content Migration Plan

### From context/wiki.secondlife.com/
- Extract and modernize wiki content
- Convert MediaWiki markup to Markdown/MDX
- Update examples and best practices
- Distribute to appropriate sections (guides, recipes, learn)

### From context/slua-guide/
- **language1.md, language2.md** → `/learn/slua/` tutorial pages
- **moving-*.md** → `/learn/slua/from-lsl/` migration guides
- **scripts-*.md** → `/recipes/` or `/guides/` depending on complexity
- Modernize formatting and integrate with site design

### From context/lsl_definitions.yaml
- Auto-generate `/reference/lsl/functions/` pages
- Extract constants for `/reference/lsl/constants/`
- Extract events for `/reference/lsl/events/`
- Maintain generation script in `/scripts/`

---

## Success Metrics

A successful taxonomy enables users to:
1. **Find content quickly**: Clear labels, logical grouping, effective search
2. **Learn progressively**: Natural path from beginner to advanced
3. **Solve problems**: Recipes for quick solutions, guides for deep understanding
4. **Reference easily**: Fast lookup of functions, events, constants
5. **Transition smoothly**: LSL scripters can migrate to SLua with clear guidance
