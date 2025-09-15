# Ecommerce - Auth (Passport + JWT)


## Instalación


1. Clonar repo
2. `npm install`
3. Copiar `.env.example` a `.env` y completar variables (MONGO_URI, JWT_SECRET, ...)
4. `npm start` o `npm run dev`


## Endpoints principales


- `POST /api/sessions/register` — Registro. Body: `{ first_name, last_name, email, age?, password }`
- `POST /api/sessions/login` — Login (devuelve token). Body: `{ email, password }`
- `GET /api/sessions/current` — Devuelve datos del usuario autenticado. Header: `Authorization: Bearer <TOKEN>`


## Notas
- La contraseña se guarda con `bcrypt.hashSync`.
- La estrategia `current` valida el JWT y extrae el usuario.