# BookShop – Backend Avanzado

API REST para una plataforma de compra y venta de libros desarrollada con Node.js, Express y MongoDB.

La aplicación permite a los usuarios registrarse, publicar libros, comprarlos y recibir notificaciones automáticas mediante procesos programados.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- JWT (JSON Web Token)
- bcrypt
- Jest + Supertest
- node-cron

---

## Instalación

1. Clonar el repositorio:

```bash
git clone <repo-url>
cd bookshop-backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/bookshop
JWT_SECRET=supersecret
```

4. Ejecutar el servidor:
```bash
npm run dev
``` 
---

## Autenticación

La autenticación se realiza mediante JWT.

POST /authentication/signup

Crea un nuevo usuario.

Body:
```json
{
  "email": "user@email.com",
  "password": "123456"
}
```
POST /authentication/signin

Inicia sesión y devuelve un token JWT.

Body:
```json
{
  "email": "user@email.com",
  "password": "123456"
}
```

Endpoints de Libros
Endpoints privados (requieren JWT)

Se debe enviar el header:

Authorization: Bearer <token>

POST /books

Crear un libro.

Body:
```json
{
  "title": "Clean Code",
  "description": "A book about software craftsmanship",
  "price": 25,
  "author": "Robert C. Martin"
}
```

Reglas:

El libro se crea con estado PUBLISHED

soldAt es null

Pertenece al usuario autenticado

PUT /books/:id

Editar libro (solo el dueño).

Campos editables:

title

description

price

author

POST /books/:id/buy

Comprar libro.

Reglas:

El libro pasa a estado SOLD

Se asigna soldAt

El vendedor recibe un email

Un usuario no puede comprar su propio libro

GET /me/books

Devuelve los libros del usuario autenticado.

---

## Endpoint público

GET /books

Devuelve libros con estado PUBLISHED.

Soporta:

Búsqueda por título

Búsqueda por autor

Paginación

Ejemplo:

GET /books?title=clean&author=martin&page=1&limit=10

---

## Tareas programadas (Cron Job)
Sugerencia de bajada de precio

Una vez por semana:

Se revisan libros publicados hace más de 7 días

Se envía email al vendedor sugiriendo bajar el precio

---

## Testing

Tests implementados con Jest y Supertest.

Endpoints testeados:

POST /books

POST /books/:id/buy

GET /books

Ejecutar tests:

```bash
npm test
```