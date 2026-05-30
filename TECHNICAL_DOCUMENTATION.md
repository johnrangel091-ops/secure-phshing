# Documentación Técnica — PhishingSecureJD

Este documento describe la arquitectura interna, los flujos de datos y las decisiones técnicas de **PhishingSecureJD**. Está dirigido a desarrolladores, equipos de DevOps o compradores técnicos que necesiten entender, mantener o escalar la plataforma.

---

## Tabla de contenidos

1. [Arquitectura general](#1-arquitectura-general)
2. [Base de datos y seguridad RLS](#2-base-de-datos-y-seguridad-rls)
3. [APIs externas e integraciones](#3-apis-externas-e-integraciones)
4. [Sistema de autenticación](#4-sistema-de-autenticación)
5. [Flujo de análisis de URLs](#5-flujo-de-análisis-de-urls)
6. [Historial y generación de PDF](#6-historial-y-generación-de-pdf)
7. [Componentes clave del frontend](#7-componentes-clave-del-frontend)
8. [Variables de entorno](#8-variables-de-entorno)
9. [Despliegue y CI/CD](#9-despliegue-y-cicd)

---

## 1. Arquitectura general

PhishingSecureJD es una **Single Page Application (SPA)** desacoplada de backend propio. Toda la lógica de presentación, el motor de detección y la generación de PDFs corren en el navegador del cliente. La persistencia y la autenticación se delegan a **Supabase**, lo que elimina la necesidad de servidores Node.js, APIs REST custom o infraestructura de base de datos autogestionada.

### Diagrama de arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR (Cliente)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  React SPA   │  │ Motor de     │  │  jsPDF (reportes PDF)    │  │
│  │  (Vite)      │──│ Detección    │  │  generación client-side  │  │
│  │  Tailwind    │  │ Heurístico   │  └──────────────────────────┘  │
│  └──────┬───────┘  └──────────────┘                                 │
│         │                                                            │
│         │  Supabase JS Client (@supabase/supabase-js)               │
│         │  fetch() → APIs públicas IP / SSL (enriquecimiento)     │
└─────────┼───────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          SUPABASE (BaaS)                            │
│  ┌─────────────────┐    ┌─────────────────────────────────────┐    │
│  │  Supabase Auth  │    │  PostgreSQL                         │    │
│  │  JWT / OAuth    │    │  Tabla: historial_accesos           │    │
│  │  Sesiones       │    │  RLS: aislamiento por usuario_id    │    │
│  └─────────────────┘    └─────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NETLIFY (Hosting estático)                       │
│  Build: npm run build  →  dist/  →  CDN global + HTTPS gratuito    │
└─────────────────────────────────────────────────────────────────────┘
```

### Stack detallado

| Componente | Tecnología | Rol |
|------------|------------|-----|
| Bundler / Dev server | Vite 6 | Compilación rápida, HMR, build optimizado |
| UI Framework | React 18 | Componentes reactivos, hooks, context API |
| Lenguaje | TypeScript | Tipado estático en componentes y lógica |
| Estilos | Tailwind CSS 4 | Utility-first, diseño responsive |
| Componentes UI | Radix UI + shadcn patterns | Accesibilidad, modales, tabs, etc. |
| Iconografía | Lucide React | Iconos consistentes en toda la app |
| Notificaciones | Sonner | Toasts para feedback al usuario |
| Auth + DB | Supabase JS v2 | Cliente oficial, singleton en `client.ts` |
| PDF | jsPDF 4.x | Generación de reportes sin backend |

### Patrón arquitectónico

- **Jamstack / Serverless:** HTML/JS/CSS estáticos en Netlify; lógica dinámica en cliente + Supabase.
- **BaaS (Backend as a Service):** Supabase sustituye API REST, ORM y gestión de usuarios.
- **Zero backend propio:** Coste operativo mínimo ($0 en capas gratuitas).
- **Seguridad en profundidad:** JWT en cliente + RLS en PostgreSQL garantizan que un usuario solo accede a sus propios registros, incluso si manipula las peticiones desde el navegador.

### Estructura de directorios relevante

```
src/
├── main.tsx                    # Punto de entrada React
├── app/
│   ├── App.tsx                 # Orquestador: auth gate, escaneo, rutas internas
│   └── components/
│       ├── LoginForm.tsx       # Auth UI (login, registro, reset password)
│       ├── LinkHistory.tsx     # Historial + exportación PDF
│       ├── BlockedList.tsx     # URLs bloqueadas
│       ├── StatsCards.tsx      # Métricas del dashboard
│       ├── Sidebar.tsx         # Navegación lateral
│       ├── Settings.tsx        # Preferencias de usuario
│       └── Documentation.tsx   # Ayuda in-app
└── lib/supabase/
    ├── client.ts               # Singleton Supabase + validación env
    ├── auth-context.tsx        # React Context: user, session, signIn/Out
    └── supabaseClient.js       # Re-export del cliente
```

---

## 2. Base de datos y seguridad RLS

### Motor

**PostgreSQL** administrado por Supabase. No requiere instalación local ni mantenimiento de servidor.

### Tabla principal: `historial_accesos`

Definida en `supabase/migrations/003_historial_accesos_app_schema.sql`:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | BIGSERIAL | Identificador único autoincremental |
| `url` | TEXT | URL analizada |
| `estado` | TEXT | `'Pendiente'`, `'Seguro'` o `'Sospechoso'` |
| `bloqueado` | BOOLEAN | Si el enlace está en la lista de bloqueo |
| `correo_electronico` | TEXT | Email del usuario (denormalizado para consultas) |
| `usuario_id` | UUID | FK → `auth.users(id)` ON DELETE CASCADE |
| `created_at` | TIMESTAMPTZ | Marca de tiempo del análisis |

### Row Level Security (RLS)

RLS está **habilitado** en la tabla. Las políticas garantizan aislamiento total entre usuarios:

```sql
-- SELECT: solo registros del usuario autenticado
CREATE POLICY "historial_select_own"
  ON public.historial_accesos FOR SELECT
  USING (auth.uid() = usuario_id);

-- INSERT: solo puede insertar con su propio usuario_id y email del JWT
CREATE POLICY "historial_insert_own"
  ON public.historial_accesos FOR INSERT
  WITH CHECK (
    auth.uid() = usuario_id
    AND correo_electronico = (auth.jwt() ->> 'email')
  );

-- UPDATE / DELETE: solo sobre registros propios
CREATE POLICY "historial_update_own" ... USING (auth.uid() = usuario_id);
CREATE POLICY "historial_delete_own" ... USING (auth.uid() = usuario_id);
```

### Por qué RLS es crítico

1. **Clave anon expuesta:** La clave `VITE_SUPABASE_ANON_KEY` es pública en el bundle del frontend. Cualquier usuario puede inspeccionarla.
2. **Defensa en profundidad:** Aunque un atacante use la clave anon directamente, PostgreSQL evalúa `auth.uid()` del JWT en cada query y rechaza acceso a filas ajenas.
3. **Sin lógica de autorización en frontend:** El frontend no es la fuente de verdad de permisos; la base de datos lo es.

### Índices de rendimiento

```sql
CREATE INDEX idx_historial_usuario ON historial_accesos(usuario_id);
CREATE INDEX idx_historial_correo ON historial_accesos(correo_electronico);
CREATE INDEX idx_historial_created ON historial_accesos(created_at DESC);
```

### Operaciones desde el frontend

| Operación | Método Supabase | Cuándo |
|-----------|-----------------|--------|
| Cargar historial | `.from('historial_accesos').select(...).order('created_at')` | Al iniciar sesión |
| Guardar análisis | `.insert({ url, estado, bloqueado, correo, usuario_id })` | Tras cada escaneo |
| Bloquear URL | `.update({ bloqueado: true }).eq('id', ...).eq('usuario_id', ...)` | Acción del usuario |
| Desbloquear URL | `.update({ bloqueado: false })` | Acción del usuario |
| Limpiar historial | `.delete().eq('usuario_id', user.id)` | Configuración |

---

## 3. APIs externas e integraciones

La arquitectura de PhishingSecureJD está diseñada para enriquecer cada análisis con **datos de contexto de red y certificados** consultados directamente desde el frontend, sin necesidad de un proxy backend. Esto mantiene el coste en $0 y simplifica el despliegue.

### Filosofía de integración

```
URL ingresada
     │
     ├──► Motor heurístico (cliente)     → score, riesgo, motivos
     │
     ├──► Resolución DNS / IP            → dirección IP del dominio
     │         │
     │         └──► API Geolocalización  → país, ISP, ASN
     │
     └──► API / verificación SSL         → validez, TLS, expiración
```

### APIs recomendadas para IP y geolocalización

| Servicio | Endpoint ejemplo | Datos | Tier gratuito |
|----------|------------------|-------|---------------|
| **ip-api.com** | `http://ip-api.com/json/{ip}` | País, ciudad, ISP, ASN, lat/lon | 45 req/min |
| **ipwho.is** | `https://ipwho.is/{ip}` | Geolocalización + reputación básica | Generoso |
| **Google DNS JSON** | `https://dns.google/resolve?name={domain}&type=A` | Resolución A/AAAA del dominio | Sin API key |

**Flujo típico en el cliente:**

1. Extraer `hostname` de la URL analizada con `new URL()`.
2. Resolver IP vía DNS over HTTPS (Google DNS API o Cloudflare `1.1.1.1/dns-query`).
3. Consultar API de geolocalización con la IP obtenida.
4. Poblar la tarjeta **Reputación de IP** (país, ISP, score).

### APIs para certificados SSL

| Servicio | Uso | Notas |
|----------|-----|-------|
| **SSL Labs API** | Análisis profundo de cadena TLS | Rate-limited; ideal para análisis batch |
| **crt.sh** | `https://crt.sh/?q={domain}&output=json` | Certificate Transparency logs |
| **Verificación nativa** | Intentar `fetch()` HEAD al dominio | Detecta HTTPS vs HTTP; CORS puede limitar |

**Datos mostrados en la tarjeta SSL:**

- Estado del certificado (Válido / Expirado / Autofirmado).
- Protocolo TLS (1.2 / 1.3).
- Algoritmo de firma (SHA-256, etc.).
- Días hasta expiración.

### Supabase (API interna)

| Servicio Supabase | Protocolo | Autenticación |
|-------------------|-----------|---------------|
| Auth | REST + WebSocket (realtime) | JWT Bearer |
| Database (PostgREST) | REST auto-generado | JWT Bearer + RLS |
| Storage | REST | JWT Bearer *(no usado en MVP)* |

El cliente Supabase (`@supabase/supabase-js`) encapsula todas las llamadas a Auth y PostgreSQL. El JWT del usuario se adjunta automáticamente a cada petición REST.

### Consideraciones CORS

Las APIs públicas de IP/geolocalización suelen permitir llamadas desde el navegador. Para APIs con restricciones CORS, el comprador puede:

- Usar **Netlify Functions** o **Supabase Edge Functions** como proxy ligero.
- Migrar el enriquecimiento a un microservicio serverless (escalabilidad SaaS).

---

## 4. Sistema de autenticación

### Proveedor: Supabase Auth

Supabase Auth gestiona usuarios, hashes de contraseña, confirmación de email, OAuth y emisión de JWT. No hay tabla de usuarios custom ni lógica de hash en el frontend.

### Flujo de autenticación

```
Usuario → LoginForm.tsx
              │
              ├── signInWithPassword(email, password)
              ├── signUp(email, password)          → email de confirmación
              ├── signInWithGoogle()               → OAuth redirect
              └── resetPasswordForEmail(email)
              │
              ▼
        Supabase Auth API
              │
              ├── Emite JWT (access_token + refresh_token)
              └── Crea/actualiza fila en auth.users
              │
              ▼
        auth-context.tsx
              │
              ├── onAuthStateChange listener
              ├── Persiste sesión (localStorage via Supabase)
              └── Expone: user, session, isLoading
              │
              ▼
        App.tsx — Auth Gate
              │
              ├── isLoading → pantalla de carga
              ├── !user     → <LoginForm />
              └── user      → dashboard completo
```

### JWT y sesiones

- **Access token:** Corta duración; incluido en headers de peticiones a PostgREST.
- **Refresh token:** Renovación automática (`autoRefreshToken: true` en `client.ts`).
- **Claims relevantes:** `sub` (user UUID), `email`, `role` (`authenticated`).

### Protección de rutas

La aplicación no usa React Router para rutas protegidas en el MVP. La protección es **condicional en `App.tsx`**:

```tsx
if (authLoading) return <LoadingScreen />;
if (!user) return <LoginForm />;
return <Dashboard />;  // Sidebar + secciones internas
```

Las secciones internas (`dashboard`, `history`, `threats`, `settings`, `documentation`) se controlan con estado local (`activeSection`), no con URLs. Para escalar a SaaS, se recomienda migrar a **React Router** con un componente `<ProtectedRoute>`.

### OAuth con Google

Configuración requerida en Supabase Dashboard:

1. **Authentication → Providers → Google** (Client ID + Secret).
2. Variable opcional `VITE_DEV_SUPABASE_REDIRECT_URL` para callback en desarrollo.
3. En producción (Netlify): redirect URL = `https://tu-dominio.netlify.app/auth/callback`.

---

## 5. Flujo de análisis de URLs

### Diagrama de flujo completo (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE ANÁLISIS DE URL                         │
└──────────────────────────────────────────────────────────────────────────┘

  [Usuario autenticado]
         │
         ▼
  ┌─────────────┐
  │ Ingresa URL │  ← Input en panel principal (App.tsx)
  └──────┬──────┘
         │ click "Analizar URL"
         ▼
  ┌─────────────────┐
  │ isScanning=true │  ← Animación de escaneo (~2 seg)
  │ UI: SSL/Dominio │
  │     /Reputación │
  └──────┬──────────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │           analyzeUrlForPhishing(inputUrl)                │
  │  ─────────────────────────────────────────────────────   │
  │  1. Normalizar URL (lowercase, prefijo https://)         │
  │  2. Parsear hostname + pathname (URL API nativa)         │
  │  3. ¿Dominio en lista segura? → return Seguro (95)       │
  │  4. Contar subdominios (>2 puntos → +25 danger)          │
  │  5. Buscar keywords sospechosas (+10 c/u, max 40)        │
  │  6. Extensión TLD sospechosa (.xyz, .tk…) → +20          │
  │  7. Typosquatting (Google, Facebook, PayPal…) → +35       │
  │  8. Caracteres Unicode / homoglyphs → +30                │
  │  9. IP directa en hostname → +25                         │
  │ 10. Dominio largo (>30 chars) → +15                     │
  │ 11. Múltiples guiones → +15                               │
  │ 12. Secuencias numéricas (4+ dígitos) → +20              │
  │  ─────────────────────────────────────────────────────   │
  │  securityScore = max(0, min(100, 100 - dangerScore))     │
  └──────┬───────────────────────────────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────────┐
  │ Clasificación de riesgo             │
  │  score ≥ 80  → Bajo    (emerald)    │
  │  score ≥ 50  → Medio   (yellow)     │
  │  score ≥ 20  → Alto    (red)        │
  │  score <  20  → Crítico (red)        │
  └──────┬──────────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────────┐
  │ mapRiskToEstado(risk)               │
  │  Bajo/Seguro → 'Seguro'             │
  │  Medio/Alto/Crítico → 'Sospechoso'  │
  │  otro → 'Pendiente'                 │
  └──────┬──────────────────────────────┘
         │
         ├──────────────────────────────────┐
         ▼                                  ▼
  ┌─────────────────┐            ┌─────────────────────┐
  │ Supabase INSERT │            │ UI: Resultados      │
  │ historial_      │            │ - Nivel de riesgo   │
  │ accesos         │            │ - Score %           │
  └────────┬────────┘            │ - Tarjeta SSL       │
           │                     │ - Tarjeta IP/Geo    │
           │                     │ - Motivos           │
           │                     │ - Recomendaciones   │
           │                     └─────────────────────┘
           ▼
  ┌─────────────────┐
  │ history[]       │  ← Estado React + recarga desde Supabase
  │ actualizado     │
  └─────────────────┘
```

### Listas de referencia del motor

**Dominios seguros (~30 marcas):** Google, Facebook, Amazon, Microsoft, Apple, GitHub, PayPal, etc.

**Keywords sospechosas (~40 términos):** login, verify, bank, password, urgent, crypto, actualizar, verificar, etc. (inglés y español).

**TLDs de alto riesgo:** `.xyz`, `.tk`, `.ml`, `.ga`, `.cf`, `.gq`, `.pw`, `.buzz`, etc.

**Patrones typosquatting:** Regex para detectar variantes de Google, Facebook, Amazon, Microsoft, Apple, Netflix, PayPal y bancos.

### Mapeo estado ↔ UI

| Riesgo del motor | `estado` en DB | Color UI | Score mostrado |
|------------------|----------------|----------|----------------|
| Seguro / Bajo | Seguro | emerald | 95 / score real |
| Medio / Alto / Crítico | Sospechoso | red/yellow | 25 / score real |
| Pendiente | Pendiente | yellow | 50 |

---

## 6. Historial y generación de PDF

### Persistencia automática

Cada análisis exitoso dispara un `INSERT` en `historial_accesos` con:

```typescript
{
  url: analyzedUrl,
  estado: mapRiskToEstado(analysis.risk),
  bloqueado: false,
  correo_electronico: user.email,
  usuario_id: user.id,
}
```

Si el insert falla, se muestra un toast de error pero el resultado local sigue visible en la sesión actual.

### Carga del historial

Al montar la app (o al cambiar `user`):

```typescript
supabase
  .from('historial_accesos')
  .select('id, url, estado, bloqueado, created_at')
  .order('created_at', { ascending: false });
```

Los registros se dividen en:

- **`history`:** `bloqueado === false`
- **`blockedList`:** `bloqueado === true`

### Bloqueo de URLs

`handleBlockUrl` actualiza `bloqueado: true` en Supabase y mueve el registro de `history` a `blockedList` en el estado React. El usuario ve una alerta modal de confirmación.

### Generación de PDF (client-side)

Implementada en `LinkHistory.tsx` con **jsPDF**:

```
┌─────────────────────────────────────┐
│  PhishingSecureJD                   │  ← Header azul oscuro
│  Reporte de Análisis de Seguridad   │
├─────────────────────────────────────┤
│  Fecha:     [fecha del análisis]    │
│  URL:       [url completa, wrap]    │
│  Estado:    Seguro | Sospechoso     │
│  Acceso:    Permitido | Bloqueado   │
└─────────────────────────────────────┘
         │
         ▼
  Descarga: PhishingSecureJD_Reporte_{id}.pdf
```

**Ventajas del enfoque client-side:**

- Cero coste de servidor para generación de documentos.
- Privacidad: los datos no salen del navegador para crear el PDF.
- Instantáneo: sin latencia de red adicional.

**Extensión futura:** Incluir score numérico, motivos del análisis, datos SSL/IP y logo del comprador en el template jsPDF.

---

## 7. Componentes clave del frontend

| Componente | Responsabilidad |
|------------|-----------------|
| `App.tsx` | Auth gate, motor de análisis, CRUD historial, dashboard |
| `LoginForm.tsx` | Login, registro, reset password, validación de campos |
| `auth-context.tsx` | Estado global de sesión, métodos signIn/Up/Out |
| `LinkHistory.tsx` | Tabla de historial, modal de detalle, export PDF |
| `BlockedList.tsx` | Lista de URLs bloqueadas, desbloqueo |
| `StatsCards.tsx` | Métricas agregadas (total, amenazas, seguros, efectividad) |
| `Sidebar.tsx` | Navegación entre secciones |
| `Settings.tsx` | Tema claro/oscuro, alertas por email (localStorage) |
| `Documentation.tsx` | Guía in-app para usuarios finales |
| `SecurityTips.tsx` | Consejos de seguridad en el dashboard |

---

## 8. Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | Sí | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sí | Clave pública anon |
| `VITE_DEV_SUPABASE_REDIRECT_URL` | No | Callback OAuth en desarrollo |

Las variables deben prefijarse con `VITE_` para que Vite las exponga a `import.meta.env` en build time.

---

## 9. Despliegue y CI/CD

### Netlify (recomendado)

| Setting | Valor |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18+ |

Archivo `_redirects` opcional en `public/` para SPA:

```
/*    /index.html   200
```

### Supabase en producción

1. Crear proyecto Supabase dedicado para producción.
2. Ejecutar migración `003_historial_accesos_app_schema.sql`.
3. Configurar Site URL y Redirect URLs en Auth settings.
4. Habilitar confirmación de email según política de negocio.

### Escalabilidad

| Usuarios | Supabase Free | Netlify Free | Coste |
|----------|---------------|--------------|-------|
| 0 – 500 | ✅ | ✅ | $0/mes |
| 500 – 50K | Pro $25/mes | Pro $19/mes | ~$44/mes |
| 50K+ | Team / Enterprise | Business | Variable |

---

## Resumen técnico

PhishingSecureJD es una SPA moderna que demuestra un patrón **Jamstack + BaaS** eficiente: cero servidores propios, seguridad con RLS, motor de detección en cliente y persistencia en PostgreSQL gestionado. La arquitectura permite escalar a SaaS añadiendo planes de pago (Stripe + Supabase), APIs de enriquecimiento en Edge Functions y React Router para multi-tenant, sin reescribir el núcleo del producto.
