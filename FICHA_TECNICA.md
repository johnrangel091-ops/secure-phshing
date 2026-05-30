# PhishingSecureJD — Ficha Técnica de Producto

---

## Resumen Ejecutivo

**PhishingSecureJD** es una plataforma web de ciberseguridad orientada a la detección en tiempo real de ataques de phishing mediante análisis heurístico de URLs. El sistema permite a usuarios individuales y equipos corporativos verificar la legitimidad de enlaces sospechosos antes de acceder a ellos, reduciendo drásticamente el riesgo de comprometer credenciales, datos personales o activos empresariales.

El producto resuelve uno de los vectores de ataque más prevalentes a nivel global: el phishing por URL. A diferencia de soluciones que dependen de bases de datos de amenazas externas (con latencia y costos de API), PhishingSecureJD ejecuta su motor de análisis enteramente en el cliente, garantizando respuestas instantáneas sin dependencias de terceros para el análisis principal.

---

## Características Principales

- **Análisis heurístico de URLs** en tiempo real sin llamadas a APIs externas de análisis
- **Motor de detección multicapa**: subdominios, palabras clave, extensiones de dominio, typosquatting, homóglifos unicode, IPs como host y entropía estructural
- **Whitelist de dominios seguros** con más de 35 dominios de referencia globales
- **Clasificación de riesgo en 4 niveles**: Seguro, Bajo, Medio, Alto y Crítico
- **Sistema de autenticación completo**: login con correo/contraseña y OAuth con Google
- **Historial persistente de análisis** por usuario con almacenamiento en nube
- **Lista de URLs bloqueadas** administrada por el propio usuario
- **Generación de reportes ejecutivos en PDF** con branding corporativo
- **Panel de estadísticas** con métricas de URLs analizadas, seguras, sospechosas y bloqueadas
- **Alertas configurables por correo** ante resultados de riesgo Alto o Crítico (configuración via localStorage)
- **Documentación integrada** dentro de la misma aplicación
- **Interfaz oscura y responsiva** con componentes Radix UI + Shadcn

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador)                  │
│                                                         │
│  ┌─────────────┐    ┌──────────────────────────────┐   │
│  │  React SPA  │    │   Motor Heurístico (local)    │   │
│  │  (App.tsx)  │───▶│   phishingAnalyzer.ts         │   │
│  └──────┬──────┘    └──────────────────────────────┘   │
│         │                                               │
│         │           ┌──────────────────────────────┐   │
│         └──────────▶│   Generador PDF (jsPDF)       │   │
│                     │   executivePdfReport.ts        │   │
│                     └──────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS / Supabase JS SDK
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   SUPABASE (BaaS)                        │
│                                                         │
│  ┌──────────────┐    ┌──────────────────────────────┐  │
│  │  Auth Module │    │   PostgreSQL Database         │  │
│  │  (email +    │    │   tabla: historial_accesos    │  │
│  │   Google     │    │   RLS habilitado              │  │
│  │   OAuth)     │    └──────────────────────────────┘  │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

El frontend es una Single Page Application (SPA) construida en React que no requiere servidor propio. Todo el análisis de phishing ocurre en el navegador del usuario. Supabase actúa como Backend-as-a-Service, proveyendo autenticación y base de datos PostgreSQL con Row Level Security.

---

## Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| React | 18.3.1 | Framework UI principal |
| TypeScript | — | Tipado estático |
| Vite | 6.3.5 | Bundler y servidor de desarrollo |
| Tailwind CSS | 4.1.12 | Estilos utilitarios |
| Radix UI | múltiples | Componentes UI accesibles |
| Shadcn/UI | — | Sistema de diseño basado en Radix |
| Lucide React | 0.487.0 | Iconografía |
| Sonner | 2.0.3 | Notificaciones toast |
| Recharts | 2.15.2 | Gráficos y visualizaciones |
| Motion | 12.23.24 | Animaciones |
| MUI / Material UI | 7.3.5 | Componentes adicionales |

### Backend / Infraestructura
| Tecnología | Propósito |
|---|---|
| Supabase | BaaS: autenticación, base de datos PostgreSQL, RLS |
| PostgreSQL | Motor de base de datos (gestionado por Supabase) |

### Librerías especializadas
| Librería | Versión | Propósito |
|---|---|---|
| @supabase/supabase-js | ^2.106.0 | Cliente de Supabase |
| jsPDF | ^4.2.1 | Generación de PDFs en el cliente |
| react-hook-form | 7.55.0 | Gestión de formularios |
| react-router | 7.13.0 | Enrutamiento |
| date-fns | 3.6.0 | Manejo de fechas |

---

## Flujo de Funcionamiento

```
1. ACCESO
   └─▶ Usuario accede a la URL de la aplicación
       └─▶ Se verifica sesión activa en Supabase Auth
           ├─▶ [Sin sesión] → Pantalla de Login/Registro
           └─▶ [Con sesión] → Dashboard principal

2. AUTENTICACIÓN
   └─▶ Login con correo + contraseña  ─ o ─  OAuth con Google
       └─▶ Supabase emite JWT de sesión
           └─▶ AuthContext propaga usuario a toda la app

3. ANÁLISIS DE URL
   └─▶ Usuario introduce una URL en el campo de análisis
       └─▶ phishingAnalyzer.ts ejecuta motor heurístico (local, <5ms)
           └─▶ Se calcula score de seguridad (0–100) y nivel de riesgo
               └─▶ Resultado se muestra en pantalla (color + etiqueta + razones)

4. PERSISTENCIA
   └─▶ Resultado se guarda automáticamente en historial_accesos (Supabase)
       └─▶ Vinculado al correo electrónico del usuario autenticado

5. REPORTE PDF (opcional)
   └─▶ Usuario solicita reporte ejecutivo
       └─▶ executivePdfReport.ts genera PDF completo con:
           ├─▶ Logo corporativo embebido (base64)
           ├─▶ Resumen del análisis heurístico
           ├─▶ Contexto técnico enriquecido (ISP, TLS, geolocalización simulada)
           └─▶ Recomendaciones de seguridad personalizadas
               └─▶ PDF descargado directamente en el navegador

6. GESTIÓN
   └─▶ Usuario puede:
       ├─▶ Consultar historial completo de análisis
       ├─▶ Bloquear URLs marcadas como peligrosas
       ├─▶ Ver lista de URLs bloqueadas
       └─▶ Configurar alertas y preferencias en Settings
```

---

## Sistema de Detección de Phishing

El motor heurístico está implementado en `src/lib/analysis/phishingAnalyzer.ts` y opera completamente en el cliente sin conexión a APIs externas de análisis.

### Algoritmo de Puntuación

El sistema calcula un **score de peligro acumulativo** (0–100 puntos negativos) y lo convierte a un **score de seguridad** (`100 - dangerScore`):

| Indicador | Puntos de peligro | Descripción |
|---|---|---|
| Dominio en whitelist | Score directo: 95 | Lista de 35+ dominios de confianza global |
| Más de 2 subdominios | +25 | Estructura de URL inusualmente profunda |
| Palabras clave sospechosas | +10 por kw (máx. 40) | Login, verify, bank, crypto, pago, etc. (55+ términos) |
| Extensión de dominio de riesgo | +20 | .xyz, .top, .tk, .ml, .ga, .pw y 10+ más |
| Typosquatting detectado | +35 | Imitaciones de Google, PayPal, Amazon, Microsoft, Apple, etc. |
| Caracteres Unicode/Homóglifos | +30 | Caracteres no-ASCII en el dominio |
| IP como host (no dominio) | +25 | Uso de dirección IP directa |
| Dominio excesivamente largo (>30 chars) | +15 | Indicador de ofuscación |
| Múltiples guiones (>2) | +15 | Patrón de dominio engañoso |
| Secuencias numéricas largas | +20 | Patrón de generación automática |
| URL con formato inválido | +30 | Posible técnica de evasión |

### Clasificación de Riesgo Final

| Score de Seguridad | Nivel | Color |
|---|---|---|
| ≥ 80 | Bajo / Seguro | Verde (emerald) |
| 50–79 | Medio | Amarillo |
| 20–49 | Alto | Rojo |
| < 20 | Crítico | Rojo intenso |

### Capacidad de Detección
- Typosquatting de 8 marcas globales (Google, Facebook, Amazon, Microsoft, Apple, Netflix, PayPal, Bancos)
- 55+ palabras clave en español e inglés
- 19 extensiones de dominio de alto riesgo
- Detección de homóglifos unicode (ataques IDN homograph)

---

## APIs y Servicios Externos

| Servicio | Tipo | Propósito |
|---|---|---|
| **Supabase Auth** | BaaS | Registro, login, sesiones JWT, OAuth con Google |
| **Supabase Database** | BaaS | Almacenamiento de historial de análisis (PostgreSQL) |
| **Google OAuth** | OAuth 2.0 | Login social mediante proveedor de Supabase |

> **Nota:** El motor de análisis de phishing es **100% local** y no realiza llamadas a APIs de reputación de URLs (VirusTotal, Google Safe Browsing, etc.), lo que lo hace instantáneo y sin costos variables por análisis.

---

## Gestión de Usuarios

### Registro e Inicio de Sesión
- **Registro**: Formulario con correo electrónico y contraseña (mínimo 8 caracteres) + confirmación
- **Login**: Email/contraseña o Google OAuth (gestionado por Supabase)
- **Recuperación de contraseña**: Enlace de restablecimiento vía correo electrónico
- **Sesión persistente**: JWT almacenado en localStorage con refresh automático de token

### Contexto de Autenticación
El componente `AuthProvider` (en `src/lib/supabase/auth-context.tsx`) expone al árbol de componentes:
- `user`: objeto de usuario Supabase
- `session`: token de sesión activo
- `signIn()`, `signUp()`, `signOut()`: métodos de autenticación
- Sincronización en tiempo real mediante `onAuthStateChange`

### Almacenamiento de Datos de Usuario
Los datos se guardan en Supabase vinculados al `usuario_id` (UUID) y `correo_electronico`. La política RLS garantiza que cada usuario sólo acceda a sus propios registros.

---

## Sistema de Historial

### Esquema de Base de Datos

```sql
CREATE TABLE public.historial_accesos (
  id               BIGSERIAL PRIMARY KEY,
  identificacion   TEXT,
  usuario_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  correo_electronico TEXT NOT NULL,
  fecha_ingreso    TIMESTAMPTZ DEFAULT NOW(),
  url              TEXT NOT NULL,
  risk             TEXT NOT NULL,      -- Bajo / Medio / Alto / Crítico / Seguro
  score            INTEGER NOT NULL,   -- 0–100
  color            TEXT NOT NULL,      -- emerald / yellow / red
  is_blocked       BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### Índices para Rendimiento
```sql
CREATE INDEX idx_historial_correo  ON historial_accesos(correo_electronico);
CREATE INDEX idx_historial_fecha   ON historial_accesos(fecha_ingreso DESC);
CREATE INDEX idx_historial_blocked ON historial_accesos(is_blocked);
```

### Row Level Security (RLS)
Cuatro políticas independientes garantizan aislamiento total entre usuarios:
- `SELECT`: solo registros propios
- `INSERT`: solo puede insertar con su propio correo
- `UPDATE`: solo puede modificar sus registros
- `DELETE`: solo puede eliminar sus registros

---

## Generación de Reportes PDF

El módulo `src/lib/analysis/executivePdfReport.ts` genera reportes ejecutivos descargables usando `jsPDF 4.x`.

### Estructura del Reporte

1. **Encabezado corporativo** — Logo de PhishingSecureJD embebido en base64, fecha y ID único del análisis
2. **Resumen ejecutivo** — URL analizada, nivel de riesgo, score de seguridad con código de color
3. **Análisis heurístico** — Lista detallada de todos los indicadores detectados y su contribución al score
4. **Contexto técnico enriquecido** — Información derivada determinísticamente del dominio:
   - ISP / proveedor de hosting inferido
   - Versión TLS (simulada según hash del dominio)
   - Emisor del certificado SSL
   - Geolocalización aproximada del servidor
5. **Recomendaciones de seguridad** — Lista personalizada según el nivel de riesgo detectado
6. **Pie de página corporativo** — "PhishingSecureJD — Documento confidencial de seguridad" + número de página

### Nombre del Archivo
```
PhishingSecureJD_Reporte_[ID].pdf
```

---

## Seguridad

| Medida | Implementación |
|---|---|
| **Autenticación segura** | JWT firmados por Supabase, refresh automático |
| **Row Level Security** | Políticas RLS en PostgreSQL — aislamiento total entre usuarios |
| **Variables de entorno** | Credenciales de Supabase en variables de entorno (`VITE_SUPABASE_*`), nunca en código fuente |
| **Eliminación en cascada** | `ON DELETE CASCADE` en `usuario_id` — elimina historial al borrar cuenta |
| **Validación de entrada** | Normalización y trimming de URLs antes del análisis |
| **Sin Backend propio** | Superficie de ataque mínima al no exponer servidor de aplicación |
| **HTTPS obligatorio** | Comunicación cifrada con Supabase en todo momento |
| **Sin almacenamiento de contraseñas** | Supabase Auth gestiona hashing y salting de contraseñas |

---

## Estructura del Proyecto

```
PhishingSecureJD/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Lógica principal, estado global, router de vistas
│   │   └── components/
│   │       ├── AppPageHeader.tsx      # Encabezado de la aplicación
│   │       ├── BlockedList.tsx        # Gestión de URLs bloqueadas
│   │       ├── Documentation.tsx      # Documentación integrada
│   │       ├── LinkHistory.tsx        # Historial de análisis
│   │       ├── LoginForm.tsx          # Formulario de autenticación
│   │       ├── Logo.tsx               # Componente del logo
│   │       ├── SecurityTips.tsx       # Consejos de seguridad
│   │       ├── Settings.tsx           # Configuración de usuario
│   │       ├── Sidebar.tsx            # Navegación lateral
│   │       ├── StatsCards.tsx         # Tarjetas de estadísticas
│   │       └── ui/                    # 40+ componentes Radix/Shadcn
│   ├── lib/
│   │   ├── analysis/
│   │   │   ├── phishingAnalyzer.ts    # Motor heurístico de detección
│   │   │   ├── executivePdfReport.ts  # Generador de reportes PDF
│   │   │   ├── urlContext.ts          # Enriquecimiento de contexto técnico
│   │   │   ├── accessStatus.ts        # Estado dinámico de acceso
│   │   │   └── securityRecommendations.ts # Recomendaciones por riesgo
│   │   ├── brand/
│   │   │   └── logoForPdf.ts          # Logo embebido en base64 para PDF
│   │   └── supabase/
│   │       ├── auth-context.tsx       # Proveedor de autenticación React
│   │       ├── client.ts              # Instancia Supabase (legacy)
│   │       └── supabaseClient.js      # Cliente Supabase principal
│   ├── styles/                        # CSS global y configuración Tailwind
│   └── main.tsx                       # Punto de entrada de React
├── supabase/
│   └── migrations/
│       └── 001_create_historial_accesos.sql  # Esquema y políticas RLS
├── public/                            # Assets estáticos
├── vite.config.ts                     # Configuración del bundler
├── package.json                       # Dependencias del proyecto
├── pnpm-lock.yaml                     # Lock file de dependencias
├── index.html                         # HTML raíz de la SPA
├── default_shadcn_theme.css           # Tema visual del sistema de diseño
├── README.md                          # Documentación general
├── SALE_OVERVIEW.md                   # Resumen de venta
└── TECHNICAL_DOCUMENTATION.md        # Documentación técnica extendida
```

---

## Requisitos de Instalación

### Variables de Entorno Requeridas

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### Instalación Local

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd PhishingSecureJD

# Instalar dependencias
npm install
# o con pnpm
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración de Base de Datos

Ejecutar el script de migración en el SQL Editor de Supabase:
```
supabase/migrations/001_create_historial_accesos.sql
```

### Requisitos del Sistema
- Node.js ≥ 20
- Proyecto activo en Supabase (plan gratuito es suficiente)
- Navegador moderno con soporte ES2020+

### Build para Producción

```bash
npm run build
# Genera carpeta /dist lista para hosting estático
```

---

## Estado Actual del Producto

| Aspecto | Evaluación | Observaciones |
|---|---|---|
| **Funcionalidad core** | ✅ Completo | Motor heurístico funcional con 11 tipos de detección |
| **Autenticación** | ✅ Completo | Login/registro/Google OAuth completamente operativo |
| **Base de datos** | ✅ Completo | Esquema, índices y RLS correctamente implementados |
| **Historial de usuario** | ✅ Completo | Persistencia y recuperación desde Supabase |
| **Generación de PDF** | ✅ Completo | Reportes ejecutivos con branding y múltiples secciones |
| **UI/UX** | ✅ Completo | Interfaz oscura profesional, responsiva, con animaciones |
| **Gestión de bloqueados** | ✅ Completo | Lista de URLs bloqueadas por usuario |
| **Alertas de correo** | ⚠️ Parcial | Configuración UI implementada; envío real depende de integración SMTP adicional |
| **APIs externas de reputación** | ⚠️ No integrado | El análisis es heurístico local; sin integración a VirusTotal / Google Safe Browsing |
| **Panel de administración** | ❌ No incluido | No existe panel multi-tenant o de administración centralizada |
| **Tests automatizados** | ❌ No incluido | No se incluyen suites de testing |

### Versión: `0.0.1` — Producto MVP funcional listo para comercialización o desarrollo adicional.

---

## Posibles Usos Comerciales

### Empresas y Corporaciones
- **Herramienta interna de ciberseguridad** para que empleados verifiquen enlaces antes de hacer clic (reducción de riesgo de phishing corporativo)
- **Integración en flujos de onboarding** de ciberseguridad para nuevos empleados
- **Módulo de auditoría** de URLs en correos internos sospechosos

### Educación y Formación
- **Plataforma de entrenamiento** en ciberseguridad para universidades y cursos de seguridad informática
- **Herramienta de concienciación** para talleres y programas de awareness de phishing
- **Laboratorio práctico** para estudiantes de ciberseguridad y hacking ético

### Ciberseguridad Profesional
- **Base para un producto SaaS** con planes de pago por usuario o por volumen de análisis
- **Extensión a API REST propia** para integrar el motor heurístico en terceras aplicaciones
- **White-label** para revendedores o proveedores de servicios de seguridad gestionada (MSSP)

### Particulares y Autónomos
- **Servicio de verificación personal** de links recibidos por WhatsApp, email o redes sociales
- **Complemento de seguridad** para personas mayores o usuarios no técnicos con alto riesgo de victimización

---

## Activos Incluidos en una Posible Venta

| Activo | Descripción |
|---|---|
| **Código fuente completo** | 100% del repositorio incluyendo componentes, motor de análisis y configuración |
| **Motor heurístico de detección** | Algoritmo propietario con 11 indicadores de phishing en TypeScript |
| **Sistema de generación de PDFs** | Módulo completo de reportes ejecutivos con branding embebido |
| **Esquema de base de datos** | Script SQL con tabla, índices y políticas RLS para Supabase |
| **Sistema de autenticación** | Integración completa con Supabase Auth (email + Google OAuth) |
| **Diseño UI/UX** | Sistema de diseño oscuro profesional basado en Shadcn/Radix UI |
| **Branding** | Logo e identidad visual integrados (nombre PhishingSecureJD transferible) |
| **Documentación técnica** | README, TECHNICAL_DOCUMENTATION.md, SALE_OVERVIEW.md y esta ficha técnica |
| **Configuración de despliegue** | Configuración lista para Replit, Vercel y cualquier hosting de archivos estáticos |
| **Migraciones SQL** | Scripts de base de datos versionados y reproducibles |

---

*Documento generado el 30 de mayo de 2026. PhishingSecureJD — Todos los derechos reservados.*
