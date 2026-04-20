# Portfolio v2 — Full Stack Blog Feature Plan

## Project Structure
```
portfolio/
├── backend/          ← NestJS API (current working dir)
├── frontend/         ← Next.js app (to be added)
├── docker-compose.yml
└── features.md
```

---

## Phase 1 — Infrastructure & Dev Environment
- [x] Scaffold NestJS backend
- [x] Install dependencies (Prisma, JWT, Swagger, bcrypt, class-validator)
- [x] Add `docker-compose.yml` for local PostgreSQL (port 5433)
- [x] Create `.env` and `.env.example` with all required variables
- [x] Update `prisma/schema.prisma` with full data models (User, Post, Tag)
- [x] Update `prisma.config.ts` to load env vars via dotenv
- [x] Run `prisma migrate dev` to apply schema
- [x] Generate Prisma client (`prisma generate`)
- [ ] Seed script — create admin user with hashed password

---

## Phase 2 — Backend Core Modules

### Prisma Module
- [ ] `src/prisma/prisma.service.ts` — extend PrismaClient, connect on init
- [ ] `src/prisma/prisma.module.ts` — global module

### Auth Module
- [ ] `src/auth/dto/login.dto.ts` — email + password with class-validator decorators
- [ ] `src/auth/strategies/jwt.strategy.ts` — PassportStrategy(Strategy)
- [ ] `src/auth/guards/jwt-auth.guard.ts` — AuthGuard('jwt')
- [ ] `src/auth/auth.service.ts` — validateUser(), login() returning JWT
- [ ] `src/auth/auth.controller.ts` — POST /auth/login
- [ ] `src/auth/auth.module.ts` — wire JwtModule, PassportModule

### Posts Module
- [ ] `src/posts/dto/create-post.dto.ts` — title, slug, content, excerpt, coverImage, published, tags[]
- [ ] `src/posts/dto/update-post.dto.ts` — PartialType of CreatePostDto
- [ ] `src/posts/posts.service.ts` — findAll (paginated, published only), findBySlug, create, update, remove
- [ ] `src/posts/posts.controller.ts` — GET /posts, GET /posts/:slug (public); POST/PATCH/DELETE (JWT guard)
- [ ] `src/posts/posts.module.ts`

### Tags Module
- [ ] `src/tags/tags.service.ts` — findAll
- [ ] `src/tags/tags.controller.ts` — GET /tags
- [ ] `src/tags/tags.module.ts`

### App Module
- [ ] Update `src/app.module.ts` — import ConfigModule (global), PrismaModule, AuthModule, PostsModule, TagsModule
- [ ] Update `src/main.ts` — global ValidationPipe, Swagger setup (title/desc/version/bearer auth), CORS for frontend, /api prefix

---

## Phase 3 — API Polish & Docs
- [ ] Add `@ApiTags`, `@ApiOperation`, `@ApiBearerAuth` decorators to all controllers
- [ ] Add `@ApiResponse` decorators for success and error responses
- [ ] Pagination — `?page=1&limit=10` query params on GET /posts
- [ ] Slug auto-generation from title if slug not provided
- [ ] Swagger UI accessible at `/api`

---

## Phase 4 — Frontend Integration (Next.js)
- [ ] Add `frontend/` directory (Next.js App Router)
- [ ] Blog list page — `app/blog/page.tsx` — fetch from backend GET /posts
- [ ] Blog detail page — `app/blog/[slug]/page.tsx` — fetch from backend GET /posts/:slug
- [ ] Render markdown content (use `react-markdown` or `@tailwindcss/typography`)
- [ ] Tag filter on blog list page
- [ ] Loading/skeleton states

---

## Phase 5 — Admin Panel (Protected)
- [ ] Admin login page — `app/admin/login/page.tsx` — calls POST /auth/login, stores JWT
- [ ] Post list page — `app/admin/posts/page.tsx` — list all (including unpublished)
- [ ] Create post page — `app/admin/posts/new/page.tsx` — form with markdown editor
- [ ] Edit post page — `app/admin/posts/[slug]/edit/page.tsx`
- [ ] Delete post — with confirmation dialog
- [ ] Route guard — redirect to /admin/login if no JWT token

---

## Phase 6 — Deployment
- [ ] Backend: deploy to Railway (PostgreSQL + NestJS service)
- [ ] Frontend: deploy to Vercel
- [ ] Set `NEXT_PUBLIC_API_URL` to Railway backend URL in Vercel env vars
- [ ] Set `CORS_ORIGIN` to Vercel frontend URL in Railway env vars
- [ ] Smoke test all API endpoints in production

---

## Environment Variables

### Backend `.env`
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## API Reference

| Method | Endpoint        | Auth     | Description              |
|--------|----------------|----------|--------------------------|
| POST   | /auth/login    | None     | Returns JWT token        |
| GET    | /posts         | None     | Paginated published posts|
| GET    | /posts/:slug   | None     | Single post by slug      |
| POST   | /posts         | JWT      | Create new post          |
| PATCH  | /posts/:slug   | JWT      | Update post              |
| DELETE | /posts/:slug   | JWT      | Delete post              |
| GET    | /tags          | None     | All tags                 |
| GET    | /api           | None     | Swagger UI docs          |
