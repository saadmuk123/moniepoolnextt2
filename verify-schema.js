const postgres = require('postgres');

async function verifySchema() {
    console.log('Verifying DB Schema...');

    if (!process.env.POSTGRES_URL) {
        console.error('Error: POSTGRES_URL is not defined in environment.');
        process.exit(1);
    }

    try {
        const sql = postgres(process.env.POSTGRES_URL, {
            ssl: { rejectUnauthorized: false },
            max: 1
        });

        console.log('Connecting...');
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `;

        console.log('Columns in users table:');
        const hasStatus = columns.some(c => c.column_name === 'status');
        columns.forEach(c => console.log(`- ${c.column_name} (${c.data_type})`));

        if (hasStatus) {
            console.log('\nSUCCESS: "status" column EXISTS.');
        } else {
            console.error('\nFAILURE: "status" column DOES NOT EXIST.');
        }

        await sql.end();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

verifySchema();
