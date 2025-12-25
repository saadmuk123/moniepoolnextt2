'use server';

import { auth } from '@/auth';
import postgres from 'postgres';
import { fetchGroupDetails } from './actions-groups';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });

export async function fetchDashboardData() {
    try {
        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');

        const userResult = await sql`SELECT id, wallet_balance FROM users WHERE email = ${session.user.email}`;
        const user = userResult[0];
        if (!user) throw new Error('User not found');
        const userId = user.id;

        // Parallelize fetching groups and contributions
        const [joinedGroups, contributions] = await Promise.all([
            sql`
                SELECT g.id, g.name, g.amount, g.interval, g.start_date, m.position, m.status, g.max_members,
                (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) as member_count
                FROM groups g
                JOIN group_members m ON g.id = m.group_id
                WHERE m.user_id = ${userId}
                ORDER BY g.start_date DESC
            `,
            sql`
                SELECT amount, date
                FROM contributions
                WHERE user_id = ${userId}
                ORDER BY date ASC
            `
        ]);

        // 3. Calculate Stats & Next Payout
        let totalStatSavings = 0;
        let nextPayoutDate: Date | null = null;
        let nextPayoutAmount = 0;

        // Savings
        contributions.forEach(c => {
            totalStatSavings += Number(c.amount);
        });

        // Next Payout Calculation
        const now = new Date();
        const futurePayouts: { date: Date, amount: number, groupName: string }[] = [];

        joinedGroups.forEach((group: any) => {
            if (group.status === 'active') {
                const startDate = new Date(group.start_date);
                const intervalDays = group.interval === 'weekly' ? 7 : 30; // approx

                // Payout assumes 1 cycle per member position
                // Payout Date = Start Date + (Position - 1) * Interval
                const daysToPayout = (group.position - 1) * intervalDays;
                const payoutDate = new Date(startDate.getTime() + daysToPayout * 24 * 60 * 60 * 1000);

                if (payoutDate >= now) {
                    futurePayouts.push({
                        date: payoutDate,
                        amount: Number(group.amount), // The group amount is the payout (User contributes amount, receives amount * members? 
                        // Usually Adashe: You contribute X, you receive X * Members.
                        // Let's assume Payout = Contribution Amount * Member Count (Total Pool).
                        groupName: group.name
                    });
                }
            }
        });

        // Sort future payouts
        futurePayouts.sort((a, b) => a.date.getTime() - b.date.getTime());

        if (futurePayouts.length > 0) {
            nextPayoutDate = futurePayouts[0].date;
            // Calculate payout amount: If 10 members contribute $100, Payout is $1000.
            // I need to fetch the member count for that specific group to be accurate, joinedGroups already has member_count.
            const nextGroup = joinedGroups.find((g: any) => g.name === futurePayouts[0].groupName);
            if (nextGroup) {
                nextPayoutAmount = Number(nextGroup.amount) * Number(nextGroup.member_count);
            }
        }

        return {
            walletBalance: Number(user.wallet_balance),
            totalSavings: totalStatSavings,
            joinedGroups: joinedGroups.map((g: any) => ({
                ...g,
                amount: Number(g.amount),
                member_count: Number(g.member_count)
            })),
            nextPayout: {
                date: nextPayoutDate,
                amount: nextPayoutAmount,
                groupName: futurePayouts[0]?.groupName || null
            },
            contributions: contributions.map((c: any) => ({
                amount: Number(c.amount),
                date: c.date
            }))
        };

    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        throw new Error('Failed to fetch dashboard data.');
    }
}
