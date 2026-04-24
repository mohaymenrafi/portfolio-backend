import 'dotenv/config';
import { auth } from '../src/lib/auth';

const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error('Usage: npx tsx scripts/create-user.ts <name> <email> <password>');
  process.exit(1);
}

async function main() {
  const result = await auth.api.signUpEmail({ body: { name, email, password } });
  console.log('✓ User created:', result.user.email, '(id:', result.user.id + ')');
}

main().catch((err) => {
  console.error('✗', err.message ?? err);
  process.exit(1);
});
