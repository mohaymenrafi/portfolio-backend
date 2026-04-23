import type { Auth } from '../lib/auth';

type Session = Awaited<ReturnType<Auth['api']['getSession']>>;

declare global {
  namespace Express {
    interface Request {
      user?: Session['user'];
      session?: Session['session'];
    }
  }
}
