# Portfolio Blog — Backend

REST API for Abdullah Al Mohaymen Rafi's portfolio blog. Built with NestJS, Prisma, PostgreSQL, and better-auth.

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL (Neon in production)
- **ORM:** Prisma
- **Auth:** better-auth (email/password, session-based)
- **Docs:** Swagger UI at `/docs`

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker (for local PostgreSQL)

### Setup

```bash
pnpm install
```

Start the local database:

```bash
docker-compose up -d
```

Run database migrations:

```bash
npx prisma migrate deploy
```

Start the dev server:

```bash
pnpm start:dev
```

API available at `http://localhost:4000`
Swagger docs at `http://localhost:4000/docs`

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for session signing |
| `BETTER_AUTH_URL` | Public URL of this backend |
| `CORS_ORIGIN` | Frontend URL allowed by CORS |
| `PORT` | Server port (default: 4000) |

## API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/sign-up/email` | Register a new user |
| POST | `/api/auth/sign-in/email` | Sign in |
| POST | `/api/auth/sign-out` | Sign out |
| GET | `/api/auth/get-session` | Get current session |

### Posts
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/posts` | — | List published posts (paginated + searchable) |
| GET | `/api/posts/:slug` | — | Get single post by slug |
| GET | `/api/posts/:slug/adjacent` | — | Get prev/next posts |
| GET | `/api/posts/admin/all` | ✓ | List all posts including drafts |
| POST | `/api/posts` | ✓ | Create post |
| PATCH | `/api/posts/:id` | ✓ | Update post |
| DELETE | `/api/posts/:id` | ✓ | Delete post |

### Tags
| Method | Path | Description |
|---|---|---|
| GET | `/api/tags` | List all tags |

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check (used for server wake detection) |

## User Management

Users are managed via CLI scripts — no admin UI is exposed:

```bash
# Create a user
pnpm user:create "Name" "email@example.com" "password"

# Update name, email, or password
pnpm user:update "email@example.com" name "New Name"
pnpm user:update "email@example.com" email "new@example.com"
pnpm user:update "email@example.com" password "newpassword"
```

## Deployment

Deployed on [Render](https://render.com) with database on [Neon](https://neon.tech).

**Build command:** `prisma generate && nest build`
**Start command:** `node dist/main`
