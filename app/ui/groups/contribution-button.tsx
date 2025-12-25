'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/app/ui/button';
import { toast } from 'sonner';
import { recordContribution } from '@/app/lib/actions-groups';

export function ContributionButton({ groupId, userId, amount }: { groupId: string, userId: string, amount: number }) {
    const initialState = { message: '' };
    const recordContributionWithArgs = recordContribution.bind(null, groupId, userId, amount);
    const [state, dispatch] = useActionState(recordContributionWithArgs, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.message.includes('success')) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    return (
        <form action={dispatch}>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 h-8 px-3 text-xs w-full">
                Mark Contributed
            </Button>
        </form>
    );
}
