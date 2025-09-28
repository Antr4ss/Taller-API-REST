# 🎵 API de Música - Taller API REST

API REST para gestión de autores y canciones con autenticación JWT, documentación Swagger y persistencia en MongoDB Atlas.

## 🚀 Características

- ✅ **Autenticación JWT** - Seguridad completa con tokens
- ✅ **API RESTful** - Endpoints completos para CRUD
- ✅ **Documentación Swagger** - Documentación interactiva
- ✅ **MongoDB Atlas** - Persistencia en la nube
- ✅ **Validaciones** - Validación de datos robusta
- ✅ **Paginación** - Consultas paginadas
- ✅ **Búsqueda** - Filtros y búsqueda avanzada
- ✅ **Soft Delete** - Eliminación lógica
- ✅ **Relaciones** - Asociación uno a muchos (Autor ↔ Canciones)

## 📋 Requisitos

- Node.js 18+
- MongoDB Atlas (o MongoDB local)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd parcial-ejs
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env
cp .env.example .env
```

4. **Configurar .env**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
DB_NAME=uptc
JWT_SECRET=tu-jwt-secret-super-seguro
```

5. **Ejecutar la aplicación**
```bash
npm start
```

## 📚 Documentación API

Una vez ejecutada la aplicación, la documentación Swagger estará disponible en:
- **Desarrollo**: http://localhost:3000/api-docs
- **Producción**: https://tu-dominio.com/api-docs

## 🔐 Autenticación

### Registro de Usuario
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

### Usar Token
```bash
Authorization: Bearer <tu-jwt-token>
```

## 🎯 Endpoints Principales

### Autores
- `GET /autor` - Listar autores (con paginación y búsqueda)
- `GET /autor/:id` - Obtener autor por ID
- `POST /autor` - Crear autor
- `PUT /autor/:id` - Actualizar autor
- `DELETE /autor/:id` - Eliminar autor (soft delete)

### Canciones
- `GET /canciones` - Listar canciones (con filtros)
- `GET /canciones/:id` - Obtener canción por ID
- `GET /canciones/autor/:autorId` - Canciones por autor
- `POST /canciones` - Crear canción
- `PUT /canciones/:id` - Actualizar canción
- `DELETE /canciones/:id` - Eliminar canción (soft delete)

## 📊 Ejemplos de Uso

### Crear Autor
```bash
POST /autor
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1,
  "name": "Bad Bunny",
  "apodo": "El Conejo Malo",
  "biografia": "Cantante y compositor puertorriqueño",
  "nacionalidad": "Puertorriqueño",
  "fechaNacimiento": "1994-03-10"
}
```

### Crear Canción
```bash
POST /canciones
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tití Me Preguntó",
  "album": "Un Verano Sin Ti",
  "duracion": 240,
  "genero": "Reggaetón",
  "año": 2022,
  "autor": "673a1b2c3d4e5f6789012345"
}
```

## 🚀 Despliegue

### Opción 1: Render

1. **Conectar repositorio a Render**
2. **Configurar variables de entorno**:
   - `MONGODB_URI`: Tu string de conexión de Atlas
   - `JWT_SECRET`: Un secreto seguro para JWT
   - `NODE_ENV`: production
3. **Desplegar**

### Opción 2: Railway

1. **Conectar repositorio a Railway**
2. **Configurar variables de entorno**:
   - `MONGODB_URI`: Tu string de conexión de Atlas
   - `JWT_SECRET`: Un secreto seguro para JWT
3. **Desplegar**

### Opción 3: Heroku

1. **Instalar Heroku CLI**
2. **Login y crear app**:
```bash
heroku login
heroku create tu-app-musica
```

3. **Configurar variables**:
```bash
heroku config:set MONGODB_URI="tu-string-atlas"
heroku config:set JWT_SECRET="tu-secreto-jwt"
heroku config:set NODE_ENV="production"
```

4. **Desplegar**:
```bash
git push heroku main
```

## 🔧 Configuración de MongoDB Atlas

1. **Crear cluster en MongoDB Atlas**
2. **Configurar acceso de red** (0.0.0.0/0 para desarrollo)
3. **Crear usuario de base de datos**
4. **Obtener string de conexión**
5. **Configurar en variables de entorno**

## 📈 Características Avanzadas

- **Paginación**: `?page=1&limit=10`
- **Búsqueda**: `?search=bad bunny`
- **Filtros**: `?genero=reggaeton&autor=673a1b2c3d4e5f6789012345`
- **Soft Delete**: Los registros se marcan como inactivos
- **Validaciones**: Validación robusta de datos
- **Índices**: Optimización de consultas
- **Relaciones**: Populate automático de relaciones

## 🛡️ Seguridad

- **JWT Tokens** con expiración de 24h
- **Validación de entrada** en todos los endpoints
- **Sanitización** de datos
- **Rate limiting** (configurable)
- **CORS** configurado
- **Headers de seguridad**

## 📝 Estructura del Proyecto

```
parcial-ejs/
├── config/
│   └── swagger.mjs          # Configuración Swagger
├── controllers/
│   ├── controll-auth.mjs    # Controlador autenticación
│   ├── controll-autor.mjs   # Controlador autores
│   └── controll-canciones.mjs # Controlador canciones
├── drivers/
│   └── connect-db.mjs       # Conexión MongoDB
├── middlewares/
│   └── auth.mjs             # Middleware JWT
├── models/
│   ├── Autor.mjs            # Modelo Autor
│   ├── Canciones.mjs        # Modelo Canciones
│   └── Usuario.mjs          # Modelo Usuario
├── routes/
│   ├── rutaAuth.mjs         # Rutas autenticación
│   ├── rutaAutor.mjs        # Rutas autores
│   └── rutaCanciones.mjs    # Rutas canciones
├── index.js                 # Servidor principal
├── package.json
├── Procfile                 # Para Heroku
├── railway.json             # Para Railway
├── render.yaml              # Para Render
└── README.md
```

## 🐛 Solución de Problemas

### Error de Conexión a MongoDB
- Verificar string de conexión
- Verificar IP whitelist en Atlas
- Verificar credenciales

### Error de JWT
- Verificar JWT_SECRET
- Verificar formato del token
- Verificar expiración

### Error de Validación
- Verificar formato de datos
- Verificar campos requeridos
- Verificar tipos de datos

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email**: harold.guerrero02@uptc.edu.co
- **GitHub**: [Tu repositorio]

## 📄 Licencia

ISC License

---

**Desarrollado por Harold Guerrero** 🚀
