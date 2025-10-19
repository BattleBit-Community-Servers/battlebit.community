#!/usr/bin/env bun

import { rm, mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const command = process.argv[2];

// GitHub API cache
const ORG_NAME = "BattleBit-Community-Servers";
const REPO_NAMES = ["BattleBitAPIRunner", "BBModules-Backend", "BBModules-Frontend"];
const EXCLUDED_USERS = ["JellisyWoes", "RainOrigami"];
let contributorsCache: any[] = [];
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const avatarCache = new Map<string, ArrayBuffer>();

async function fetchAndCacheAvatar(url: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    avatarCache.set(url, buffer);
    return buffer;
  } catch (error) {
    console.error(`Error fetching avatar ${url}:`, error);
    return null;
  }
}

async function fetchContributors() {
  console.log("🔄 Fetching GitHub contributors...");
  const allContributors: any[] = [];

  try {
    for (const repoName of REPO_NAMES) {
      const githubApiUrl = `https://api.github.com/repos/${ORG_NAME}/${repoName}/contributors`;
      const response = await fetch(githubApiUrl);

      if (!response.ok) {
        console.error(`Failed to fetch contributors for ${repoName}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const filteredContributors = data.filter((contributor: any) => {
        return (
          !contributor.login.endsWith("[bot]") &&
          !allContributors.some((c) => c.login === contributor.login) &&
          !EXCLUDED_USERS.includes(contributor.login)
        );
      });
      allContributors.push(...filteredContributors);
    }

    contributorsCache = allContributors;
    console.log(`✅ Cached ${allContributors.length} contributors`);
    
    // Prefetch avatars
    console.log("🖼️  Prefetching avatars...");
    for (const contributor of allContributors) {
      if (contributor.avatar_url) {
        await fetchAndCacheAvatar(contributor.avatar_url);
      }
    }
    
    // Also cache team member avatars
    const teamAvatars = [
      "https://avatars.githubusercontent.com/u/35661279?v=4",
      "https://avatars.githubusercontent.com/u/51454971?v=4"
    ];
    for (const avatarUrl of teamAvatars) {
      await fetchAndCacheAvatar(avatarUrl);
    }
    
    console.log(`✅ Cached ${avatarCache.size} avatars`);
  } catch (error) {
    console.error("Error fetching contributors:", error);
    contributorsCache = [];
  }
}

function startContributorsFetch() {
  // Fetch immediately on startup
  fetchContributors();
  
  // Then fetch every 12 hours
  setInterval(() => {
    fetchContributors();
  }, TWELVE_HOURS);
}

function showHelp() {
  console.log(`
🚀 BattleBit Community - Build & Serve Tool

USAGE:
  bun src/index.ts <command>

COMMANDS:
  dev         Start development server with hot reload
  build       Build for production (output to ./dist)
  build:css   Build Tailwind CSS only
  serve       Serve production build from ./dist
  --help      Show this help message

EXAMPLES:
  bun src/index.ts dev        # Start dev server on port 6969
  bun src/index.ts build      # Build the app for production
  bun src/index.ts build:css  # Build only the CSS
  bun src/index.ts serve      # Serve production build on port 3000

PRODUCTION WORKFLOW:
  1. Build:   bun src/index.ts build
  2. Serve:   bun src/index.ts serve
  3. Or use:  NODE_ENV=production bun src/index.ts serve
`);
}

async function buildCSS() {
  console.log("🎨 Building CSS...");
  
  const css = await readFile("./src/styles/globals.css", "utf8");

  const result = await postcss([tailwindcss, autoprefixer]).process(css, {
    from: "./src/styles/globals.css",
    to: "./public/styles.css",
  });

  await writeFile("./public/styles.css", result.css);
  if (result.map) {
    await writeFile("./public/styles.css.map", result.map.toString());
  }

  console.log("✅ CSS built successfully!");
}

async function build() {
  console.log("🏗️  Building for production...\n");

  // Build CSS first
  await buildCSS();

  // Clean dist folder
  if (existsSync("./dist")) {
    await rm("./dist", { recursive: true });
    console.log("✓ Cleaned dist folder");
  }

  await mkdir("./dist", { recursive: true });

  // Build the React application
  console.log("\n📦 Bundling React application...");
  const result = await Bun.build({
    entrypoints: ["./src/main.tsx"],
    outdir: "./dist",
    minify: true,
    sourcemap: "external",
    naming: {
      entry: "bundle.[hash].js",
      chunk: "chunk.[hash].js",
      asset: "assets/[name].[hash].[ext]",
    },
  });

  if (!result.success) {
    console.error("❌ Build failed:");
    for (const message of result.logs) {
      console.error(message);
    }
    process.exit(1);
  }

  console.log(`✓ Built ${result.outputs.length} file(s)`);

  // Copy index.html and update script reference
  console.log("\n📁 Copying static assets...");
  const indexHtml = await Bun.file("./public/index.html").text();
  const bundleFile = result.outputs.find((o) => o.path.includes("bundle"));
  const bundleName = bundleFile ? bundleFile.path.split("/").pop() : "bundle.js";

  const updatedHtml = indexHtml.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    `<script type="module" src="/${bundleName}"></script>`
  );

  await Bun.write("./dist/index.html", updatedHtml);
  console.log("✓ Copied and updated index.html");

  // Copy other public assets
  const entries = await Array.fromAsync(
    new Bun.Glob("public/**/*").scan({ onlyFiles: true })
  );

  for (const entry of entries) {
    if (entry.endsWith("index.html")) continue;

    const sourceFile = Bun.file(entry);
    const targetPath = `./dist/${entry.replace("public/", "")}`;

    // Create directory if needed
    const targetDir = targetPath.substring(0, targetPath.lastIndexOf("/"));
    await mkdir(targetDir, { recursive: true });

    await Bun.write(targetPath, sourceFile);
  }

  console.log("✓ Copied fonts and assets");
  console.log("\n✅ Build complete! Output in ./dist/");
  console.log("\n💡 To serve the production build:");
  console.log("   bun src/index.ts serve");
}

async function serveProd() {
  const port = process.env.PORT || 3100;

  // Start fetching contributors in the background
  startContributorsFetch();

  const server = Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);
      let path = url.pathname;

      if (path === "/") {
        path = "/index.html";
      }

      // API endpoint for contributors
      if (path === "/api/contributors") {
        return new Response(JSON.stringify(contributorsCache), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Proxy GitHub avatars
      if (path.startsWith("/avatar/")) {
        const userId = path.substring(8); // Remove "/avatar/"
        
        // Construct the GitHub avatar URL
        const avatarUrl = `https://avatars.githubusercontent.com/u/${userId}?v=4`;
        
        // Check cache first
        if (avatarCache.has(avatarUrl)) {
          const cachedAvatar = avatarCache.get(avatarUrl)!;
          return new Response(cachedAvatar, {
            headers: { 
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400"
            },
          });
        }
        
        // Fetch and cache if not found
        const avatarBuffer = await fetchAndCacheAvatar(avatarUrl);
        if (avatarBuffer) {
          return new Response(avatarBuffer, {
            headers: { 
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400"
            },
          });
        }
        
        return new Response("Avatar not found", { status: 404 });
      }

      const file = Bun.file(`./dist${path}`);
      const exists = await file.exists();

      if (exists) {
        // Add proper caching headers for static assets
        const headers: Record<string, string> = {};
        
        if (path.endsWith(".svg")) {
          headers["Content-Type"] = "image/svg+xml";
          headers["Cache-Control"] = "public, max-age=31536000, immutable";
        } else if (path.endsWith(".woff") || path.endsWith(".woff2")) {
          headers["Cache-Control"] = "public, max-age=31536000, immutable";
        } else if (path.endsWith(".css") || path.endsWith(".js")) {
          headers["Cache-Control"] = "public, max-age=31536000, immutable";
        }
        
        return new Response(file, { headers });
      }

      // Fallback to index.html for SPA routing
      return new Response(Bun.file("./dist/index.html"));
    },
  });

  console.log(`🚀 Production server running at http://localhost:${server.port}`);
}

async function serveDev() {
  // Start fetching contributors in the background
  startContributorsFetch();

  const server = Bun.serve({
    port: 6969,
    async fetch(req) {
      const url = new URL(req.url);
      let path = url.pathname;

      // Handle root path
      if (path === "/") {
        path = "/index.html";
      }

      // API endpoint for contributors
      if (path === "/api/contributors") {
        return new Response(JSON.stringify(contributorsCache), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Proxy GitHub avatars
      if (path.startsWith("/avatar/")) {
        const userId = path.substring(8); // Remove "/avatar/"
        
        // Construct the GitHub avatar URL
        const avatarUrl = `https://avatars.githubusercontent.com/u/${userId}?v=4`;
        
        // Check cache first
        if (avatarCache.has(avatarUrl)) {
          const cachedAvatar = avatarCache.get(avatarUrl)!;
          return new Response(cachedAvatar, {
            headers: { 
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400"
            },
          });
        }
        
        // Fetch and cache if not found
        const avatarBuffer = await fetchAndCacheAvatar(avatarUrl);
        if (avatarBuffer) {
          return new Response(avatarBuffer, {
            headers: { 
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400"
            },
          });
        }
        
        return new Response("Avatar not found", { status: 404 });
      }

      // Try to serve from public directory
      const publicFile = Bun.file(`./public${path}`);
      const publicExists = await publicFile.exists();

      if (publicExists) {
        // Add proper caching headers for static assets
        const headers: Record<string, string> = {};
        
        if (path.endsWith(".svg")) {
          headers["Content-Type"] = "image/svg+xml";
          headers["Cache-Control"] = "public, max-age=31536000, immutable";
        } else if (path.endsWith(".woff") || path.endsWith(".woff2")) {
          headers["Cache-Control"] = "public, max-age=31536000, immutable";
        } else if (path.endsWith(".css")) {
          headers["Content-Type"] = "text/css";
          headers["Cache-Control"] = "public, max-age=3600";
        }
        
        return new Response(publicFile, { headers });
      }

      // Development only: Serve main.tsx with bundling
      if (path === "/src/main.tsx") {
        try {
          const result = await Bun.build({
            entrypoints: ["./src/main.tsx"],
            minify: false,
            sourcemap: "inline",
            publicPath: "/",
          });

          if (result.outputs.length > 0) {
            return new Response(result.outputs[0], {
              headers: { "Content-Type": "application/javascript" },
            });
          }
        } catch (error) {
          console.error("Build error:", error);
          return new Response(`Build error: ${error}`, { status: 500 });
        }
      }

      // Try to serve from src directory (development)
      const srcFile = Bun.file(`.${path}`);
      const srcExists = await srcFile.exists();

      if (srcExists) {
        // Determine content type
        let contentType = "text/plain";
        if (path.endsWith(".css")) contentType = "text/css";
        else if (path.endsWith(".js") || path.endsWith(".jsx"))
          contentType = "application/javascript";
        else if (path.endsWith(".ts") || path.endsWith(".tsx"))
          contentType = "application/typescript";
        else if (path.endsWith(".json")) contentType = "application/json";

        return new Response(srcFile, {
          headers: { "Content-Type": contentType },
        });
      }

      return new Response("Not Found", { status: 404 });
    },
  });

  console.log(`🚀 Development server running at http://localhost:${server.port}`);
  console.log(`📦 Mode: development`);
}

// Command router
switch (command) {
  case "dev":
    await buildCSS();
    await serveDev();
    break;
  case "build":
    await build();
    break;
  case "build:css":
    await buildCSS();
    break;
  case "serve":
    await serveProd();
    break;
  case "--help":
  case "-h":
  case "help":
    showHelp();
    break;
  default:
    console.error(`❌ Unknown command: ${command}\n`);
    showHelp();
    process.exit(1);
}
