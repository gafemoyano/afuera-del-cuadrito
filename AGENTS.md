# AGENTS.md - AI Agent Guide for Afuera del Cuadrito

## Project Overview

**Name**: Afuera del Cuadrito  
**Type**: Personal blog built with Astro  
**Theme**: Based on Bookworm Light Astro theme  
**Owner**: Juliana Ramirez Munoz  
**Language**: Spanish (content), English (code)  
**Deployment**: Netlify (https://afueradelcuadrito.netlify.app)

## Tech Stack

| Technology   | Version | Purpose                        |
| ------------ | ------- | ------------------------------ |
| Astro        | 5.8.0   | Static site generator          |
| React        | 19.x    | Interactive components         |
| TypeScript   | 5.8.x   | Type safety                    |
| Tailwind CSS | 4.x     | Styling (via Vite plugin)      |
| Node.js      | 22.11.0 | Runtime (see `.tool-versions`) |
| SveltiaCMS   | latest  | Git-based headless CMS         |

## Quick Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (localhost:4321)
npm run build    # Production build
npm run preview  # Preview production build
npm run format   # Format code with Prettier
```

## Project Structure

```
afuera-del-cuadrito/
├── src/
│   ├── config/              # JSON configuration files
│   │   ├── config.json      # Site metadata, settings
│   │   ├── theme.json       # Colors, fonts
│   │   ├── menu.json        # Navigation menus
│   │   └── social.json      # Social media links
│   │
│   ├── content/             # Content collections (Markdown/MDX)
│   │   ├── posts/           # Blog posts
│   │   ├── pages/           # Static pages
│   │   └── about/           # About page (singleton)
│   │
│   ├── layouts/             # Layout components
│   │   ├── Base.astro       # HTML document wrapper
│   │   ├── PostSingle.astro # Single blog post layout
│   │   ├── Posts.astro      # Post list layout
│   │   ├── components/      # Reusable Astro components
│   │   ├── partials/        # Header, Footer
│   │   └── shortcodes/      # React components for MDX
│   │
│   ├── lib/                 # Utilities
│   │   ├── contentParser.astro   # Content collection helpers
│   │   ├── taxonomyParser.astro  # Tag/category helpers
│   │   └── utils/           # Utility functions
│   │
│   ├── pages/               # Astro pages (file-based routing)
│   │   ├── index.astro      # Homepage
│   │   ├── [regular].astro  # Dynamic pages from content
│   │   ├── tags/            # Tag pages
│   │   └── page/            # Paginated lists
│   │
│   ├── styles/              # CSS files
│   │   ├── main.css         # Entry point (imports others)
│   │   ├── base.css         # Base styles
│   │   ├── components.css   # Component styles
│   │   └── navigation.css   # Navigation styles
│   │
│   ├── tailwind-plugin/     # Custom Tailwind plugins
│   │   ├── tw-theme.mjs     # Theme colors/fonts from config
│   │   └── tw-bs-grid.mjs   # Bootstrap-style grid
│   │
│   └── content.config.ts    # Content collection schemas
│
├── public/
│   ├── admin/               # SveltiaCMS admin panel
│   │   ├── index.html
│   │   └── config.yml       # CMS configuration
│   └── images/              # Static images
│
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
└── netlify.toml             # Netlify deployment config
```

## Path Aliases

Defined in `tsconfig.json`:

| Alias            | Path                         |
| ---------------- | ---------------------------- |
| `@/components/*` | `./src/layouts/components/*` |
| `@/shortcodes/*` | `./src/layouts/shortcodes/*` |
| `@/helpers/*`    | `./src/layouts/helpers/*`    |
| `@/partials/*`   | `./src/layouts/partials/*`   |
| `@/*`            | `./src/*`                    |

**Always use path aliases** instead of relative imports.

## Content Collections

Defined in `src/content.config.ts`:

### Posts (`src/content/posts/*.md`)

```yaml
---
title: string # Required
meta_title: string # Optional (SEO)
description: string # Optional
date: date # Optional
image: string # Optional (featured image)
tags: string[] # Default: []
draft: boolean # Optional
---
```

### Pages (`src/content/pages/*.md`)

```yaml
---
title: string # Required
meta_title: string # Optional
description: string # Optional
image: string # Optional
layout: string # Optional
draft: boolean # Optional
---
```

### About (`src/content/about/-index.md`)

Singleton page with similar schema to pages.

## Configuration Files

### `src/config/config.json`

Site-wide settings:

- `site`: title, base_url, favicon, logo
- `settings`: pagination count, summary length
- `metadata`: meta author, description, OG image
- `params`: copyright, contact form action
- `contactinfo`: address, email, phone

### `src/config/theme.json`

Visual theming:

- `colors.default.theme_color`: primary, body, border, light, dark
- `colors.default.text_color`: text, text-dark, text-light
- `fonts.font_family`: primary (Mulish), secondary
- `fonts.font_size`: base (16), scale (1.2)

### `src/config/menu.json`

Navigation structure:

- `main`: Header navigation items
- `footer`: Footer navigation items

## Key Patterns

### Layouts

- `Base.astro` wraps all pages with HTML head, Header, Footer
- Individual layouts (PostSingle, Posts) use `<Base>` as wrapper
- Components receive props, use `Astro.props` to destructure

### Content Fetching

```astro
---
import { getSinglePage } from "@/lib/contentParser.astro";
const posts = await getSinglePage("posts");
---
```

### React Shortcodes (MDX)

Located in `src/layouts/shortcodes/`. Auto-imported via `astro-auto-import`:

- `<Button>` - Styled button
- `<Accordion>` - Collapsible content
- `<Tabs>` / `<Tab>` - Tabbed content
- `<Notice>` - Alert/notification box
- `<Video>` / `<Youtube>` - Video embeds

### Styling

- Uses Tailwind CSS 4.x via Vite plugin
- Custom theme plugin (`tw-theme.mjs`) generates CSS variables from `theme.json`
- Bootstrap-style grid available via `tw-bs-grid.mjs`
- Use semantic classes: `.container`, `.section`, `.row`, `.col-*`

### Utility Functions (`src/lib/utils/`)

| Function       | File             | Purpose                   |
| -------------- | ---------------- | ------------------------- |
| `slugify`      | textConverter.ts | URL-safe slugs            |
| `markdownify`  | textConverter.ts | Markdown to HTML          |
| `humanize`     | textConverter.ts | Clean strings for display |
| `plainify`     | textConverter.ts | Strip HTML/markdown       |
| `dateFormat`   | dateFormat.ts    | Format dates              |
| `sortByDate`   | sortFunctions.ts | Sort posts by date        |
| `similerItems` | similarItems.ts  | Find related posts        |

## CMS (SveltiaCMS)

Admin panel at `/admin/` (or `localhost:4321/admin/` in dev).

### Configuration

- File: `public/admin/config.yml`
- Backend: GitHub (`gafemoyano/afuera-del-cuadrito`)
- Media folder: `public/images/uploads/`

### Collections

1. **Blog Posts** - Create/edit posts in `src/content/posts/`
2. **Pages** - Create/edit pages in `src/content/pages/`
3. **Special Pages** - Edit singleton pages like About

## Common Tasks

### Add a New Blog Post

1. Create `src/content/posts/my-post.md`
2. Add frontmatter (title, date, image, tags)
3. Write content in Markdown/MDX

### Add a New Page

1. Create `src/content/pages/my-page.md`
2. Add frontmatter (title, description)
3. Write content
4. Optionally add to `src/config/menu.json`

### Modify Site Metadata

Edit `src/config/config.json`

### Change Colors/Fonts

Edit `src/config/theme.json` - changes propagate via Tailwind plugin

### Add Navigation Item

Edit `src/config/menu.json`:

```json
{
  "name": "Link Name",
  "url": "/path"
}
```

### Create a New Component

1. Astro component: `src/layouts/components/MyComponent.astro`
2. React component (interactive): `src/layouts/shortcodes/MyComponent.tsx`
3. Import using path alias: `@/components/MyComponent.astro`

## Code Style

### Formatting

- Prettier configured (`.prettierrc`)
- Run `npm run format` before committing
- Astro files use `parser: "astro"`

### TypeScript

- Strict mode enabled
- Use explicit types for props interfaces
- Path aliases preferred over relative imports

### Component Conventions

- Astro components: PascalCase, `.astro` extension
- React components: PascalCase, `.tsx` extension
- Utility functions: camelCase, `.ts` extension
- Config files: kebab-case, `.json` extension

### CSS

- Use Tailwind utility classes primarily
- Custom styles in `src/styles/` when needed
- Theme colors via CSS variables: `text-primary`, `bg-light`, etc.

## Testing & Verification

```bash
# Type checking
npx astro check

# Build verification
npm run build

# Preview build
npm run preview
```

## Deployment

- **Platform**: Netlify
- **Build command**: `astro build`
- **Publish directory**: `dist`
- **Security headers**: Configured in `netlify.toml`

Auto-deploys on push to `master` branch.

## Important Notes for Agents

1. **Content is in Spanish** - Blog posts, UI labels are in Spanish
2. **Path aliases are mandatory** - Never use relative imports like `../../`
3. **Theme customization via JSON** - Don't hardcode colors/fonts in CSS
4. **React for interactivity only** - Use Astro components for static content
5. **Draft posts hidden** - Set `draft: true` to hide from production
6. **Images in public/images/** - Reference as `/images/path/to/image.png`
7. **CMS creates commits** - Content changes via CMS create git commits

## Troubleshooting

| Issue               | Solution                                       |
| ------------------- | ---------------------------------------------- |
| Styles not updating | Clear `.astro` cache, restart dev server       |
| Content not showing | Check `draft: false` in frontmatter            |
| Build fails         | Run `npx astro check` for type errors          |
| Images 404          | Ensure path starts with `/images/`             |
| CMS auth issues     | Check `public/admin/config.yml` backend config |
