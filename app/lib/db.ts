import postgres from 'postgres';

const sql = (global as any).sql || postgres(process.env.POSTGRES_URL!, {
    ssl: { rejectUnauthorized: false },
    max: 10, // Limit connection pool
    idle_timeout: 20, // Close idle connections faster
    connect_timeout: 60 // Wait longer for cold starts
});

if (process.env.NODE_ENV !== 'production') {
    (global as any).sql = sql;
}

export default sql;
