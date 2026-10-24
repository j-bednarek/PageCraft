# PageCraft

Aplikacja SaaS do tworzenia jednostronicowych stron internetowych z gotowych szablonów. Projekt realizowany w ramach pracy inżynierskiej na Politechnice Łódzkiej.

## Technologie

- Frontend: React 19, Vite, React Router, Axios
- Backend: Node.js, Express 5, express-session
- Baza danych: PostgreSQL, Prisma ORM

## Wymagania

- Node.js 22 lub nowszy
- PostgreSQL

## Uruchomienie

### Baza danych

Utwórz pustą bazę danych, np. `pagecraft`.

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

W pliku `.env` ustaw `DATABASE_URL` (adres bazy) i `SESSION_SECRET` (losowy ciąg znaków), a następnie:

```bash
npm run db:push
npm run db:generate
psql -U postgres -d pagecraft -f prisma/seed.sql
npm run dev
```

Serwer API działa pod adresem http://localhost:3000.

### Frontend

```bash
cd frontend/frontend
npm install
npm run dev
```

Aplikacja działa pod adresem http://localhost:5173. Zapytania do `/api` są przekazywane do backendu przez proxy Vite, więc oba serwery muszą być uruchomione jednocześnie.

## Struktura

- `backend/` - API w Express, schemat bazy w `prisma/schema.prisma`
- `frontend/frontend/` - aplikacja React
