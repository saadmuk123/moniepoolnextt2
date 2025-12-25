import bcrypt from 'bcrypt';
import sql from '../lib/db';
import { users, invoices, customers, revenue } from '../lib/placeholder-data';

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      wallet_balance INT DEFAULT 500000
    );
  `;

  // Ensure column exists for existing tables
  await sql`
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='wallet_balance') THEN
            ALTER TABLE users ADD COLUMN wallet_balance INT DEFAULT 500000;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
             ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'customer';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='bank_name') THEN
             ALTER TABLE users ADD COLUMN bank_name VARCHAR(255);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='account_number') THEN
             ALTER TABLE users ADD COLUMN account_number VARCHAR(255);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='notifications_enabled') THEN
             ALTER TABLE users ADD COLUMN notifications_enabled BOOLEAN DEFAULT TRUE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
             ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active';
        END IF;
    END
    $$;
  `;

  // Force Admin for specific user (Safe to run multiple times)
  await sql`UPDATE users SET role = 'admin' WHERE email = 'user@nextmail.com';`;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password, wallet_balance)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, 500000)
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

async function seedGroups() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS groups (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      amount INT NOT NULL,
      interval VARCHAR(50) NOT NULL,
      start_date DATE NOT NULL,
      description TEXT,
      max_members INT,
      end_date DATE
    );
  `;

  // Ensure columns exist for existing tables
  await sql`
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='groups' AND column_name='description') THEN
            ALTER TABLE groups ADD COLUMN description TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='groups' AND column_name='max_members') THEN
            ALTER TABLE groups ADD COLUMN max_members INT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='groups' AND column_name='end_date') THEN
            ALTER TABLE groups ADD COLUMN end_date DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='groups' AND column_name='status') THEN
             ALTER TABLE groups ADD COLUMN status VARCHAR(50) DEFAULT 'active';
        END IF;
    END
    $$;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS group_members (
      group_id UUID NOT NULL,
      user_id UUID NOT NULL,
      position INT NOT NULL,
      status VARCHAR(50) NOT NULL,
      PRIMARY KEY (group_id, user_id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contributions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      group_id UUID NOT NULL,
      user_id UUID NOT NULL,
      amount INT NOT NULL,
      date DATE NOT NULL
    );
  `;
}

export async function GET() {
  try {
    const result = await sql.begin((sql: any) => [
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
      seedGroups(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
