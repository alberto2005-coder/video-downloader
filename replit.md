# VideoDown - Video Downloader Application

## Overview

VideoDown is a full-stack video downloading application that allows users to download videos from various platforms (YouTube, Vimeo, TikTok, Instagram, etc.) in different formats and qualities. The application features a modern React frontend with real-time download progress tracking and an Express.js backend that handles video analysis and downloading using yt-dlp.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system (dark theme focused)
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Real-time Communication**: Socket.IO for live download progress updates
- **Video Processing**: yt-dlp integration for video analysis and downloading
- **Development Server**: Custom Vite integration for hot module replacement
- **Storage**: In-memory storage with interface for easy database migration

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but using in-memory storage currently)
- **Schema**: Download tracking with video metadata, progress, and status
- **Migration System**: Drizzle-kit for database schema management

### Real-time Features
- **WebSocket Integration**: Socket.IO for bidirectional communication
- **Progress Tracking**: Live updates for download percentage, speed, ETA
- **Status Management**: Real-time status updates (pending, processing, completed, error)

### Authentication & Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Basic Express session configuration present
- **Future Ready**: Architecture supports adding authentication middleware

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **socket.io**: Real-time bidirectional event-based communication
- **yt-dlp**: External binary for video downloading (system dependency)

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Minimalist routing library
- **class-variance-authority**: Utility for managing component variants

### Development Tools
- **tsx**: TypeScript execution environment for Node.js
- **vite**: Fast build tool with HMR support
- **@replit/vite-plugin-***: Replit-specific development plugins
- **esbuild**: Fast JavaScript bundler for production builds

### System Requirements
- **yt-dlp**: Must be installed on the system for video downloading functionality
- **Node.js**: ES modules support required
- **PostgreSQL**: Database server (when not using in-memory storage)