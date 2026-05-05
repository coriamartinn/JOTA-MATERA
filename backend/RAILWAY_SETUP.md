# 🚂 Guía Completa: Railway Setup

## 📋 ¿Qué es Railway?

Railway es una plataforma para hostear aplicaciones y bases de datos:
- ✅ MySQL, PostgreSQL, MongoDB
- ✅ Gratis con crédito inicial ($5)
- ✅ Perfecto para Vercel
- ✅ Super amigable

---

## 🚀 **Step 1: Crear Cuenta en Railway**

1. Abre: https://railway.app
2. Click en **"Start Free"**
3. **Registrarse con GitHub** (recomendado)
   - Click "Continue with GitHub"
   - Autorizar Railway
4. **Permitir acceso a tus repos** (opcional, pero útil)

✅ **Tienes acceso al dashboard**

---

## 2️⃣ **Step 2: Crear Base de Datos MySQL**

1. **En el Dashboard de Railway**
2. Click en **"+ New"** (esquina arriba a la derecha)
3. Click en **"Database"**
4. Seleccionar **"MySQL"**
5. **Esperar 1 minuto** a que se cree ⏳

✅ **Tu BD MySQL está creada**

---

## 3️⃣ **Step 3: Obtener las Credenciales**

### En el Dashboard:

1. Click en tu BD MySQL (debería estar en la lista)
2. Verás un panel con info
3. En la pestaña **"Variables"** verás:

   ```
   MYSQL_ROOT_PASSWORD = xxxxxx
   MYSQL_URL           = mysql://root:xxxx@container:3306
   MYSQL_USER          = root
   MYSQL_PASSWORD      = xxxxxx
   MYSQL_DB_NAME       = railway (o tu nombre)
   MYSQL_HOST          = container
   MYSQL_PORT          = 3306
   ```

4. **Copiar todos estos valores** 📋

### Para Vercel necesitamos:

```
DB_HOST     = railway.app (verlo abajo)
DB_PORT     = 3306
DB_USERNAME = root
DB_PASSWORD = (de MYSQL_ROOT_PASSWORD)
DB_DATABASE = railway
```

---

## 4️⃣ **Step 4: Encontrar el HOST público**

Railway hace que el BD sea **privada por defecto** (solo para apps en Railway).

Para Vercel, necesitas la URL pública:

1. En el panel de MySQL
2. Click en **"Connect"** (arriba)
3. Debería mostrarte un modal con opciones
4. Buscar la opción **"Public Network"** o **"Enable Public Access"**
5. Copiar el **HOST** que sale (algo como `railway.app`)

✅ Ahora está accesible desde Vercel

---

## 5️⃣ **Step 5: Crear la Base de Datos**

Railway crea una BD llamada `railway` por defecto.

### Opción A: Usar `railway` tal cual (Fácil)
```
DB_DATABASE = railway
```

### Opción B: Crear `JOTAMATERA_DB` (Recomendado)

Conectarse a Railway desde terminal:
```bash
mysql -h railway.app -P 3306 -u root -p

# Ingresar password
# Luego ejecutar:
CREATE DATABASE JOTAMATERA_DB;
EXIT;
```

O con MySQL Workbench:
1. Nuevo connection
2. Host: (el de Railway)
3. Port: 3306
4. Username: root
5. Password: (la de Railway)
6. Test connection
7. Right click → Create Schema → `JOTAMATERA_DB`

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
   DB_HOST              │ (tu host de Railway)
   DB_PORT              │ 3306
   DB_USERNAME          │ root
   DB_PASSWORD          │ (password de Railway - 🔐 SEGURO)
   DB_DATABASE          │ JOTAMATERA_DB (o railway)
   DB_SYNCHRONIZE       │ false
   DB_AUTO_LOAD_ENTITIES│ true
   ```

5. Click **"Save"**

✅ **Variables guardadas**

---

## 7️⃣ **Step 7: Redeploy en Vercel**

1. Ve a **Deployments** del backend
2. Click en el último deployment
3. Click en **"..."** → **"Redeploy"**
4. **Esperar a que se complete** ⏳

✅ **Backend conectado a Railway MySQL**

---

## ✅ **Verificar que funcionó**

### Opción A: Desde tu navegador
```
https://jota-matera-vopt.vercel.app/
```

### Opción B: Desde tu PC
```bash
npm run start:dev

# Debería conectarse a Railway MySQL
```

### Opción C: Ver logs en Vercel
1. Dashboard → Deployment del backend
2. Click en **"View Function Logs"**
3. No debe haber errores de conexión

---

## 🗄️ **Migrar datos de Docker MySQL a Railway**

Si tenías datos en Docker y quieres pasarlos:

### Exportar de Docker:
```bash
docker exec jotamatera_mysql mysqldump -u root -proot JOTAMATERA_DB > backup.sql
```

### Importar a Railway:
```bash
# Reemplazar con tus datos de Railway
mysql -h railway.app -u root -p JOTAMATERA_DB < backup.sql

# Ingresar password cuando pida
```

---

## 💰 **Créditos Gratis de Railway**

✅ **$5 gratis** al registrarse (más que suficiente para 1-2 meses)
✅ BD MySQL típicamente usa $0.50-1 por mes

Monitorear uso:
- Dashboard → Click en MySQL
- Pestaña **"Metrics"**
- Ver CPU, memoria, conexiones

---

## 🔒 **Seguridad**

✅ Vercel cifra credenciales automáticamente (🔐)
✅ No commitear archivos `.env` con passwords reales
✅ Variables en Vercel Dashboard son privadas

---

## 🐛 **Troubleshooting**

### Error: "connect ECONNREFUSED railway.app"
✅ Verificar que el BD está en Railway
✅ Verificar que "Public Network" está habilitado
✅ Credenciales correctas

### Error: "Access denied for user 'root'@'vercel-ip'"
✅ Password incorreta o BD no acepta conexiones externas
✅ En Railway Dashboard → MySQL → Settings → Verificar acceso

### Créditos se agotaron
✅ Railway avisa cuando estás bajo
✅ Puedes agregar tarjeta o crear nueva cuenta

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
│  └─ DB_* = Railway MySQL         │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│  railway.app:3306                │
│  MySQL Database - Railway        │
│  JOTAMATERA_DB                   │
└──────────────────────────────────┘
```

---

## ✨ **Checklist Final**

- [ ] Cuenta en Railway creada
- [ ] BD MySQL creada
- [ ] Public Network habilitado
- [ ] Credenciales obtenidas
- [ ] BD `JOTAMATERA_DB` creada (o usar `railway`)
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
- Base de datos en Railway

**¿Necesitas ayuda con algo específico?**
