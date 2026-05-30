# PhishingSecureJD

**Plataforma de detección de phishing en tiempo real**

PhishingSecureJD es una aplicación web profesional orientada a usuarios, equipos y organizaciones que necesitan verificar enlaces sospechosos antes de hacer clic. Combina un motor de análisis heurístico en el cliente, autenticación segura, historial persistente por usuario y reportes ejecutivos descargables, todo dentro de una interfaz moderna y responsive.

La plataforma permite pegar cualquier URL, obtener un veredicto de riesgo inmediato (Seguro, Medio, Alto o Crítico), revisar indicadores de contexto como certificado SSL y reputación de IP, y documentar cada análisis para auditoría o capacitación en ciberseguridad.

---

## Características principales

### Autenticación segura
- Registro e inicio de sesión con email y contraseña mediante **Supabase Auth**.
- Soporte opcional para **Google OAuth**.
- Recuperación de contraseña integrada.
- Sesiones JWT con renovación automática de tokens.
- Acceso restringido: sin sesión activa, la aplicación muestra únicamente la pantalla de login.

### Escaneo de URLs en tiempo real
- Análisis instantáneo de enlaces sospechosos desde el panel principal.
- Motor de detección propietario que evalúa:
  - Dominios confiables conocidos.
  - Typosquatting e imitación de marcas.
  - Palabras clave típicas de phishing.
  - Extensiones de dominio de alto riesgo.
  - Subdominios excesivos, IPs directas y patrones anómalos.
- Puntuación de seguridad (0–100) y clasificación de riesgo.
- Motivos detallados del análisis y recomendaciones accionables.

### Historial de análisis
- Cada escaneo se guarda automáticamente en **Supabase PostgreSQL**.
- Historial filtrado por usuario autenticado (Row Level Security).
- Vista de enlaces analizados con estado: **Pendiente**, **Seguro** o **Sospechoso**.
- Bloqueo y desbloqueo de URLs maliciosas con lista personal de amenazas.
- Estadísticas en tiempo real: total de análisis, amenazas detectadas, enlaces seguros y efectividad.

### Detalles de IP, SSL y contexto técnico
- Panel de resultados con tarjetas de **Certificado SSL** (validez, protocolo TLS, algoritmo de firma).
- Tarjeta de **Reputación de IP** con geolocalización, ISP y puntuación de reputación.
- Enriquecimiento contextual integrado en el flujo de escaneo (dominio, SSL, reputación).

### Descarga de reportes PDF
- Exportación de reportes ejecutivos por cada análisis desde el historial.
- Generación 100 % en el navegador con **jsPDF** (sin servidor adicional).
- Incluye fecha, URL analizada, estado de riesgo y estado de acceso (permitido/bloqueado).

### Experiencia de usuario
- Interfaz SPA moderna con modo oscuro/claro.
- Diseño responsive (móvil, tablet y escritorio).
- Secciones: Panel principal, Historial, Base de amenazas, Documentación y Configuración.
- Consejos de seguridad integrados y alertas configurables.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, Vite 6, TypeScript |
| Estilos | Tailwind CSS 4, Radix UI, Lucide Icons |
| Backend-as-a-Service | Supabase (Auth + PostgreSQL) |
| PDF | jsPDF |
| Despliegue | Netlify (SPA estática) |

---

## Requisitos previos

- **Node.js** 18 o superior
- **npm** (o pnpm, compatible con el proyecto)
- Cuenta gratuita en [Supabase](https://supabase.com)
- Cuenta gratuita en [Netlify](https://netlify.com) (para despliegue en producción)

---

## Instalación local

El código de la aplicación frontend reside en la **raíz del repositorio** (directorio principal del proyecto). Sigue estos pasos:

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd secure-phshing-1
npm install
```

> **Nota:** El proyecto también es compatible con `pnpm install` si prefieres pnpm.

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo con tus credenciales de Supabase:

```bash
cp .env.example .env
```

Contenido mínimo de `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica
```

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Clave pública `anon` de Supabase |
| `VITE_DEV_SUPABASE_REDIRECT_URL` | *(Opcional)* URL de callback para OAuth en desarrollo |

Obtén las credenciales en: **Supabase Dashboard → Project Settings → API**.

### 3. Configurar la base de datos en Supabase

En el panel de Supabase, abre **SQL Editor** y ejecuta el script:

```
supabase/migrations/003_historial_accesos_app_schema.sql
```

Este script crea la tabla `historial_accesos` con políticas RLS alineadas con la aplicación.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (puerto por defecto de Vite).

> **Importante:** La aplicación requiere Supabase configurado en `.env`. Sin las variables de entorno, se mostrará una pantalla indicando que falta la configuración.

### 5. Compilar para producción

```bash
npm run build
```

El resultado se genera en la carpeta `dist/`, lista para desplegar en Netlify u otro hosting estático.

---

## Despliegue en Netlify

1. Conecta el repositorio a Netlify.
2. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Añade las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en **Site settings → Environment variables**.
4. Despliega. Netlify servirá la SPA con redirección automática para rutas del cliente.

---

## Estructura del proyecto

```
secure-phshing-1/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Lógica principal, escaneo y dashboard
│   │   └── components/          # UI: Login, Historial, Sidebar, etc.
│   ├── lib/supabase/            # Cliente Supabase y contexto de auth
│   └── styles/                  # Tailwind y temas
├── supabase/migrations/         # Esquema SQL listo para clonar
├── .env.example                 # Plantilla de variables de entorno
├── vite.config.ts
├── package.json
├── README.md                    # Este archivo
├── TECHNICAL_DOCUMENTATION.md   # Documentación técnica detallada
└── SALE_OVERVIEW.md             # Información para compradores
```

---

## Documentación adicional

- **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** — Arquitectura interna, flujo de análisis, RLS, APIs y autenticación.
- **[SALE_OVERVIEW.md](./SALE_OVERVIEW.md)** — Inventario de activos, estado del MVP y vías de monetización.

---

## Licencia y uso

Este producto se entrega como activo digital listo para personalización, rebrandeo y comercialización. Consulta **SALE_OVERVIEW.md** para detalles sobre la transferencia de activos al comprador.

---

**PhishingSecureJD** — Protege a tus usuarios antes de que hagan clic en el enlace equivocado.
