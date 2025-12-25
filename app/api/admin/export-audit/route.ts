import { auth } from '@/auth';
import sql from '@/app/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();

        // 1. Admin Verification
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminCheck = await sql`
            SELECT role FROM users WHERE email = ${session.user.email}
        `;

        if (!adminCheck[0] || adminCheck[0].role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Fetch Transactions (All/Limit 1000)
        const transactions = await sql`
            SELECT c.id, c.amount, c.date, u.name as user_name, u.email as user_email, g.name as group_name
            FROM contributions c
            JOIN users u ON c.user_id = u.id
            JOIN groups g ON c.group_id = g.id
            ORDER BY c.date DESC
            LIMIT 1000
        `;

        // 3. Convert to CSV
        const csvHeader = 'Date,Transaction ID,User Name,User Email,Group Name,Amount (NGN)\n';
        const csvRows = transactions.map((t: any) => {
            const date = new Date(t.date).toISOString().split('T')[0]; // YYYY-MM-DD
            const amount = Number(t.amount).toFixed(2);
            // Escape commas in names if necessary
            const safeUserName = `"${t.user_name.replace(/"/g, '""')}"`;
            const safeGroupName = `"${t.group_name.replace(/"/g, '""')}"`;

            return `${date},${t.id},${safeUserName},${t.user_email},${safeGroupName},${amount}`;
        }).join('\n');

        const csvContent = csvHeader + csvRows;

        // 4. Return Response
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="moniepool_audit_log_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        console.error('Export Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
