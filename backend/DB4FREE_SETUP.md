# 🗄️ Guía Completa: db4free.net Setup

## 📋 ¿Qué es db4free.net?

db4free.net ofrece MySQL gratis en la nube:
- ✅ MySQL 100% gratis
- ✅ Sin tarjeta de crédito
- ✅ Sin trial que expire
- ✅ 5GB de almacenamiento
- ✅ Acceso remoto desde Vercel
- ✅ Perfecto para desarrolladores

---

## 🚀 **Step 1: Crear Cuenta en db4free.net**

1. Abre: https://www.db4free.net
2. Click en **"Sign up"** (esquina superior derecha)
3. Llenar el formulario:

   ```
   Username:       tu_usuario (ej: coriamartinn)
   Password:       contraseña_fuerte
   Email:          tu@email.com
   Re-enter Pwd:   repetir contraseña
   ```

4. Aceptar términos
5. Click **"Sign up"**
6. **Confirmar email** (revisa tu bandeja)

✅ **Tienes acceso**

---

## 2️⃣ **Step 2: Crear Base de Datos**

1. **Login en db4free.net** con tu usuario y contraseña
2. Click en **"Create new database"** o similar
3. Llenar datos:

   ```
   DB Name:        JOTAMATERA_DB
   Username:       root (o tu preferencia)
   Password:       contraseña_fuerte
   ```

4. Click **"Create"**
5. **Esperar 1-2 minutos** a que se cree ⏳

✅ **Tu BD está creada**

---

## 3️⃣ **Step 3: Obtener Credenciales**

En el dashboard de db4free.net verás tu BD con:

```
Host:       db4free.net
Port:       3306
Database:   JOTAMATERA_DB
Username:   root (o el que pusiste)
Password:   (la que configuraste)
```

**Copiar estos valores** 📋

---

## 4️⃣ **Step 4: Probar conexión local**

Desde tu PC, verifica que funciona:

```bash
# Instalar mysql client (si no lo tienes)
# Windows: descargar MySQL Workbench o MySQL Shell

# Conectar
mysql -h db4free.net -u root -p JOTAMATERA_DB

# Te pedirá password, ingresar
# Si aparece "mysql>" es que funciona ✅
```

---

## 5️⃣ **Step 5: Actualizar .env.production**

En tu proyecto backend, editar o crear `.env.production`:

```env
# ============================================
# CONFIGURACIÓN DEL SERVIDOR - PRODUCCIÓN
# ============================================
PORT=3000
NODE_ENV=production

# ============================================
# CONFIGURACIÓN DE LA BASE DE DATOS - PRODUCCIÓN (db4free.net)
# ============================================
DB_TYPE=mysql
DB_HOST=db4free.net
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña_actual
DB_DATABASE=JOTAMATERA_DB
DB_SYNCHRONIZE=false
DB_AUTO_LOAD_ENTITIES=true

# ============================================
# CONFIGURACIÓN DE CORS - PRODUCCIÓN
# ============================================
CORS_ORIGIN=https://jotamatera.coriadev.com
```

⚠️ **Importante:** No commitear `.env.production` con contraseña real

---

## 6️⃣ **Step 6: Agregar a Vercel**

### En Vercel Dashboard:

1. Ve a tu proyecto **jota-matera-vopt** (Backend)
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. Agregar estas variables:

   ```
   KEY                  │ VALUE
   ─────────────────────┼──────────────────────────────
   NODE_ENV             │ production
   PORT                 │ 3000
   CORS_ORIGIN          │ https://jotamatera.coriadev.com
   DB_HOST              │ db4free.net
   DB_PORT              │ 3306
   DB_USERNAME          │ root
   DB_PASSWORD          │ tu_contraseña (🔐 SEGURO)
   DB_DATABASE          │ JOTAMATERA_DB
   DB_SYNCHRONIZE       │ false
   DB_AUTO_LOAD_ENTITIES│ true
   ```

5. Click **"Save"**

✅ **Variables guardadas en Vercel**

---

## 7️⃣ **Step 7: Redeploy en Vercel**

1. Ve a **Deployments** del backend
2. Click en el último deployment
3. Click en **"..."** → **"Redeploy"**
4. **Esperar a que se complete** ⏳

✅ **Backend conectado a db4free.net MySQL**

---

## ✅ **Verificar que funcionó**

### Opción A: Desde tu navegador
```
https://jota-matera-vopt.vercel.app/
```

Debería responder sin errores de BD.

### Opción B: Ver logs en Vercel
1. Dashboard → Deployment del backend
2. Click en **"View Function Logs"**
3. No debe haber errores de conexión a BD

### Opción C: Desde tu PC (desarrollo)
```bash
cd d:\PROGRAMACION\proyectos\JotaMatera\backend

# Cambiar NODE_ENV temporalmente
set NODE_ENV=production

# O en PowerShell
$env:NODE_ENV = "production"

npm run start:prod
```

---

## 🗄️ **Migrar datos de Docker a db4free.net**

Si tenías datos en Docker MySQL y quieres pasarlos:

### Exportar de Docker:
```bash
docker exec jotamatera_mysql mysqldump -u root -proot JOTAMATERA_DB > backup.sql
```

### Importar a db4free.net:
```bash
mysql -h db4free.net -u root -p JOTAMATERA_DB < backup.sql

# Ingresar password cuando pida
```

---

## 🔒 **Seguridad**

✅ Vercel cifra credenciales automáticamente (🔐 mostrada como "encrypted")
✅ No commitear `.env.production` con contraseñas reales
✅ Variables en Vercel Dashboard son privadas

### .gitignore (verificar que tenga):
```
.env
.env.local
.env.*.local
.env.production  # Opcional si tiene credenciales reales
```

---

## 🐛 **Troubleshooting**

### Error: "connect ECONNREFUSED db4free.net:3306"
✅ Verificar credenciales en `.env.production`
✅ Verificar que DB está activa en db4free.net
✅ Esperar 1 minuto después de crear la BD

### Error: "Access denied for user 'root'@'xxx.xxx.xxx.xxx'"
✅ Contraseña incorrecta
✅ Usuario incorrecto
✅ Verificar en db4free.net dashboard

### Error: "Unknown database JOTAMATERA_DB"
✅ La BD no existe en db4free.net
✅ Crear desde el dashboard de db4free.net

### Error: "Too many connections"
✅ db4free tiene límite de conexiones
✅ Revisar pool de conexiones en NestJS
✅ Usar connection pooling si es necesario

---

## 📊 **Estructura Final en Producción**

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
│  └─ DB_* = db4free.net MySQL     │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│  db4free.net:3306                │
│  MySQL Database - Gratis 🆓      │
│  JOTAMATERA_DB                   │
└──────────────────────────────────┘
```

---

## 💰 **Ventajas de db4free.net**

✅ Totalmente gratis (sin trial)
✅ Sin tarjeta de crédito
✅ MySQL estándar (fácil migrar después)
✅ Acceso remoto desde cualquier lugar
✅ 5GB de almacenamiento (más que suficiente para desarrollo)
✅ Perfecto para aprender y proyectos pequeños

---

## 🚀 **Desarrollo vs Producción**

```
DESARROLLO (.env):
DB_HOST=localhost (Docker) o 127.0.0.1 (MySQL Workbench)
DB_PORT=4013 o 3306

PRODUCCIÓN (.env.production):
DB_HOST=db4free.net
DB_PORT=3306
```

Así puedes cambiar fácilmente según ambiente.

---

## ✨ **Checklist Final**

- [ ] Cuenta en db4free.net creada
- [ ] BD JOTAMATERA_DB creada
- [ ] Credenciales obtenidas
- [ ] Conexión probada desde local
- [ ] `.env.production` actualizado
- [ ] Variables en Vercel Dashboard configuradas
- [ ] Backend redeployado
- [ ] Sin errores de conexión en logs
- [ ] Frontend conecta al backend
- [ ] ¡Listo para producción! 🎉

---

## 📞 **Soporte db4free.net**

Si tienes problemas:
- https://www.db4free.net/contact.php
- Documentación: https://www.db4free.net

---

**¡Tu aplicación está lista para producción con BD gratis! 🚀**
