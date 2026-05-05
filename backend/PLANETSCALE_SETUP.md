# 🌍 Guía Completa: PlanetScale Setup

## 📋 ¿Qué es PlanetScale?

PlanetScale es una base de datos MySQL en la nube, ideal para Vercel:
- ✅ MySQL 8.0 compatible
- ✅ Gratis hasta 5GB
- ✅ Sin tarjeta de crédito
- ✅ Súper fácil de conectar

---

## 🚀 **Step 1: Crear Cuenta en PlanetScale**

1. Abre: https://planetscale.com
2. Click en **"Start Free"**
3. **Opción A**: Registrarse con GitHub (recomendado)
4. **Opción B**: Email y contraseña
5. Confirmar email

✅ **Ahora tienes acceso al dashboard**

---

## 2️⃣ **Step 2: Crear tu primera Base de Datos**

1. **En el Dashboard de PlanetScale**
2. Click en **"Create a new database"** o **"+ Create"**
3. Llenar el formulario:

   ```
   Database name: JOTAMATERA_DB
   Region:        us-west (o la más cercana a ti)
   ```

4. Click **"Create database"**
5. **Esperar 30 segundos** a que se cree ⏳

✅ **Tu BD está creada**

---

## 3️⃣ **Step 3: Obtener la Connection String**

1. **En el Dashboard** → Click en `JOTAMATERA_DB`
2. Click en **"Connect"** (botón azul)
3. En el modal que aparece:
   - Select: **"Node.js"** (o MySQL)
   - Debería mostrarte algo como:

   ```
   mysql://xxxxxx:xxxxxx@aws.connect.psdb.cloud:3306/JOTAMATERA_DB?sslaccept=strict
   ```

4. **Copiar la connection string completa** 📋

---

## 4️⃣ **Step 4: Extraer Credenciales**

De la connection string:
```
mysql://username:password@host:port/database?param=value
```

Extrae:

| Variable | Valor |
|----------|-------|
| `DB_HOST` | `aws.connect.psdb.cloud` |
| `DB_PORT` | `3306` |
| `DB_USERNAME` | Tu username (antes de `:`) |
| `DB_PASSWORD` | Tu password (entre `:` y `@`) |
| `DB_DATABASE` | `JOTAMATERA_DB` |

**Ejemplo real:**
```
mysql://abc123xyz:pw456def@aws.connect.psdb.cloud:3306/JOTAMATERA_DB

Extrae:
- DB_USERNAME = abc123xyz
- DB_PASSWORD = pw456def
- DB_HOST = aws.connect.psdb.cloud
- DB_PORT = 3306
- DB_DATABASE = JOTAMATERA_DB
```

---

## 5️⃣ **Step 5: Agregar a Vercel**

### En Vercel Dashboard:

1. Ve a tu proyecto **jota-matera-vopt** (Backend)
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. Agregar estas 6 variables:

   ```
   KEY                  │ VALUE
   ─────────────────────┼──────────────────────────────
   NODE_ENV             │ production
   PORT                 │ 3000
   CORS_ORIGIN          │ https://jotamatera.coriadev.com
   DB_HOST              │ aws.connect.psdb.cloud
   DB_PORT              │ 3306
   DB_USERNAME          │ abc123xyz (tu valor)
   DB_PASSWORD          │ pw456def (tu valor - 🔐 SEGURO)
   DB_DATABASE          │ JOTAMATERA_DB
   DB_SYNCHRONIZE       │ false
   DB_AUTO_LOAD_ENTITIES│ true
   ```

5. Click **"Save"**

✅ **Variables guardadas**

---

## 6️⃣ **Step 6: Redeploy en Vercel**

1. Ve a **Deployments** del backend
2. Click en el último deployment
3. Click en **"..."** → **"Redeploy"**
4. **Esperar a que se complete** ⏳

✅ **Backend conectado a PlanetScale**

---

## ✅ **Verificar que funcionó**

### Opción A: Desde tu navegador
```
https://jota-matera-vopt.vercel.app/
```

Debería dar un response (aunque sea un 404 o información sobre endpoints)

### Opción B: Desde tu PC
```bash
# En la carpeta del backend
npm run start:dev

# Si todo funciona, debería conectarse a PlanetScale
```

### Opción C: Ver logs en Vercel
1. Dashboard → Deployment del backend
2. Click en **"View Function Logs"**
3. No debe haber errores de conexión

---

## 🗄️ **Migrar datos de Docker MySQL a PlanetScale**

Si tenías datos en tu Docker MySQL y quieres pasarlos:

### Exportar de Docker:
```bash
docker exec jotamatera_mysql mysqldump -u root -proot JOTAMATERA_DB > backup.sql
```

### Importar a PlanetScale:
```bash
# Desde la terminal en tu PC
mysql -h aws.connect.psdb.cloud -u abc123xyz -p JOTAMATERA_DB < backup.sql

# Ingresar el password cuando pida
```

O usar MySQL Workbench:
1. Crear nueva conexión con datos de PlanetScale
2. File → Open SQL Script → `backup.sql`
3. Execute

---

## 🔒 **Seguridad - IMPORTANTE**

✅ **PlanetScale cifra** las credenciales automáticamente (🔐)  
✅ **No commitear** archivos `.env` con passwords reales  
✅ **Las variables en Vercel** son privadas y seguras  

---

## 🐛 **Troubleshooting**

### Error: "Lost connection to MySQL"
✅ Verificar que `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` sean correctos

### Error: "Unknown database JOTAMATERA_DB"
✅ La BD se creó vacía, pero TypeORM debería crearla con `DB_SYNCHRONIZE=true`
✅ Si falla, cambiar a `DB_SYNCHRONIZE=true` temporalmente, redeploy, luego cambiar a `false`

### ¿Datos no persisten?
✅ Verificar `DB_SYNCHRONIZE=false` (no overwrite tablas)
✅ Revisar logs en Vercel

### Conexión lenta
✅ PlanetScale está en USA, puede tardar si estás lejos
✅ Normal en desarrollo, en producción es muy rápido

---

## 📊 **Estructura Final**

```
┌──────────────────────────────────┐
│  jotamatera.coriadev.com (Frontend) │
│  Vercel                          │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│  jota-matera-vopt.vercel.app     │
│  Backend NestJS - Vercel         │
│  ├─ NODE_ENV=production          │
│  ├─ CORS_ORIGIN=jotamatera...    │
│  └─ DB_* = PlanetScale           │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│  aws.connect.psdb.cloud:3306     │
│  MySQL Database - PlanetScale    │
│  JOTAMATERA_DB                   │
└──────────────────────────────────┘
```

---

## ✨ **Checklist Final**

- [ ] Cuenta en PlanetScale creada
- [ ] Base de datos `JOTAMATERA_DB` creada
- [ ] Connection string copiada
- [ ] Credenciales extraídas correctamente
- [ ] Variables agregadas en Vercel Dashboard
- [ ] Backend redeployado
- [ ] Verificar sin errores de conexión
- [ ] Frontend conecta al backend
- [ ] ¡Celebrar! 🎉

---

## 🚀 **¡Listo!**

Tu aplicación está en producción con:
- Frontend en Vercel
- Backend en Vercel
- Base de datos en PlanetScale

**¿Necesitas ayuda con algo específico?**
