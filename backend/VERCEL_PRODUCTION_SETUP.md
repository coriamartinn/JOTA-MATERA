# 🚀 Guía de Configuración: Vercel (Producción)

## 📋 Para deployar Backend en Vercel

### 1️⃣ Crear archivo `vercel.json` en la raíz del backend

En `d:\PROGRAMACION\proyectos\JotaMatera\backend\vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "public": false,
  "functions": {
    "src/main.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts"
    }
  ]
}
```

### 2️⃣ Actualizar `package.json` scripts

Verificar que tenga:

```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main"
  }
}
```

### 3️⃣ Configurar variables de entorno en Vercel Dashboard

🌐 **Dashboard de Vercel** → Tu proyecto → **Settings** → **Environment Variables**

Agregar estas variables:

```
NODE_ENV              → production
PORT                  → 3000
CORS_ORIGIN           → https://jotamatera.coriadev.com

DB_HOST               → Tu host MySQL real (ej: sql123.example.com)
DB_PORT               → Tu puerto MySQL (ej: 3306)
DB_USERNAME           → Tu usuario MySQL
DB_PASSWORD           → Tu contraseña MySQL (⚠️ SEGURO)
DB_DATABASE           → JOTAMATERA_DB
DB_SYNCHRONIZE        → false
DB_AUTO_LOAD_ENTITIES → true
```

⚠️ **IMPORTANTE:**

- Las variables de **producción** NO van en Git
- Vercel las protege automáticamente (🔐 mostrada como "encrypted")
- Cada deployment usa estas variables

---

## 🔗 Conectar Frontend → Backend en Producción

El Frontend en Vercel necesita saber dónde está el Backend.

### Para tu Frontend (React/Vite):

Crear archivo `.env.production`:

```env
VITE_API_URL=https://jota-matera-vopt.vercel.app
```

Luego en tu código:

```javascript
// src/config/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4015';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para CORS
});
```

---

## ✅ Checklist de Producción

- [ ] Backend deployado en Vercel
- [ ] Frontend deployado en Vercel
- [ ] Variables de entorno configuradas en Vercel Dashboard
- [ ] `CORS_ORIGIN` en backend apunta al dominio del frontend
- [ ] Frontend `.env.production` apunta a la URL correcta del backend
- [ ] Base de datos accesible desde Vercel (IP whitelisted si es necesario)
- [ ] `DB_SYNCHRONIZE=false` en producción (no auto-crear tablas)
- [ ] Logs revisados sin errores de conexión

---

## 🐛 Troubleshooting

### Error: "CORS policy blocked"

✅ **Solución:**

- Verificar `CORS_ORIGIN` en `.env.production`
- Debe ser: `https://jotamatera.coriadev.com` (SIN trailing slash en Vercel)
- Hacer redeploy

### Error: "Cannot connect to database"

✅ **Solución:**

- Verificar credenciales en Vercel Dashboard
- Verificar que tu BD permite conexiones desde Vercel (IP whitelisting)
- Revisar logs en Vercel → Deployments → Logs

### Frontend dice "API_URL is undefined"

✅ **Solución:**

- Verificar que frontend tiene `.env.production`
- Variable debe empezar con `VITE_` (para Vite)
- Redeploy del frontend

---

## 📊 Estructura de URLs en Producción

```
┌─────────────────────────────────────────────────────┐
│         USUARIO VISITA: jotamatera.coriadev.com    │
└──────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│    FRONTEND (Vercel)                                │
│    https://jotamatera.coriadev.com                  │
│    ├─ Recibe requests del usuario                   │
│    └─ Hace requests a: https://jota-matera-vopt... │
└──────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│    BACKEND (Vercel)                                 │
│    https://jota-matera-vopt.vercel.app              │
│    ├─ Procesa requests                              │
│    └─ Conecta a BD MySQL                            │
└──────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│    DATABASE (MySQL)                                 │
│    Tus datos guardados                              │
└──────────────────────────────────────────────────────┘
```

---

## 🔒 Seguridad en Producción

✅ **Hacer:**

- Usar `DB_SYNCHRONIZE=false` (no auto-migrar)
- Credenciales en Vercel Dashboard (encrypted)
- CORS solo con dominio del frontend
- Usar HTTPS (automático en Vercel)

❌ **NO hacer:**

- Commitear `.env.production` con credenciales reales
- Usar `DB_SYNCHRONIZE=true` en producción
- Dejar CORS abierto (origin: '\*')
- Usar contraseñas débiles
