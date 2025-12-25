const postgres = require('postgres');

async function testUpdate() {
    console.log('Testing DB Update...');

    // User ID from previous logs
    const userId = '6b2b0a6f-1579-47cc-a6a8-33f1af8c8493';

    try {
        const sql = postgres(process.env.POSTGRES_URL, {
            ssl: { rejectUnauthorized: false },
            max: 1
        });

        // 1. Read before
        console.log('Reading user...');
        const [userBefore] = await sql`SELECT id, email, status, wallet_balance FROM users WHERE id = ${userId}`;
        console.log('Before:', userBefore);

        if (!userBefore) {
            console.error('User not found!');
            process.exit(1);
        }

        // 2. Update
        const newBalance = (userBefore.wallet_balance || 0) + 100;
        const newStatus = userBefore.status === 'active' ? 'suspended' : 'active';

        console.log(`Updating to: Status=${newStatus}, Balance=${newBalance}`);

        const result = await sql`
            UPDATE users 
            SET status = ${newStatus}, wallet_balance = ${newBalance}
            WHERE id = ${userId}
            RETURNING id, status, wallet_balance
        `;

        console.log('Update Result:', result);

        // 3. Read after
        const [userAfter] = await sql`SELECT id, email, status, wallet_balance FROM users WHERE id = ${userId}`;
        console.log('After: ', userAfter);

        if (userAfter.status === newStatus && userAfter.wallet_balance === newBalance) {
            console.log('SUCCESS: DB Update persisted.');
        } else {
            console.error('FAILURE: DB Update did not persist.');
        }

        await sql.end();
    } catch (error) {
        console.error('Update failed:', error);
    }
}

testUpdate();
