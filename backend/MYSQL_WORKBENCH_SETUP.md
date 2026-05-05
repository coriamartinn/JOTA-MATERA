# 🗄️ Guía de Configuración: MySQL Workbench (SIN Docker)

## 📋 Para tu amigo sin virtualización habilitada

Si tu amigo tiene MySQL instalado localmente pero sin Docker/virtualización, sigue estos pasos:

---

## 1️⃣ Verificar que MySQL está corriendo

### En Windows:

```powershell
# Abrir PowerShell como administrador
Get-Service | Where-Object {$_.Name -like "*MySQL*"}

# Debería salir algo como:
# Status   Name                DisplayName
# ------   ----                -----------
# Running  MySQL80             MySQL80
```

Si no está corriendo:

```powershell
# Iniciar el servicio MySQL
Start-Service -Name MySQL80

# O abrir MySQL Workbench directamente (se conectará automáticamente)
```

---

## 2️⃣ Configurar `.env` para MySQL local

En el archivo `.env` del backend:

```env
# Servidor
PORT=4015
NODE_ENV=development

# Base de datos - CONFIGURACIÓN PARA MYSQL LOCAL
DB_TYPE=mysql
DB_HOST=127.0.0.1          # ← Usar 127.0.0.1 en lugar de localhost
DB_PORT=3306               # ← Puerto por defecto de MySQL (no 4013)
DB_USERNAME=root           # ← Tu usuario MySQL
DB_PASSWORD=root           # ← Tu contraseña MySQL
DB_DATABASE=JOTAMATERA_DB
DB_SYNCHRONIZE=true
DB_AUTO_LOAD_ENTITIES=true

CORS_ORIGIN=http://localhost:3000
```

### 🔑 Puntos IMPORTANTES:

- `DB_HOST=127.0.0.1` NO `localhost` (algunos problemas con localhost en Windows)
- `DB_PORT=3306` (puerto por defecto de MySQL, NO 4013 que es de Docker)
- Las credenciales deben coincidir con tu instalación MySQL

---

## 3️⃣ Crear la base de datos

### Opción A: Con MySQL Workbench (GUI - Fácil)

1. Abrir MySQL Workbench
2. Click derecho en la conexión → "Create Schema"
3. Nombre: `JOTAMATERA_DB`
4. Click "Apply"

### Opción B: Con comandos MySQL (Terminal)

```bash
mysql -u root -p
# Ingresar contraseña cuando pida

# Luego en el shell MySQL:
CREATE DATABASE JOTAMATERA_DB;
EXIT;
```

---

## 4️⃣ Iniciar la aplicación

```bash
cd d:\PROGRAMACION\proyectos\JotaMatera\backend

# Instalar dependencias (si no las tiene)
npm install

# Iniciar en desarrollo
npm run start:dev
```

La aplicación se conectará directamente a tu MySQL local.

---

## 🐛 Si hay problemas de conexión

### Error: "connect ECONNREFUSED 127.0.0.1:3306"

✅ **Solución**: MySQL no está corriendo

```powershell
# Verificar si MySQL está corriendo
Get-Service MySQL80

# Si no está corriendo, iniciarlo
Start-Service -Name MySQL80
```

### Error: "Access denied for user 'root'@'localhost'"

✅ **Solución**: Contraseña incorrecta en `.env`

- Verificar contraseña en `.env`
- Verificar contraseña en MySQL Workbench
- Deben ser iguales

### Error: "Unknown database 'JOTAMATERA_DB'"

✅ **Solución**: La base de datos no existe

- Crear la base de datos (ver sección 3️⃣)
- O dejar `DB_SYNCHRONIZE=true` para que TypeORM la cree automáticamente

---

## 📊 Ver datos en MySQL Workbench

1. Conectar a MySQL local en Workbench
2. En el panel izquierdo: `Schemas` → `JOTAMATERA_DB`
3. Ver tablas automáticamente creadas por TypeORM

---

## ✨ Ventajas de esta configuración

✅ No necesita Docker ni virtualización  
✅ Fácil de depurar en Workbench  
✅ Compatible con el código que usa el otro developer (con Docker)  
✅ El código es 100% igual, solo diferencia el `.env`

---

## 🔄 Comparación: Docker vs MySQL Local

| Aspecto          | Docker                  | MySQL Local     |
| ---------------- | ----------------------- | --------------- |
| **DB_HOST**      | `localhost`             | `127.0.0.1`     |
| **DB_PORT**      | `4013`                  | `3306`          |
| **Requiere**     | Docker + Virtualización | MySQL instalado |
| **GUI**          | Comandos terminal       | MySQL Workbench |
| **Velocidad**    | Depende                 | Más rápido      |
| **Compartir BD** | Fácil (docker-compose)  | Más complicado  |
