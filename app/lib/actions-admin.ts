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

import { unstable_noStore as noStore } from 'next/cache';

export async function fetchAdminStats() {
    noStore(); // Disable caching for this data fetch
    await requireAdmin(); // Enforce security

    try {
        const [totalUsersRes, totalGroupsRes, totalContributionsRes, analyticsRes, topGroupsRes, userStatusRes, allUsersRes, allGroupsRes] = await Promise.all([
            sql`SELECT COUNT(*) as count FROM users`,
            sql`SELECT COUNT(*) as count FROM groups`,
            sql`SELECT SUM(amount) as total FROM contributions`,
            sql`
                SELECT date, SUM(amount) as total
                FROM contributions
                GROUP BY date
                ORDER BY date DESC
                LIMIT 7
            `,
            sql`
                SELECT name, amount as total 
                FROM groups 
                ORDER BY amount DESC 
                LIMIT 5
            `,
            sql`
                 SELECT 
                    SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
                    SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count,
                    SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_count
                FROM users
            `,
            sql`
                SELECT id, name, email, role, status, wallet_balance, 
                (SELECT COUNT(*) FROM group_members WHERE user_id = users.id) as group_count
                FROM users
                ORDER BY name ASC
            `,
            sql`
                SELECT g.id, g.name, g.amount, g.interval, g.status, g.start_date,
                (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) as member_count
                FROM groups g
                ORDER BY g.start_date DESC
            `
        ]);

        return {
            totalUsers: Number(totalUsersRes[0].count),
            totalGroups: Number(totalGroupsRes[0].count),
            totalVolume: Number(totalContributionsRes[0].total || 0),
            analytics: analyticsRes.reverse().map((row: any) => ({
                date: new Date(row.date).toISOString(),
                total: Number(row.total)
            })),
            topGroups: topGroupsRes.map((g: any) => ({
                name: g.name,
                total: Number(g.total)
            })),
            userDistribution: {
                admins: Number(userStatusRes[0].admin_count),
                users: Number(userStatusRes[0].user_count),
                active: Number(userStatusRes[0].active_count),
                suspended: Number(userStatusRes[0].suspended_count)
            },
            users: allUsersRes.map((u: any) => ({
                ...u,
                wallet_balance: Number(u.wallet_balance),
                group_count: Number(u.group_count)
            })),
            groups: allGroupsRes.map((g: any) => ({
                ...g,
                amount: Number(g.amount),
                member_count: Number(g.member_count),
                start_date: new Date(g.start_date).toLocaleDateString()
            }))
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch admin stats.');
    }
}

export async function disbandGroup(groupId: string) {
    await requireAdmin();

    try {
        await sql`
            UPDATE groups
            SET status = 'disbanded'
            WHERE id = ${groupId}
        `;
        revalidatePath('/dashboard/admin');
        return { message: 'Group disbanded successfully' };
    } catch (error) {
        console.error('Failed to disband group:', error);
        return { message: 'Database Error: Failed to disband group.' };
    }
}

import { revalidatePath } from 'next/cache';

export async function updateUser(userId: string, data: { role: string; status: string; wallet_balance: number }) {
    await requireAdmin();

    console.log('Admin updating user:', userId, data);

    try {
        const result = await sql`
            UPDATE users
            SET role = ${data.role},
                wallet_balance = ${data.wallet_balance},
                status = ${data.status}
            WHERE id = ${userId}
        `;
        console.log('Update Result:', result);
        console.log('Rows affected:', result.count);

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user');
    }
}

// Dispute Resolution: Fetch Group Members
export async function fetchGroupMembersAdmin(groupId: string) {
    await requireAdmin();
    try {
        const members = await sql`
            SELECT gm.user_id, gm.position, gm.status, u.name, u.email
            FROM group_members gm
            JOIN users u ON gm.user_id = u.id
            WHERE gm.group_id = ${groupId}
            ORDER BY gm.position ASC
        `;
        return members.map((m: any) => ({
            userId: m.user_id,
            name: m.name,
            email: m.email,
            position: Number(m.position),
            status: m.status
        }));
    } catch (error) {
        console.error('Failed to fetch group members:', error);
        throw new Error('Failed to fetch group members.');
    }
}

// Dispute Resolution: Mark Member as Paid
export async function markMemberAsPaid(groupId: string, userId: string) {
    await requireAdmin();
    try {
        await sql`
            UPDATE group_members
            SET status = 'paid'
            WHERE group_id = ${groupId} AND user_id = ${userId}
        `;
        revalidatePath(`/dashboard/admin`);
        return { message: 'Member marked as paid successfully' };
    } catch (error) {
        console.error('Failed to mark member as paid:', error);
        return { message: 'Database Error: Failed to update status.' };
    }
}

// Audit Logs: Fetch Global Transactions
export async function fetchGlobalTransactions() {
    await requireAdmin();
    try {
        const transactions = await sql`
            SELECT c.id, c.amount, c.date, u.name as user_name, g.name as group_name
            FROM contributions c
            JOIN users u ON c.user_id = u.id
            JOIN groups g ON c.group_id = g.id
            ORDER BY c.date DESC
            LIMIT 50
        `;
        return transactions.map((t: any) => ({
            id: t.id,
            amount: Number(t.amount),
            date: new Date(t.date).toISOString(),
            userName: t.user_name,
            groupName: t.group_name
        }));
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return [];
    }
}
