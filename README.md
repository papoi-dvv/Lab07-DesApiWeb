# Express Mongo Auth - Frontend Integration

Una aplicación web completa de autenticación y autorización con Express.js, MongoDB y EJS.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Roles de usuario (user, admin)
- ✅ Frontend con EJS y Materialize
- ✅ Protección de rutas con autenticación
- ✅ Dashboard de usuario y administrador
- ✅ Validación de contraseñas robusta
- ✅ Seed de usuario admin automático

## 📋 Requisitos

- Node.js (v14+)
- MongoDB (local o en la nube)
- npm o yarn

## 🔧 Instalación

### 1. Clonar e instalar dependencias

```bash
# Instalar paquetes
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y completar los valores:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/authdb

# JWT Configuration
JWT_SECRET=your-secure-secret-key
JWT_EXPIRES_IN=1h

# BCrypt Configuration
BCRYPT_SALT_ROUNDS=10

# Server Port
PORT=3000

# Seed Admin User
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin#123
```

### 3. Iniciar MongoDB

```bash
# En Windows (si usas MongoDB Community Edition)
mongod

# O usar MongoDB Atlas en la nube
# Actualizar MONGODB_URI en .env con tu connection string
```

### 4. Iniciar el servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en **http://localhost:3000**

## 📄 Páginas Principales

### 1. **Sign In** (`/signIn`)
- Formulario de login con email y password
- Guarda JWT en sessionStorage
- Redirige a dashboard según rol

### 2. **Sign Up** (`/signUp`)
- Registro de nuevo usuario con campos:
  - Nombre, Apellido, Teléfono, Fecha de Nacimiento
  - Email, Contraseña
- Validación de contraseña robusta
- Redirige a Sign In después del registro

### 3. **Profile** (`/profile`)
- Muestra datos del usuario logueado
- Información personal completa
- Token JWT requerido

### 4. **Dashboard de Usuario** (`/dashboard`)
- Accesible solo para usuarios logueados
- Mensaje de bienvenida personalizado
- Muestra datos del usuario

### 5. **Dashboard de Administrador** (`/admin`)
- Listado de todos los usuarios en tabla
- Información: Nombre, Email, Teléfono, Fecha de Registro
- Solo accesible para usuarios con rol **admin**

### 6. **Acceso Denegado** (`/403`)
- Se muestra cuando intentas acceder a ruta protegida sin permisos

### 7. **No Encontrada** (`/404`)
- Se muestra para rutas inexistentes

## 🔐 Campos del Usuario

```javascript
{
  name: String,
  lastName: String (required),
  email: String (required, unique),
  password: String (required, min 8 chars, 1 uppercase, 1 digit, 1 special),
  phoneNumber: String (required),
  birthdate: Date (required), // age se calcula automáticamente
  url_profile: String,
  adress: String,
  roles: Array<Role>,
  createdAt: Date,
  updatedAt: Date
}
```

### Validación de Contraseña

La contraseña debe cumplir con:
- Mínimo **8 caracteres**
- Al menos **1 mayúscula** (A-Z)
- Al menos **1 dígito** (0-9)
- Al menos **1 carácter especial** (#, $, %, &, *, @)

**Ejemplo válido**: `Admin#123`

## 👤 Usuario Admin por Defecto

Al iniciar el servidor se crea automáticamente un usuario admin:

```
Email: admin@example.com
Password: Admin#123
Rol: admin, user
```

Puedes cambiar estos valores con las variables de entorno:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

## 🔑 Flujo de Autenticación

1. Usuario se registra en `/signUp` → POST `/api/auth/signUp`
2. Usuario inicia sesión en `/signIn` → POST `/api/auth/signIn`
3. Backend devuelve JWT token
4. Cliente guarda token en `sessionStorage`
5. Todas las peticiones incluyen token: `Authorization: Bearer <token>`
6. Middleware `authenticate` valida el token
7. Middleware `authorize` verifica roles si es necesario

## 🛡️ Protección de Rutas

- **Sin token válido** → Redirigir a `/signIn`
- **Token expirado** → Servidor devuelve 401 → Redirigir a `/signIn`
- **Sin rol suficiente** → Redirigir a `/403`

## 📁 Estructura de Archivos

```
src/
├── controllers/      # Lógica de rutas
├── middlewares/      # Autenticación y autorización
├── models/           # Esquemas de MongoDB
├── public/           # Archivos estáticos
│   ├── css/
│   └── js/
├── repositories/     # Acceso a datos
├── routes/           # Definición de rutas (API y web)
├── services/         # Lógica de negocio
├── utils/            # Funciones auxiliares y seeds
├── views/            # Plantillas EJS
│   └── partials/     # Componentes reutilizables
└── server.js         # Entrada de la aplicación
```

## 🧪 Pruebas Manuales

### 1. Registrar nuevo usuario

```bash
curl -X POST http://localhost:3000/api/auth/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "Pass#1234",
    "phoneNumber": "555-1234",
    "birthdate": "1995-06-15"
  }'
```

### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/auth/signIn \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin#123"
  }'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Obtener datos del usuario

```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Listar todos los usuarios (solo admin)

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'ejs'"
```bash
npm install ejs
```

### Error: "MongoNetworkError: connect ECONNREFUSED"
Asegúrate de que MongoDB está corriendo:
```bash
# Windows
mongod

# macOS con Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Token inválido o expirado
El token expira según `JWT_EXPIRES_IN` en .env (default 1h).
Simplemente inicia sesión de nuevo.

### Error de contraseña débil
Verifica que cumpla:
- 8+ caracteres
- 1 mayúscula
- 1 número
- 1 especial (#$%&*@)

Ejemplo: `Admin#123`

## 📚 Dependencias

- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **jsonwebtoken** - JWT para autenticación
- **bcryptjs** - Hashing de contraseñas
- **ejs** - Motor de plantillas
- **cors** - CORS middleware
- **dotenv** - Variables de entorno

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado como ejercicio de autenticación con Express.js y MongoDB

---

**¿Preguntas?** Revisa los archivos fuente o ajusta las variables de entorno según tu caso.
