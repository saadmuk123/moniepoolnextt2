'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });

const CreateGroupSchema = z.object({
    name: z.string().min(3),
    amount: z.coerce.number().gt(0),
    interval: z.enum(['weekly', 'monthly']),
    description: z.string().optional(),
    max_members: z.coerce.number().gt(0),
    start_date: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', { message: 'Valid date required' }),
});

export async function createGroup(prevState: any, formData: FormData) {
    const validatedFields = CreateGroupSchema.safeParse({
        name: formData.get('name'),
        amount: formData.get('amount'),
        interval: formData.get('interval'),
        description: formData.get('description'),
        max_members: formData.get('max_members'),
        start_date: formData.get('start_date'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Missing or invalid fields.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, amount, interval, description, max_members, start_date } = validatedFields.data;

    // Calculate End Date
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(startDateObj);
    if (interval === 'weekly') {
        endDateObj.setDate(startDateObj.getDate() + (max_members * 7));
    } else {
        endDateObj.setMonth(startDateObj.getMonth() + max_members);
    }
    const end_date = endDateObj.toISOString().split('T')[0];

    try {
        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');

        // Get user ID
        const user = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
        const userId = user[0].id;

        // Create Group
        const group = await sql`
      INSERT INTO groups (name, amount, interval, start_date, description, max_members, end_date)
      VALUES (${name}, ${amount * 100}, ${interval}, ${start_date}, ${description || null}, ${max_members}, ${end_date})
      RETURNING id
    `;
        const groupId = group[0].id;

        // Add Creator as first member (Position 1)
        await sql`
      INSERT INTO group_members (group_id, user_id, position, status)
      VALUES (${groupId}, ${userId}, 1, 'active')
    `;

    } catch (error) {
        console.error('Failed to create group:', error);
        return { message: 'Database Error: Failed to create group.' };
    }

    revalidatePath('/dashboard/groups');
    redirect('/dashboard/groups');
}

export async function joinGroup(groupId: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');

        const user = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
        const userId = user[0].id;

        // Check Group Limits
        const groupResult = await sql`SELECT max_members FROM groups WHERE id = ${groupId}`;
        const group = groupResult[0];

        const memberCountResult = await sql`SELECT COUNT(*) FROM group_members WHERE group_id = ${groupId}`;
        const currentCount = Number(memberCountResult[0].count);

        if (groupResult.length > 0 && group.max_members && currentCount >= group.max_members) {
            return { message: 'Group is full' };
        }

        // Get current max position
        const maxPos = await sql`
      SELECT MAX(position) as max_pos FROM group_members WHERE group_id = ${groupId}
    `;
        const newPosition = (maxPos[0].max_pos || 0) + 1;

        await sql`
      INSERT INTO group_members (group_id, user_id, position, status)
      VALUES (${groupId}, ${userId}, ${newPosition}, 'active')
      ON CONFLICT DO NOTHING
    `;

        revalidatePath(`/dashboard/groups/${groupId}`);
        return { message: 'Joined successfully' };
    } catch (error) {
        console.error('Failed to join group:', error);
        return { message: 'Failed to join group' };
    }
}

export async function fetchGroups(query: string = '') {
    try {
        const groups = await sql`
      SELECT 
        g.id, 
        g.name, 
        g.amount, 
        g.interval, 
        g.start_date, 
        g.max_members,
        COUNT(gm.user_id) as member_count
      FROM groups g
      LEFT JOIN group_members gm ON g.id = gm.group_id
      WHERE g.name ILIKE ${`%${query}%`}
      GROUP BY g.id, g.name, g.amount, g.interval, g.start_date, g.max_members
      ORDER BY g.start_date DESC
    `;
        return groups.map(g => ({
            ...g,
            amount: g.amount / 100,
            member_count: Number(g.member_count),
            max_members: g.max_members || 0
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch groups.');
    }
}

export async function fetchGroupDetails(id: string) {
    try {
        const [groupResult, members, contributions] = await Promise.all([
            sql`
                SELECT id, name, amount, interval, start_date, description, max_members, end_date 
                FROM groups 
                WHERE id = ${id}
            `,
            sql`
                SELECT u.id, u.name, gm.position, gm.status
                FROM group_members gm
                JOIN users u ON gm.user_id = u.id
                WHERE gm.group_id = ${id}
                ORDER BY gm.position ASC
            `,
            // Fetch contributions for this group to calculate totals
            sql`
                SELECT user_id, amount 
                FROM contributions 
                WHERE group_id = ${id}
            `
        ]);

        const group = groupResult[0];

        if (!group) return null;

        // Calculate Stats
        let totalCollected = 0;
        contributions.forEach(c => {
            totalCollected += Number(c.amount);
        });

        // Map members to include their contribution status for "current cycle"? 
        // For simple MVP provided, we just checked if they contributed *ever* or total?
        // The previous logic accumulated total per member.

        const memberStats = new Map();
        contributions.forEach(c => {
            const current = memberStats.get(c.user_id) || 0;
            memberStats.set(c.user_id, current + Number(c.amount));
        });

        // Determine logged in user status
        // ... (This requires session, which is separate. The original code fetched session separately or inside component? 
        // The original code passed `id`. The component calls `auth()` separately to check `user.id` against members.

        return {
            ...group,
            amount: group.amount / 100, // Convert cents to dollars for UI
            members: members.map(m => ({
                ...m,
                total_contributed: (memberStats.get(m.id) || 0) / 100
            })),
            stats: {
                totalCollected: totalCollected / 100
            }
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch group details.');
    }
}

export async function payoutToMember(groupId: string, userId: string) {
    try {
        await sql`
      UPDATE group_members
      SET status = 'paid'
      WHERE group_id = ${groupId} AND user_id = ${userId}
    `;
        revalidatePath(`/dashboard/groups/${groupId}`);
        return { message: 'Payout recorded successfully' };
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Failed to record payout' };
    }
}

export async function recordContribution(groupId: string, userId: string, amount: number) {
    try {
        const amountCents = amount * 100;
        const date = new Date().toISOString().split('T')[0];

        // Transaction: Check Balance -> Deduct -> Record
        await sql.begin(async (sql) => {
            // Check Balance
            const user = await sql`SELECT wallet_balance FROM users WHERE id = ${userId}`;
            if (!user || user.length === 0) throw new Error('User not found');

            const currentBalance = user[0].wallet_balance;
            if (currentBalance < amountCents) {
                throw new Error('Insufficient Funds');
            }

            // Deduct from Wallet
            await sql`
                UPDATE users 
                SET wallet_balance = wallet_balance - ${amountCents}
                WHERE id = ${userId}
            `;

            // Record Contribution
            await sql`
                INSERT INTO contributions (group_id, user_id, amount, date)
                VALUES (${groupId}, ${userId}, ${amountCents}, ${date})
            `;
        });

        revalidatePath(`/dashboard/groups/${groupId}`);
        return { message: 'Contribution recorded successfully' };
    } catch (error: any) {
        console.error('Database Error:', error);
        return { message: error.message || 'Failed to record contribution' };
    }
}
