# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with React, TypeScript, and Vite. The site features a blog system with markdown content, project portfolio, and animations using Framer Motion. The application uses React Router for navigation and Tailwind CSS for styling with dark mode support.

## Common Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint with TypeScript support
- `npm run preview` - Preview production build locally

Before writing or changing any code, please plan everything first in natural language.
Clearly explain:

The overall structure or component design

Which files will be modified or created

What kind of logic or styling will be used

Any dependencies or assumptions

Once you share the plan, I will review it and respond with “yes” to proceed, or suggest changes.
Do not start writing code until I confirm the plan.

## Architecture

### Key Technologies
- **React 18** with TypeScript for the UI
- **Vite** as the build tool and dev server
- **React Router** for client-side routing
- **Tailwind CSS** with typography plugin for styling
- **Framer Motion** for animations
- **gray-matter** for parsing markdown frontmatter in blog posts

### Project Structure
- `src/components/` - React components (Home, Blog, Projects, Contact, etc.)
- `src/pages/` - Page-level components
- `src/blog/` - Markdown blog posts organized by category (writeups, reflections)
- `src/content/blog/` - Additional blog content location
- `src/utils/` - Utility functions including blog post loading and scroll animations
- `src/assets/` - Static assets including theme-specific images

### Blog System
The blog system dynamically loads markdown files using Vite's `import.meta.glob()`. Blog posts are categorized into "writeups" and "reflections" based on their folder structure. Each post includes frontmatter with title, date, category, and tags. The system calculates read time automatically.

### Theming
The application supports dark/light themes using Tailwind's class-based dark mode. Theme-specific assets are loaded based on the current theme.

### Browser Compatibility
The project includes polyfills for Node.js modules (Buffer, path) to work in the browser environment, specifically for the gray-matter library used in blog post parsing.

### Build Configuration
- TypeScript compilation happens before Vite build
- ESLint is configured for React and TypeScript with recommended rules
- The build process includes optimization for browser compatibility with Node.js polyfills