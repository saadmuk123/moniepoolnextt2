'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import sql from './db';
import { auth } from '@/auth';

const UpdateSettingsSchema = z.object({
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    notifications_enabled: z.coerce.boolean(),
});

export async function updateSettings(prevState: any, formDataRaw: FormData | any) {
    // Robust argument handling: find which argument is FormData
    const formData = (prevState instanceof FormData ? prevState : formDataRaw);

    // Debug log to confirm fix (optional, can be removed later)
    // console.log('Resolved FormData:', formData);

    const validatedFields = UpdateSettingsSchema.safeParse({
        bank_name: formData?.get('bank_name'),
        account_number: formData?.get('account_number'),
        notifications_enabled: formData?.get('notifications_enabled') === 'on',
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid input.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { bank_name, account_number, notifications_enabled } = validatedFields.data;

    try {
        const session = await auth();
        if (!session?.user?.email) throw new Error('Not authenticated');

        await sql`
      UPDATE users
      SET 
        bank_name = ${bank_name || null},
        account_number = ${account_number || null},
        notifications_enabled = ${notifications_enabled}
      WHERE email = ${session.user.email}
    `;

        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard/profile');
        return { message: 'Settings updated successfully' };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { message: 'Database Error: Failed to update settings.' };
    }
}

export async function fetchUserSettings(email: string) {
    try {
        const user = await sql`
            SELECT bank_name, account_number, notifications_enabled 
            FROM users 
            WHERE email = ${email}
        `;
        return user[0];
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null; // Return null so UI can handle empty state gracefully
    }
}
