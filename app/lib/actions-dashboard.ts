'use server';

import { auth } from '@/auth';
import sql from './db';

export async function fetchDashboardData() {
    console.log('Fetching dashboard data...');
    try {
        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');
        console.log('User authenticated:', session.user.email);

        const userResult = await sql`SELECT id, name, role, wallet_balance FROM users WHERE email = ${session.user.email}`;
        const user = userResult[0];
        if (!user) {
            console.error('User not found for email:', session.user.email);
            throw new Error('User not found');
        }
        const userId = user.id;

        interface JoinedGroup {
            id: string;
            name: string;
            amount: number;
            interval: 'weekly' | 'monthly';
            start_date: string;
            position: number;
            status: string;
            max_members: number;
            member_count: number;
        }

        interface Contribution {
            amount: number;
            date: string;
        }

        console.log('Fetching groups and contributions in parallel...');
        // Serialized execution to debug AggregateError/Timeout
        console.log('Fetching joinedGroups...');
        const joinedGroupsRaw = await sql`
            SELECT g.id, g.name, g.amount, g.interval, g.start_date, m.position, m.status, g.max_members,
            (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) as member_count
            FROM groups g
            JOIN group_members m ON g.id = m.group_id
            WHERE m.user_id = ${userId}
            ORDER BY g.start_date DESC
        `;

        console.log('Fetching contributions...');
        const contributionsRaw = await sql`
            SELECT amount, date
            FROM contributions
            WHERE user_id = ${userId}
            ORDER BY date ASC
        `;
        console.log('Sequential fetch complete.');

        if (!Array.isArray(joinedGroupsRaw)) {
            console.error('joinedGroupsRaw is not an array:', typeof joinedGroupsRaw);
            throw new Error('Failed to fetch groups: Invalid data structure');
        }
        if (!Array.isArray(contributionsRaw)) {
            console.error('contributionsRaw is not an array:', typeof contributionsRaw);
            throw new Error('Failed to fetch contributions: Invalid data structure');
        }

        const joinedGroups = joinedGroupsRaw as unknown as JoinedGroup[];
        const contributions = contributionsRaw as unknown as Contribution[];

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

        joinedGroups.forEach((group) => {
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
                        amount: Number(group.amount),
                        groupName: group.name
                    });
                }
            }
        });

        // Sort future payouts
        futurePayouts.sort((a, b) => a.date.getTime() - b.date.getTime());

        if (futurePayouts.length > 0) {
            nextPayoutDate = futurePayouts[0].date;
            const nextGroup = joinedGroups.find((g) => g.name === futurePayouts[0].groupName);
            if (nextGroup) {
                nextPayoutAmount = Number(nextGroup.amount) * Number(nextGroup.member_count);
            }
        }

        return {
            userName: user.name, // Add user name to response
            role: user.role, // Add role to response
            walletBalance: Number(user.wallet_balance),
            totalSavings: totalStatSavings,
            joinedGroups: joinedGroups.map((g) => ({
                ...g,
                amount: Number(g.amount),
                member_count: Number(g.member_count)
            })),
            nextPayout: {
                date: nextPayoutDate,
                amount: nextPayoutAmount,
                groupName: futurePayouts[0]?.groupName || null
            },
            contributions: contributions.map((c) => ({
                amount: Number(c.amount),
                date: c.date
            }))
        };

    } catch (error: any) {
        console.error('Detailed Error in fetchDashboardData:', error);

        if (error.code === 'ETIMEDOUT' || error.code === 'CONNECT_TIMEOUT') {
            throw new Error('Database connection timed out. Please check your internet connection or firewall settings.');
        }
        throw error;
    }
}
