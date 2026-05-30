# PhishingSecureJD — Resumen para Compradores

**Producto digital listo para comercializar · MVP 100 % funcional · Coste operativo $0 USD**

---

## ¿Qué es lo que estás adquiriendo?

**PhishingSecureJD** es una plataforma web completa de detección de phishing en tiempo real, desarrollada como Single Page Application (SPA) con stack moderno (React, Vite, Tailwind CSS, Supabase). El producto está operativo, desplegado en Netlify y preparado para rebrandeo, escalado comercial o integración en un portafolio de servicios de ciberseguridad.

No es un prototipo ni un mockup: es un **MVP funcional** con autenticación real, base de datos persistente, motor de análisis de URLs, historial por usuario, bloqueo de amenazas y exportación de reportes PDF.

---

## Transferencia de activos

Al completar la adquisición, el comprador recibe **transferencia completa** de los siguientes activos:

### 1. Código frontend (aplicación web)

| Activo | Descripción |
|--------|-------------|
| **Código fuente React + TypeScript** | SPA completa en la raíz del repositorio (`src/`) |
| **Componentes UI** | Login, dashboard, escáner, historial, bloqueos, configuración, documentación in-app |
| **Motor de detección** | Algoritmo heurístico propietario (~10 reglas de análisis) |
| **Integración Supabase** | Cliente configurado, contexto de auth, CRUD de historial |
| **Generación PDF** | Exportación client-side con jsPDF |
| **Estilos y diseño** | Tailwind CSS 4, modo oscuro/claro, diseño responsive premium |
| **Build system** | Vite 6 configurado, listo para `npm run build` |

**Estado del código:** Limpio, modular, sin dependencias de backend propio. Fácil de rebrandear (logo, colores, dominio) en horas, no semanas.

### 2. Esquema de base de datos (Supabase / PostgreSQL)

| Activo | Descripción |
|--------|-------------|
| **Scripts SQL de migración** | Carpeta `supabase/migrations/` con 3 scripts versionados |
| **Script principal** | `003_historial_accesos_app_schema.sql` — listo para ejecutar en SQL Editor |
| **Tabla `historial_accesos`** | Esquema alineado con la aplicación |
| **Políticas RLS** | SELECT, INSERT, UPDATE, DELETE aisladas por `usuario_id` |
| **Índices optimizados** | Por usuario, email y fecha de creación |

El comprador puede **clonar la base de datos en su propio proyecto Supabase** en menos de 5 minutos ejecutando un único script SQL.

### 3. Documentación

| Documento | Contenido |
|-----------|-----------|
| **README.md** | Descripción del producto, características, instalación local, despliegue |
| **TECHNICAL_DOCUMENTATION.md** | Arquitectura, RLS, flujos, APIs, autenticación, diagramas |
| **SALE_OVERVIEW.md** | Este documento: activos, estado, monetización |
| **.env.example** | Plantilla de variables de entorno |
| **Documentación in-app** | Sección "Documentación" dentro de la aplicación para usuarios finales |

### 4. Activos de despliegue

| Activo | Descripción |
|--------|-------------|
| **Configuración Netlify** | Build command, publish directory, variables de entorno documentadas |
| **Build de producción** | `dist/` generable con un comando |
| **Dominio configurable** | El comprador apunta su dominio a Netlify o migra a Vercel/Cloudflare Pages |

### 5. Lo que NO está incluido (expectativas claras)

- Cuenta Supabase del vendedor (el comprador crea la suya).
- Cuenta Netlify del vendedor (el comprador despliega en la suya).
- Dominio personalizado registrado.
- Usuarios finales ni datos de producción existentes.
- Soporte post-venta (negociable por separado).

---

## Estado actual del producto

### MVP 100 % funcional

| Funcionalidad | Estado |
|---------------|--------|
| Registro e inicio de sesión (email/password) | ✅ Operativo |
| Recuperación de contraseña | ✅ Operativo |
| OAuth Google (configurable en Supabase) | ✅ Preparado |
| Escaneo y análisis de URLs | ✅ Operativo |
| Puntuación de riesgo y motivos detallados | ✅ Operativo |
| Persistencia de historial por usuario | ✅ Operativo |
| Bloqueo / desbloqueo de URLs | ✅ Operativo |
| Estadísticas del dashboard | ✅ Operativo |
| Exportación de reportes PDF | ✅ Operativo |
| Modo oscuro / claro | ✅ Operativo |
| Diseño responsive | ✅ Operativo |
| Documentación in-app | ✅ Operativo |

### Infraestructura en producción

| Servicio | Rol | Tier utilizado |
|----------|-----|----------------|
| **Netlify** | Hosting estático + CDN + HTTPS | Free |
| **Supabase** | Auth + PostgreSQL | Free |
| **APIs públicas** | IP/Geo, SSL (enriquecimiento) | Free tiers |

### Coste de mantenimiento: **$0 USD / mes**

Gracias al stack **Jamstack + BaaS**, el producto opera sin servidores, sin bases de datos autogestionadas y sin licencias de software. Las capas gratuitas de Netlify y Supabase cubren cómodamente un MVP con cientos de usuarios activos.

| Escala estimada | Supabase Free | Netlify Free | Coste mensual |
|-----------------|---------------|--------------|---------------|
| 0 – 500 usuarios | ✅ Suficiente | ✅ Suficiente | **$0** |
| 500 – 5,000 usuarios | ⚠️ Evaluar Pro | ✅ Suficiente | **$0 – $25** |
| 5,000+ usuarios | Pro ($25/mes) | Pro ($19/mes) | **~$44** |

> El margen operativo es excelente para un modelo SaaS: los costes de infraestructura son mínimos hasta escala significativa.

---

## Vías de monetización

PhishingSecureJD está diseñado como **plataforma escalable** con múltiples caminos comerciales. A continuación, las estrategias más viables ordenadas por facilidad de implementación.

---

### 1. Modelo SaaS (Software as a Service)

**Descripción:** Ofrecer la plataforma como servicio por suscripción mensual o anual.

| Plan sugerido | Precio orientativo | Límites |
|---------------|-------------------|---------|
| **Free** | $0 | 10 análisis/día, historial 7 días |
| **Pro** | $9.99/mes | Análisis ilimitados, PDF, alertas email |
| **Business** | $29.99/mes | Multi-usuario, API access, soporte prioritario |
| **Enterprise** | Custom | SSO, SLA, integraciones custom |

**Implementación técnica:**

- Añadir tabla `subscriptions` en Supabase con Stripe Checkout.
- Limitar análisis por `user_id` con RLS + Edge Function.
- React Router + landing page de pricing.

**Ventaja competitiva:** Coste operativo casi nulo → márgenes del 85–95 % en planes de pago.

**Mercado objetivo:** Freelancers, consultores de IT, equipos remotos, familias conscientes de la seguridad.

---

### 2. Venta B2B para PyMEs (Pequeñas y Medianas Empresas)

**Descripción:** Licenciar la plataforma a empresas que quieren proteger a sus empleados del phishing sin invertir en soluciones enterprise costosas (KnowBe4, Proofpoint, etc.).

| Propuesta de valor | Detalle |
|--------------------|---------|
| **White-label** | Rebrandear con logo y colores del cliente en horas |
| **Capacitación** | Herramienta de entrenamiento: empleados analizan URLs reales |
| **Reportes** | PDFs ejecutivos para auditorías de compliance |
| **Precio B2B** | $199 – $499/mes por empresa (hasta 50 usuarios) |

**Casos de uso:**

- Oficinas contables que reciben emails de "facturas falsas".
- Clínicas médicas con datos sensibles (HIPAA awareness).
- Despachos legales objetivo de fraude por suplantación.
- Cooperativas y PYMEs latinoamericanas sin presupuesto para SOC.

**Canal de venta:** LinkedIn, cámaras de comercio, partners MSP (Managed Service Providers).

---

### 3. Herramienta educativa y de concienciación

**Descripción:** Posicionar PhishingSecureJD como plataforma de **formación en ciberseguridad** para escuelas, universidades, bootcamps y programas corporativos de awareness.

| Modelo | Ejemplo |
|--------|---------|
| **Licencia institucional** | $500 – $2,000/año por centro educativo |
| **Talleres pagados** | Curso "Detecta phishing en 30 minutos" + acceso a la plataforma |
| **Certificados** | Emitir certificado PDF al completar N análisis correctos |
| **Contenido premium** | Módulos de lecciones integrados en la sección Documentación |

**Diferenciador:** A diferencia de simuladores de phishing que envían emails falsos, esta herramienta empodera al usuario para **analizar URLs reales** que encuentra en su día a día.

**Mercado:** LATAM en crecimiento de regulación de protección de datos (LFPDPPP México, Habeas Data Colombia, LPDP Ecuador).

---

### 4. Venta de API de análisis de URLs

**Descripción:** Exponer el motor de detección como **API REST** para desarrolladores, integradores y otros productos SaaS.

| Endpoint sugerido | Respuesta |
|-------------------|-----------|
| `POST /api/v1/analyze` | `{ url, score, risk, reasons[], estado }` |

**Implementación:**

- Migrar `analyzeUrlForPhishing()` a **Supabase Edge Function** o **Netlify Function**.
- Autenticación por API key con rate limiting.
- Documentación OpenAPI / Swagger.

**Pricing API:**

| Tier | Precio | Requests/mes |
|------|--------|--------------|
| Developer | $0 | 1,000 |
| Startup | $49/mes | 50,000 |
| Growth | $199/mes | 500,000 |
| Enterprise | Custom | Ilimitado + SLA |

**Clientes potenciales:**

- Extensiones de navegador (Chrome/Firefox).
- Clientes de email que quieren escanear links antes de abrir.
- Plataformas de ticketing / helpdesk.
- Chatbots de WhatsApp Business para PyMEs.

---

### 5. Otras vías complementarias

| Vía | Descripción | Ingreso estimado |
|-----|-------------|------------------|
| **Freemium + Ads** | Versión gratuita con anuncios discretos de productos de seguridad | Bajo–Medio |
| **Affiliate marketing** | Links de afiliado a antivirus, VPNs, cursos de seguridad | Medio |
| **Consultoría + producto** | Vender implementación custom + la licencia del software | Alto (servicios) |
| **Marketplace (Flippa, Acquire.com)** | Reventa del activo digital a otro comprador | One-time |
| **App móvil (PWA)** | Convertir a Progressive Web App instalable | Amplía mercado |

---

## Matriz de decisión rápida

```
¿Tienes audiencia B2C?          → SaaS Freemium
¿Tienes contactos empresariales? → B2B White-label
¿Eres educador / formador?       → Licencia institucional
¿Eres desarrollador / integrador?→ API as a Service
¿Quieres ingreso pasivo?         → SaaS + SEO + contenido
```

---

## Roadmap sugerido post-adquisición (90 días)

| Semana | Acción | Impacto comercial |
|--------|--------|-------------------|
| 1–2 | Rebrandeo (logo, dominio, colores) | Identidad propia |
| 2–3 | Despliegue en Netlify + Supabase propio | Producción independiente |
| 3–4 | Landing page + pricing | Conversión SaaS |
| 4–6 | Integrar Stripe + planes | Primeros ingresos |
| 6–8 | Conectar APIs IP/SSL en tiempo real | Diferenciación técnica |
| 8–10 | SEO + contenido ("cómo detectar phishing") | Tráfico orgánico |
| 10–12 | Outreach B2B (10 empresas piloto) | Validación de mercado |

---

## Resumen ejecutivo para el comprador

| Aspecto | Valor |
|---------|-------|
| **Tipo de activo** | Aplicación web SaaS-ready |
| **Estado** | MVP 100 % funcional |
| **Stack** | React + Vite + Tailwind + Supabase |
| **Hosting** | Netlify (gratis) |
| **Base de datos** | PostgreSQL Supabase (gratis) |
| **Coste operativo** | $0 USD/mes (tier gratuito) |
| **Tiempo para rebrandear** | 2–8 horas |
| **Tiempo para producción propia** | 1–2 horas (Supabase + Netlify) |
| **Monetización** | SaaS, B2B, educación, API |
| **Mercado** | Ciberseguridad awareness, LATAM + global |
| **Escalabilidad** | Alta (Jamstack + BaaS) |

---

## Contacto y transferencia

La transferencia incluye:

1. Repositorio Git completo (código fuente).
2. Documentación técnica y comercial (este paquete).
3. Scripts SQL para clonar la base de datos.
4. Guía de despliegue paso a paso.

El comprador obtiene **propiedad total del código** y libertad para modificar, comercializar, sublicenciar o revender el producto según los términos acordados en la transacción.

---

**PhishingSecureJD** — Un activo digital de ciberseguridad listo para generar ingresos desde el día uno.
