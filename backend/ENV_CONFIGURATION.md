# 📋 Guía de Configuración .env

## 📁 Archivos creados/actualizados

### 1. **`.env`** - Archivo de configuración (LOCAL)

- **NUNCA** comitear este archivo (ya está en `.gitignore` idealmente)
- Contiene valores reales para tu máquina local
- Se carga automáticamente al iniciar NestJS

### 2. **`.env.example`** - Plantilla de referencia (COMMITEABLE)

- Comitear este archivo al repositorio
- Los desarrolladores lo copian a `.env` como referencia
- Útil para documentar qué variables se necesitan

## 🔧 Variables de configuración disponibles

### Servidor

```
PORT=4015                    # Puerto donde corre la app
NODE_ENV=development         # development | production
```

### Base de datos

```
DB_TYPE=mysql                # Tipo de base de datos
DB_HOST=localhost            # Host del servidor BD
DB_PORT=4013                 # Puerto BD (Docker)
DB_USERNAME=root             # Usuario BD
DB_PASSWORD=root             # Contraseña BD
DB_DATABASE=JOTAMATERA_DB    # Nombre de la BD
DB_SYNCHRONIZE=true          # Auto-sincronizar entidades
DB_AUTO_LOAD_ENTITIES=true   # Cargar entidades automáticamente
```

### CORS

```
CORS_ORIGIN=http://localhost:3000  # Origen permitido para CORS
```

## 🚀 Cómo usar

### 1️⃣ **Con Docker (Con virtualización habilitada)**

Archivo `.env`:

```
DB_HOST=localhost
DB_PORT=4013
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=JOTAMATERA_DB
```

Comandos:

```bash
# Levantar Base de Datos en Docker
docker-compose up -d

# Iniciar la aplicación (se conecta al Docker)
npm run start:dev
```

---

### 2️⃣ **Con MySQL Workbench Local (SIN virtualización)**

Archivo `.env`:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña_local
DB_DATABASE=JOTAMATERA_DB
```

Pasos:

1. Tener MySQL instalado y corriendo en tu máquina
2. Crear la base de datos `JOTAMATERA_DB`
3. Actualizar `.env` con tus credenciales reales
4. Iniciar la aplicación:
   ```bash
   npm run start:dev
   ```

---

### 3️⃣ **Producción**

1. Cambiar `NODE_ENV=production`
2. Usar credenciales reales y seguras
3. NO commitear el `.env` de producción
4. Pasar variables via:
   - Variables de entorno del sistema
   - Docker secrets
   - Archivos .env seguros (en servidor)

## 📝 Nota importante

✅ Archivos para commitear:

- `.env.example` ← SIEMPRE

❌ Archivos para IGNORAR:

- `.env` ← NUNCA commitear (contiene credenciales locales)
- Agrega a `.gitignore`:
  ```
  .env
  .env.local
  .env.*.local
  ```

## 🔄 Cómo agregó ConfigService

### Antes (MALO - Valores hardcodeados):

```typescript
TypeOrmModule.forRoot({
  host: 'localhost',
  port: 4013,
  password: 'root',
  // ...
});
```

### Ahora (BIEN - Usa variables de entorno):

```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    password: configService.get<string>('DB_PASSWORD'),
    // ...
  }),
});
```

## ✨ Ventajas

✅ Fácil cambiar configuración sin recompilar  
✅ Diferentes valores por ambiente (dev, staging, prod)  
✅ No exponer credenciales en el código  
✅ Compatible con Docker y CI/CD  
✅ Variables opcionales con valores por defecto

---

## 👥 **Para el equipo: Cada uno su configuración**

**La magia de `.env`**: Cada desarrollador puede tener su `.env` diferente sin afectar al código.

### Ejemplo de equipo con diferentes setups:

**Developer 1** (usa Docker):

```
# .env (Dev 1)
DB_HOST=localhost
DB_PORT=4013
```

**Developer 2** (usa MySQL Workbench):

```
# .env (Dev 2)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_PASSWORD=su_contraseña_local
```

**El repositorio**:

```
# .env.example (COMMITEADO - plantilla)
DB_HOST=localhost
DB_PORT=4013
DB_USERNAME=root
DB_PASSWORD=root
```

✅ Cada uno copia `.env.example` → `.env` y personaliza según su setup  
✅ El código es exactamente igual para todos  
✅ **Nunca** hay conflictos de merge en `.env`
