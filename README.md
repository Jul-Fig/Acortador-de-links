# 🔗 Acortador de URLs

Servicio de acortamiento de URLs full-stack construido con Node.js, Express, MongoDB y Angular 21.

![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248?style=flat&logo=mongodb&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat&logo=angular&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-listo-2496ED?style=flat&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-cobertura%2080%25+-C21325?style=flat&logo=jest&logoColor=white)

---

## ✨ Funcionalidades

- Acorta cualquier URL válida y obtén un código único de 6 caracteres
- Redirige a la URL original mediante un redirect permanente `301`
- Registra el contador de accesos por cada URL acortada
- Consulta estadísticas sin incrementar el contador
- CRUD completo: crear, leer, actualizar y eliminar URLs acortadas
- Validación de entradas, rate limiting y cabeceras de seguridad incluidas

---

## 🗂️ Estructura del Proyecto

```
/
├── backend/
│   ├── controllers/       # Lógica de los endpoints
│   ├── middleware/        # Validación y manejo de errores
│   ├── models/            # Esquemas de Mongoose
│   ├── routes/            # Rutas de Express
│   ├── utils/             # Generador de códigos cortos
│   ├── tests/             # Tests de integración con Jest + Supertest
│   ├── server.js
│   └── Dockerfile
└── frontend/
    └── src/
        ├── app/
        │   ├── components/    # url-form, url-list, url-item
        │   ├── services/      # UrlService (HttpClient)
        │   ├── models/        # Interfaces de TypeScript
        │   └── environments/  # URLs de API dev / prod
        └── styles.css
```

---

## 🚀 Instalación y Uso

### Requisitos

- Node.js 18+
- MongoDB (local o connection string de Atlas)
- Angular CLI (`npm install -g @angular/cli`)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # completar con tu MONGODB_URL
npm run dev            # inicia en http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm start              # inicia en http://localhost:4200
```

### Con Docker

```bash
cd backend
docker build -t acortador-api .
docker run -p 3000:3000 --env-file .env acortador-api
```

---

## 🔌 Referencia de la API

URL base: `/api`

| Método   | Endpoint                     | Estado | Descripción                                    |
|----------|------------------------------|--------|------------------------------------------------|
| `POST`   | `/shorten`                   | 201    | Crea una URL acortada                          |
| `GET`    | `/shorten/:code`             | 200    | Obtiene la URL original e incrementa contador  |
| `GET`    | `/shorten/:code/redirect`    | 301    | Redirige a la URL original                     |
| `PUT`    | `/shorten/:code`             | 200    | Actualiza la URL original                      |
| `DELETE` | `/shorten/:code`             | 204    | Elimina una URL acortada                       |
| `GET`    | `/shorten/:code/stats`       | 200    | Consulta estadísticas sin incrementar contador |
| `GET`    | `/health`                    | 200    | Estado del servidor                            |

### Ejemplo de Request / Response

**POST** `/api/shorten`
```json
// Request
{ "url": "https://www.ejemplo.com/url/muy/larga" }

// Response 201
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "url": "https://www.ejemplo.com/url/muy/larga",
  "shortCode": "aB3xYz",
  "accessCount": 0,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### Reglas de Validación

- `url` es requerida, debe ser string, debe cumplir el formato `https?://...`, máximo 2048 caracteres
- `shortCode` debe ser alfanumérico (`[a-zA-Z0-9]+`)

---

## 🧪 Tests

Los tests se ejecutan contra una instancia real de MongoDB Atlas, no con mocks en memoria.

```bash
cd backend

# Agregar la connection string de la BD de pruebas
echo "MONGODB_TEST_URL=mongodb+srv://..." >> .env.test

npm test                # ejecuta todos los tests con cobertura
npm run test:watch      # modo watch
npm run test:verbose    # salida detallada
```

### Resumen de Cobertura

| Módulo                | Sentencias | Funciones | Ramas  |
|-----------------------|------------|-----------|--------|
| controllers/url       | 81.6%      | 100%      | 75%    |
| middleware/validation | 95%        | 100%      | 92.8%  |
| utils/shortcode       | 100%       | 100%      | 100%   |
| routes/url            | 100%       | 100%      | 100%   |
| models/Url            | 90.9%      | 66.6%     | 100%   |
| **Total**             | **80.1%**  | **55.5%** | **60%**|

---

## ⚙️ Variables de Entorno

### Backend (`.env`)

```env
PORT=3000
MONGODB_URL=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/url-shortener
FRONTEND_URL=http://localhost:4200
NODE_ENV=development
```

### Frontend (`src/environments/`)

```typescript
// environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/shorten'
}

// environment.prod.ts (producción)
export const environment = {
  production: true,
  apiUrl: 'https://tu-api.onrender.com/api/shorten'
}
```

---

## 🔒 Seguridad

- **Helmet** — configura cabeceras HTTP seguras automáticamente
- **CORS** — restringe las peticiones al `FRONTEND_URL` configurado
- **Rate limiting** — máximo 100 peticiones por IP cada 15 minutos
- **Validación de entradas** — todos los datos se validan antes de llegar a la base de datos
- **Usuario no root en Docker** — el contenedor corre como `nodejs` (UID 1001)

---

## 🛠️ Stack Tecnológico

| Capa          | Tecnología                   |
|---------------|------------------------------|
| Runtime       | Node.js 24                   |
| Framework     | Express 5                    |
| Base de datos | MongoDB 9 + Mongoose         |
| Frontend      | Angular 21 (Signals API)     |
| Estilos       | Tailwind CSS 4 + CSS tokens  |
| Tests         | Jest + Supertest             |
| Contenedor    | Docker (Alpine)              |
| Despliegue    | Render (API) · Netlify (SPA) |

---

## 📄 Licencia

MIT
