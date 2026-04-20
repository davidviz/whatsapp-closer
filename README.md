# whatsapp-closer

Generador de respuestas WhatsApp para cerrar ventas, potenciado por la API de Claude.

## Setup

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env.local` y añade tu clave de la API de Anthropic:

   ```bash
   cp .env.example .env.local
   ```

3. Arranca el servidor de desarrollo:

   ```bash
   npm run dev
   ```

Abre http://localhost:3000 en el navegador.

## Stack

- Next.js 14 (pages router)
- React 18
- Tailwind CSS
- lucide-react
- Claude API (`claude-sonnet-4-20250514`)

## Estructura

- `pages/index.js` – UI principal con plantillas, historial y generación de respuestas.
- `pages/api/generar-respuestas.js` – endpoint que llama a la API de Claude y devuelve 3 respuestas.
