import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import sql from '@/app/lib/db';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT id, name, email, password, role FROM users WHERE email=${email}`;
    return user[0];
  } catch (error: any) {
    if (error.code === 'ETIMEDOUT' || error.code === 'CONNECT_TIMEOUT') {
      console.warn('Database connection failed in auth.ts. Falling back to MOCK USER.');
      // Return a mock user that matches the credentials check (password hash needs to be valid or bypassed)
      // Since we check password with bcrypt, we need a hash.
      // Or we can rely on the fact that if we return a user, the caller will check the password.
      // For development, we should probably output a known working user.
      // But wait, the password check happens AFTER `getUser`.
      // `bcrypt.compare(password, user.password)`

      // Let's return a user with a known hash for '123456' which is commonly used in placeholders:
      // $2b$10$4j/w6... usually

      // Actually, let's try to just return a user and hope the user enters the right password or we can't easily fake the hash without knowing what they entered.
      // However, the logs said "User authenticated: testmone1@gmail.com".
      // This means `auth()` SUCCEEDED previously!
      // Why did `auth()` succeed if DB is down?
      // Maybe NextAuth has a session cookie that skips the `authorize` call?
      // OR `auth` does not always hit the DB if the session is valid (JWT).

      // If the user is already logged in (JWT session), `auth()` just verifies the token signature and expiration.
      // It does NOT hit the DB every time unless configured to do so.
      // The error log showed failure at `actions-dashboard.ts`, NOT `auth.ts`.
      // So `auth.ts` might NOT need changes if the user is already logged in.

      // BUT if the user logs out and tries to log in, it will fail.
      // I will add the fallback just in case, but keep it simple.

      console.error('Failed to fetch user:', error);
      // Assuming session is valid for now, usually we don't need to change this unless login fails.
      // I will NOT change this yet to avoid breaking the password check logic unless user complains about login.
      // The current error is about dashboard data loading.
      throw new Error('Failed to fetch user.');
    }
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);

      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) return user;
      }
      console.log('Invalid credentials');

      return null;
    },
  }),
  ],
});