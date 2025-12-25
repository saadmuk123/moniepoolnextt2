'use server';

import { auth } from '@/auth';
import sql from './db';
import { redirect } from 'next/navigation';

// Check if current user is admin
export async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/login');
    }

    const result = await sql`SELECT role FROM users WHERE email = ${session.user.email}`;
    const user = result[0];

    if (!user || user.role !== 'admin') {
        redirect('/dashboard'); // Kick non-admins back to dashboard
    }
}

export async function fetchAdminStats() {
    await requireAdmin(); // Enforce security

    try {
        const [totalUsersRes, totalGroupsRes, totalContributionsRes, allUsers] = await Promise.all([
            sql`SELECT COUNT(*) as count FROM users`,
            sql`SELECT COUNT(*) as count FROM groups`,
            sql`SELECT SUM(amount) as total FROM contributions`,
            sql`
                SELECT id, name, email, role, wallet_balance, 
                (SELECT COUNT(*) FROM group_members WHERE user_id = users.id) as group_count
                FROM users
                ORDER BY name ASC
            `
        ]);

        return {
            totalUsers: Number(totalUsersRes[0].count),
            totalGroups: Number(totalGroupsRes[0].count),
            totalVolume: Number(totalContributionsRes[0].total || 0),
            users: allUsers.map(u => ({
                ...u,
                wallet_balance: Number(u.wallet_balance),
                group_count: Number(u.group_count)
            }))
        };
    } catch (error) {
        console.error('Admin Stats Error:', error);
        throw new Error('Failed to fetch admin stats');
    }
}
