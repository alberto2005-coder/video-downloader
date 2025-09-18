
# VideoDown - Video Downloader Application

Una aplicación full-stack para descargar videos de varias plataformas (YouTube, Vimeo, TikTok, Instagram, etc.) con diferentes formatos y calidades.

## 🚀 Características

- **Análisis de video en tiempo real** - Obtén información detallada del video antes de descargar
- **Múltiples formatos** - Descarga en MP4, WebM, MP3 y más
- **Seguimiento de progreso** - Visualiza el progreso de descarga en tiempo real
- **Interfaz moderna** - UI construida con React 18 y Shadcn/ui
- **Soporte multiplataforma** - Compatible con YouTube, TikTok, Instagram, Vimeo y más

## 📋 Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

### Requisitos del Sistema
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **yt-dlp** (herramienta externa para descarga de videos)

### Instalación de yt-dlp

#### En Windows:
```bash
# Usando pip
pip install yt-dlp

# O descarga el ejecutable desde: https://github.com/yt-dlp/yt-dlp/releases
```

#### En macOS:
```bash
# Usando Homebrew
brew install yt-dlp

# O usando pip
pip install yt-dlp
```

#### En Ubuntu/Debian:
```bash
# Usando pip
pip install yt-dlp

# O usando apt (si está disponible)
sudo apt update
sudo apt install yt-dlp
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd videodown
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor (opcional, por defecto 5000)
PORT=5000

# Configuración de base de datos (opcional)
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/videodown

# Configuración de sesión (opcional)
SESSION_SECRET=tu-clave-secreta-aqui
```

### 4. Configurar la base de datos (Opcional)
Si deseas usar PostgreSQL en lugar del almacenamiento en memoria:

```bash
# Instalar y configurar PostgreSQL
# Crear la base de datos
createdb videodown

# Ejecutar migraciones
npm run db:push
```

## 🚀 Ejecución en Desarrollo

### Modo de desarrollo (recomendado)
```bash
npm run dev
```

Esto iniciará:
- Servidor backend en `http://localhost:5000`
- Frontend con hot-reload
- WebSocket para actualizaciones en tiempo real

### Verificar la instalación
1. Abre tu navegador en `http://localhost:5000`
2. Pega una URL de video (ej: YouTube, TikTok)
3. Haz clic en "Analizar" para verificar que yt-dlp funciona correctamente

## 🏗️ Construcción para Producción

### 1. Construir la aplicación
```bash
npm run build
```

### 2. Ejecutar en producción
```bash
npm start
```

La aplicación estará disponible en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
videodown/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── lib/            # Utilidades y configuración
│   │   └── hooks/          # Custom hooks
│   └── index.html
├── server/                 # Backend Express
│   ├── services/           # Lógica de negocio
│   ├── routes.ts          # Rutas de la API
│   └── index.ts           # Punto de entrada del servidor
├── shared/                 # Tipos compartidos
├── downloads/             # Archivos descargados
└── package.json
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación
npm start           # Inicia el servidor de producción

# Utilidades
npm run check       # Verificación de tipos TypeScript
npm run db:push     # Aplicar cambios a la base de datos
```

## ⚙️ Configuración

### Variables de Entorno
- `PORT`: Puerto del servidor (por defecto: 5000)
- `NODE_ENV`: Entorno de ejecución (development/production)
- `DATABASE_URL`: URL de conexión a PostgreSQL (opcional)
- `SESSION_SECRET`: Clave secreta para sesiones

### Personalización
- **Puerto**: Cambia el puerto en `.env` o `package.json`
- **Base de datos**: Configura PostgreSQL en `drizzle.config.ts`
- **Estilos**: Modifica los temas en `tailwind.config.ts`

## 🐛 Solución de Problemas

### Error: "yt-dlp not found"
```bash
# Verifica la instalación
yt-dlp --version

# Si no está instalado, instálalo:
pip install yt-dlp
```

### Error de permisos en la carpeta downloads
```bash
# Crear la carpeta y dar permisos
mkdir downloads
chmod 755 downloads
```

### Puerto 5000 en uso
```bash
# Cambiar el puerto en .env
echo "PORT=3000" > .env
```

### Problemas con dependencias
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error cross-env
```bash
npm install -g cross-env
```
## 📝 Notas Adicionales

- La aplicación usa almacenamiento en memoria por defecto
- Los archivos se descargan en la carpeta `downloads/`
- El frontend se construye con Vite para desarrollo rápido
- Socket.IO maneja las actualizaciones de progreso en tiempo real

## 🔗 Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, Socket.IO, TypeScript
- **Base de datos**: Drizzle ORM, PostgreSQL (opcional)
- **Herramientas**: Vite, yt-dlp, TanStack Query

## 📄 Licencia

MIT License - consulta el archivo LICENSE para más detalles.
