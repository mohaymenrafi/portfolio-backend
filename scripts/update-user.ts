import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '../src/lib/auth';

const [, , email, field, value] = process.argv;

if (!email || !field || !value) {
  console.error('Usage: npx tsx scripts/update-user.ts <email> <field> <value>');
  console.error('Fields: name | email | password');
  process.exit(1);
}

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('✗ No user found with email:', email);
    process.exit(1);
  }

  if (field === 'password') {
    const ctx = await auth.$context;
    const hashed = await ctx.password.hash(value);
    await prisma.account.updateMany({
      where: { userId: user.id, providerId: 'credential' },
      data: { password: hashed },
    });
    console.log('✓ Password updated for:', email);
  } else if (field === 'name' || field === 'email') {
    await prisma.user.update({ where: { id: user.id }, data: { [field]: value } });
    console.log(`✓ ${field} updated for:`, email, '→', value);
  } else {
    console.error('✗ Unknown field. Use: name | email | password');
    process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('✗', err.message ?? err);
  process.exit(1);
});
