# VideoDown — Descargador de vídeo

[Español](#español) · [English](#english)

---

## Español

### Índice

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalar yt-dlp](#instalar-yt-dlp)
- [Instalación del proyecto](#instalación-del-proyecto)
- [Ejecución](#ejecución)
- [API](#api)
- [Scripts](#scripts)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Problemas frecuentes](#problemas-frecuentes)
- [Licencia](#licencia)

### Descripción

Aplicación **full-stack** para analizar y descargar vídeos de plataformas como YouTube, Vimeo, TikTok o Instagram. El backend lanza **`yt-dlp`** como proceso hijo, y el frontend muestra la información del vídeo, los formatos disponibles y el progreso de la descarga en tiempo real mediante **Socket.IO**.

Los archivos descargados se guardan en la carpeta `downloads/` del proyecto.

### Características

- **Análisis del vídeo antes de descargar**: título, miniatura, duración, autor, visitas y formatos.
- **Descarga en varios formatos y calidades** (MP4, WebM, MP3 y los que exponga `yt-dlp`).
- **Progreso en tiempo real** con Socket.IO.
- **Cancelación** de descargas en curso.
- **Historial de descargas** con estado (`pending`, `downloading`, `completed`, `failed`).
- **Interfaz moderna** con React 18, Tailwind y shadcn/ui.
- **Reintentos y espera entre peticiones** en el análisis para evitar bloqueos del sitio de origen.

### Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Express 4 + TypeScript (`tsx`) + Socket.IO |
| Datos | Drizzle ORM (PostgreSQL opcional) |
| Descarga | `yt-dlp` |
| Estado | TanStack Query |

### Requisitos

- **Node.js 18 o superior** y npm.
- **`yt-dlp`** instalado y disponible en el `PATH`.

### Instalar yt-dlp

**Windows**

```bash
pip install yt-dlp
```

o descarga el ejecutable desde <https://github.com/yt-dlp/yt-dlp/releases>.

**macOS**

```bash
brew install yt-dlp
```

**Ubuntu / Debian**

```bash
sudo apt update && sudo apt install yt-dlp
```

Comprueba la instalación con `yt-dlp --version`.

### Instalación del proyecto

```bash
git clone https://github.com/alberto2005-coder/video-downloader.git
cd video-downloader
npm install
```

Copia el archivo de entorno:

```bash
cp .env.example .env
```

```env
PORT=3000

# Opcional: base de datos PostgreSQL
# DATABASE_URL=postgresql://usuario:password@localhost:5432/videodown

# Opcional: secreto de sesión
# SESSION_SECRET=cambia_esto_por_un_valor_aleatorio
```

> `.env` está en `.gitignore` porque contiene credenciales. El repositorio solo versiona `.env.example`.

La base de datos es **opcional**: por defecto se usa almacenamiento en memoria. Si quieres persistencia con PostgreSQL:

```bash
createdb videodown
npm run db:push
```

### Ejecución

```bash
npm run dev
```

Abre <http://localhost:3000>, pega una URL y pulsa **Analizar**. Si el análisis funciona, `yt-dlp` está bien instalado.

En producción:

```bash
npm run build
npm start
```

### API

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/analyze` | Analiza una URL y devuelve título, miniatura, duración y formatos |
| `POST` | `/api/downloads` | Crea una descarga y la arranca en segundo plano |
| `GET` | `/api/downloads/:id` | Consulta el estado de una descarga |
| `DELETE` | `/api/downloads/:id` | Cancela / elimina una descarga |

El progreso se emite por **Socket.IO** a medida que `yt-dlp` reporta porcentaje y velocidad.

### Scripts

| Script | Función |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run dev:windows` | Igual que `dev`, sin `cross-env` (útil en Windows) |
| `npm run build` | Build del cliente y del servidor |
| `npm start` | Ejecuta el build en producción |
| `npm run check` | Comprobación de tipos TypeScript |
| `npm run db:push` | Aplica el esquema de Drizzle (requiere `DATABASE_URL`) |

### Estructura del proyecto

```text
video-downloader/
├── client/
│   └── src/
│       ├── components/          # header, video-analyzer, download-progress, faq…
│       ├── pages/               # home, not-found
│       └── main.tsx
├── server/
│   ├── services/
│   │   └── video-downloader.ts  # Envoltorio de yt-dlp
│   ├── routes.ts                # API y Socket.IO
│   ├── storage.ts               # Descargas (memoria o PostgreSQL)
│   ├── vite.ts                  # Integración con Vite
│   └── index.ts                 # Entrada del servidor
├── shared/
│   └── schema.ts                # Tipos y validaciones Zod
├── downloads/                   # Vídeos descargados
├── drizzle.config.ts
├── tailwind.config.ts
├── .env.example
├── LICENSE
└── README.md
```

### Problemas frecuentes

- **`yt-dlp not found`**: el ejecutable no está en el `PATH`. Comprueba con `yt-dlp --version` y reinstálalo.
- **Error de permisos en `downloads/`**: crea la carpeta a mano (`mkdir downloads`) y dale permisos de escritura.
- **Puerto ocupado**: cambia `PORT` en `.env`.
- **Fallo con `cross-env` en Windows**: usa `npm run dev:windows`.
- **Dependencias corruptas**: borra `node_modules` y `package-lock.json`, y ejecuta `npm install` de nuevo.
- **La descarga falla solo en algunas webs**: muchas plataformas cambian su reproductor a menudo; actualiza `yt-dlp` (`pip install -U yt-dlp`) antes de abrir una incidencia.

### Licencia

Este proyecto se distribuye bajo la **licencia MIT**. Consulta [LICENSE](LICENSE).

---

## English

### Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Install yt-dlp](#install-yt-dlp)
- [Project installation](#project-installation)
- [Running](#running)
- [API](#api)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [License](#license)

### Overview

A **full-stack** app to analyze and download videos from platforms such as YouTube, Vimeo, TikTok or Instagram. The backend spawns **`yt-dlp`** as a child process, and the frontend shows video info, available formats and download progress in real time over **Socket.IO**.

Downloaded files are stored in the project's `downloads/` folder.

### Features

- **Analyze before downloading**: title, thumbnail, duration, uploader, views and formats.
- **Multiple formats and qualities** (MP4, WebM, MP3 and whatever `yt-dlp` exposes).
- **Real-time progress** through Socket.IO.
- **Cancel** in-flight downloads.
- **Download history** with status (`pending`, `downloading`, `completed`, `failed`).
- **Modern UI** with React 18, Tailwind and shadcn/ui.
- **Retries and throttling** during analysis to avoid rate limits on the source site.

### Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Express 4 + TypeScript (`tsx`) + Socket.IO |
| Data | Drizzle ORM (PostgreSQL optional) |
| Download | `yt-dlp` |
| State | TanStack Query |

### Requirements

- **Node.js 18 or later** and npm.
- **`yt-dlp`** installed and available on the `PATH`.

### Install yt-dlp

**Windows**

```bash
pip install yt-dlp
```

or download the binary from <https://github.com/yt-dlp/yt-dlp/releases>.

**macOS**

```bash
brew install yt-dlp
```

**Ubuntu / Debian**

```bash
sudo apt update && sudo apt install yt-dlp
```

Verify it with `yt-dlp --version`.

### Project installation

```bash
git clone https://github.com/alberto2005-coder/video-downloader.git
cd video-downloader
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

```env
PORT=3000

# Optional: PostgreSQL database
# DATABASE_URL=postgresql://user:password@localhost:5432/videodown

# Optional: session secret
# SESSION_SECRET=change_me_to_a_random_value
```

> `.env` is listed in `.gitignore` because it holds credentials. Only `.env.example` is versioned.

The database is **optional**: in-memory storage is used by default. For PostgreSQL persistence:

```bash
createdb videodown
npm run db:push
```

### Running

```bash
npm run dev
```

Open <http://localhost:3000>, paste a URL and press **Analizar** (Analyze). If analysis works, `yt-dlp` is correctly installed.

In production:

```bash
npm run build
npm start
```

### API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Analyzes a URL and returns title, thumbnail, duration and formats |
| `POST` | `/api/downloads` | Creates a download and starts it in the background |
| `GET` | `/api/downloads/:id` | Returns the status of a download |
| `DELETE` | `/api/downloads/:id` | Cancels / removes a download |

Progress is emitted over **Socket.IO** as `yt-dlp` reports percentage and speed.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run dev:windows` | Same as `dev`, without `cross-env` (handy on Windows) |
| `npm run build` | Builds client and server |
| `npm start` | Runs the production build |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Applies the Drizzle schema (requires `DATABASE_URL`) |

### Project structure

```text
video-downloader/
├── client/
│   └── src/
│       ├── components/          # header, video-analyzer, download-progress, faq…
│       ├── pages/               # home, not-found
│       └── main.tsx
├── server/
│   ├── services/
│   │   └── video-downloader.ts  # yt-dlp wrapper
│   ├── routes.ts                # API and Socket.IO
│   ├── storage.ts               # Downloads (memory or PostgreSQL)
│   ├── vite.ts                  # Vite integration
│   └── index.ts                 # Server entry point
├── shared/
│   └── schema.ts                # Types and Zod validations
├── downloads/                   # Downloaded videos
├── drizzle.config.ts
├── tailwind.config.ts
├── .env.example
├── LICENSE
└── README.md
```

### Troubleshooting

- **`yt-dlp not found`**: the binary is not on the `PATH`. Check `yt-dlp --version` and reinstall it.
- **Permission error in `downloads/`**: create the folder manually (`mkdir downloads`) and grant write access.
- **Port already in use**: change `PORT` in `.env`.
- **`cross-env` failure on Windows**: run `npm run dev:windows`.
- **Broken dependencies**: delete `node_modules` and `package-lock.json`, then `npm install` again.
- **Downloads fail on a specific site**: many platforms change their player often; update `yt-dlp` (`pip install -U yt-dlp`) before opening an issue.

### License

This project is released under the **MIT License**. See [LICENSE](LICENSE).
