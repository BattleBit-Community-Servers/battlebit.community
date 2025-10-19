# BattleBit Community Servers

A pure TypeScript/React website built with Bun runtime - converted from Next.js to a lightweight, high-performance static site.

## ⚡ Quick Start

```bash
# Install dependencies
bun install

# Start development server (port 6969)
bun run dev

# Or build for production
bun run build

# Serve production build (port 3100)
bun run start
```

**Note:** This project uses **Tailwind CSS v4** with PostCSS and Autoprefixer for optimal browser compatibility.

## 🚀 Features

- **Pure TSX/React**: No Next.js framework overhead
- **Bun Runtime**: Blazing fast development and production server using Bun's native HTTP server and bundler
- **Tailwind CSS v4**: Latest version with PostCSS and Autoprefixer
- **TypeScript**: Full type safety throughout the application
- **Custom Fonts**: Geist Sans and Geist Mono variable fonts
- **GitHub API Integration**: Real-time contributor fetching with smart caching
- **Avatar Proxy**: Server-side avatar caching for optimal performance
- **Production Optimized**: Hash-based asset names, minification, and source maps

## 📁 Project Structure

```
├── public/              # Static assets
│   ├── index.html      # Main HTML template
│   ├── styles.css      # Compiled Tailwind CSS (generated)
│   ├── fonts/          # Font files (Geist Sans & Mono)
│   └── BBCS_White_Large.svg
├── src/
│   ├── components/     # React components
│   │   ├── App.tsx    # Main application component
│   │   ├── BobbingArrow.tsx
│   │   └── Contributors.tsx
│   ├── styles/
│   │   └── globals.css # Global styles with Tailwind v4
│   ├── main.tsx       # React entry point
│   └── index.ts       # Bun HTTP server & build tool
├── dist/               # Production build output (generated)
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0

### Installation

```bash
bun install
```

### Development Server

```bash
bun run dev
```

The site will be available at `http://localhost:6969`

### How It Works

The development server (`src/index.ts`) provides:

#### Development Mode (`bun run dev`)
- **Bun.serve()**: Native HTTP server on port 6969
- **Static file serving**: Serves files from `public/` directory
- **On-the-fly bundling**: Bundles React/TypeScript with inline source maps
- **CSS processing**: Compiles Tailwind CSS with PostCSS
- **API endpoints**: `/api/contributors` for GitHub data, `/avatar/:id` for cached avatars
- **Real-time TypeScript compilation**: No separate build step needed

#### GitHub Integration
- Fetches contributors from multiple repositories on startup
- Caches contributor data and avatars for 12 hours
- Avatar proxy reduces external requests and improves performance

## 🏗️ Production Build

```bash
bun run build
```

This command:
1. Builds Tailwind CSS with PostCSS and Autoprefixer
2. Cleans the `dist/` folder
3. Bundles React application with minification
4. Generates hash-based filenames for cache busting (e.g., `bundle.qytmmfv7.js`)
5. Creates source maps for debugging
6. Copies static assets (fonts, images, etc.)
7. Updates `index.html` with correct bundle references

Output directory: `./dist/`

### Production Server

```bash
bun run start
```

Runs the Bun HTTP server in production mode:
- Serves static files from `./dist/` on port 3100
- Provides the same API endpoints as development
- Includes proper caching headers for static assets
- SPA fallback routing to `index.html`

### Build CSS Only

```bash
bun run build:css
```

Compiles Tailwind CSS to `public/styles.css` without building the entire application.

## 🎨 Styling

The project uses **Tailwind CSS v4** with PostCSS:

### Configuration Files
- `tailwind.config.js`: Tailwind v4 configuration with content paths
- `postcss.config.js`: PostCSS plugins (Tailwind CSS, Autoprefixer)
- `src/styles/globals.css`: Tailwind imports and custom CSS

### CSS Processing
- Development: CSS compiled on server start via `bun run dev`
- Production: CSS compiled during build process
- Output: `public/styles.css` (dev) or `dist/styles.css` (prod)
- Modern CSS features with Autoprefixer for browser compatibility
- Gradient syntax: `bg-[linear-gradient(...)]` for custom gradients

## 📝 Components

### App.tsx
Main application component with three full-screen sections:
1. **Hero section**: Organization branding with logo and tagline
2. **Projects showcase**: Repository cards with descriptions and links
3. **Team display**: GitHub contributors with avatars and profiles

### Contributors.tsx
- Fetches contributors from `/api/contributors` endpoint
- Displays avatars using the `/avatar/:id` proxy
- Excludes bot accounts and specified users
- Aggregates data from multiple repositories

### BobbingArrow.tsx
Animated scroll indicator with smooth CSS animations

## 🔌 API Endpoints

The server provides two API endpoints:

### `GET /api/contributors`
Returns cached contributor data from GitHub API.
- Fetches from multiple repositories
- Updates every 12 hours
- Filters out bots and excluded users

### `GET /avatar/:userId`
Proxies and caches GitHub avatars.
- Reduces external API calls
- Returns cached images with proper headers
- Cache-Control: `public, max-age=86400` (24 hours)

## 🔧 Configuration Files

### `src/styles/globals.css`
Tailwind v4 CSS with `@import` directives and custom styles

### `tailwind.config.js`
- Content paths for Tailwind scanning
- Theme customization
- Plugin configuration

### `postcss.config.js`
PostCSS plugins:
- `@tailwindcss/postcss`: Tailwind CSS v4
- `autoprefixer`: Vendor prefixes for browser compatibility

### `tsconfig.json`
TypeScript configuration for React and Bun

### `package.json`
Scripts:
- `dev`: Start development server
- `build`: Build for production
- `build:css`: Build CSS only
- `start`: Serve production build

## 🚀 Why Bun?

This project leverages Bun's capabilities:
- **Fast bundling**: Bun's built-in bundler is significantly faster than webpack/vite
- **Native TypeScript**: No need for ts-node or additional transpilers
- **HTTP server**: Built-in `Bun.serve()` provides a production-ready server
- **File serving**: Efficient static file serving with `Bun.file()`
- **All-in-one**: Bundler, runtime, package manager in a single tool
- **Modern output**: ESM modules, hash-based naming, tree-shaking

## 📦 Dependencies

### Production
- `react`: ^19.2.0 - UI library
- `react-dom`: ^19.2.0 - React DOM renderer
- `@tailwindcss/postcss`: ^4.1.14 - Tailwind CSS v4 PostCSS plugin

### Development
- `tailwindcss`: ^4.1.14 - CSS framework
- `postcss`: ^8.5.6 - CSS transformation tool
- `autoprefixer`: ^10.4.21 - PostCSS plugin for vendor prefixes
- `@types/bun`: latest - Bun TypeScript definitions
- `@types/react`: ^19.2.2 - React TypeScript definitions
- `@types/react-dom`: ^19.2.2 - React DOM TypeScript definitions
- `typescript`: ^5 (peer dependency)

## 🌐 Deployment

### Static Hosting

After running `bun run build`, the `dist/` folder contains a complete static site that can be deployed to:
- **Vercel**: Upload the `dist/` folder or connect GitHub repo
- **Netlify**: Drag & drop `dist/` or configure build command
- **Cloudflare Pages**: Connect repo with build command `bun run build`
- **GitHub Pages**: Upload `dist/` contents
- **AWS S3 + CloudFront**: Static website hosting

### Server Deployment

For full functionality (GitHub API caching, avatar proxy), deploy the Bun server:

```bash
# On your server
git clone <repository>
cd battlebit.community-rework
bun install
bun run build
PORT=3100 bun run start
```

**Recommended platforms:**
- **Fly.io**: Native Bun support with Dockerfile
- **Railway**: Supports Bun runtime
- **VPS/Cloud**: DigitalOcean, Linode, AWS EC2 with Bun installed

### Environment Variables

```bash
PORT=3100  # Server port (optional, defaults to 3100 for production)
```

### Docker Deployment (Optional)

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3100
CMD ["bun", "src/index.ts", "serve"]
```

## 📄 License

