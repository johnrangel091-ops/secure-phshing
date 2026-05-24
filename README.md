# Phishing Secure

Aplicacion de analisis de URLs con autenticacion e historial en Supabase.

## Configuracion

1. Instala dependencias:

```bash
pnpm install
```

2. Copia las variables de entorno (si no existe `.env`):

```bash
cp .env.example .env
```

Edita `.env` con tu URL y clave anon de Supabase.

3. **Importante:** en el panel de Supabase → **SQL Editor**, ejecuta el script:

`supabase/migrations/003_historial_accesos_app_schema.sql`

Esto crea la tabla `historial_accesos` con el esquema que usa la app.

4. Inicia el servidor:

```bash
pnpm dev
```

La app **no** funciona en modo local: requiere `.env` con Supabase configurado.

## Variables de entorno

| Variable | Descripcion |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave publica anon |
| `VITE_DEV_SUPABASE_REDIRECT_URL` | (opcional) URL de callback OAuth |
