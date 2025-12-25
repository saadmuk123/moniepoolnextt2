
'use client';

import { createGroup } from '@/app/lib/actions-groups';
import { useActionState } from 'react';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

export default function Page() {
    const [state, formAction] = useActionState(createGroup, null);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className={`${lusitana.className} text-2xl mb-8`}>Create New Group</h1>

            <form action={formAction} className="rounded-xl bg-gray-50 p-6 shadow-sm border border-gray-100 space-y-6">
                {/* Group Name */}
                <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">Group name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter group name"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">This is your group name.</p>
                    {state?.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Placeholder"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">group description</p>
                    {state?.errors?.description && <p className="text-red-500 text-sm mt-1">{state.errors.description[0]}</p>}
                </div>

                {/* Grid: Max Members & Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="max_members" className="mb-2 block text-sm font-medium">Max No of Members</label>
                        <input
                            id="max_members"
                            name="max_members"
                            type="number"
                            placeholder="e.g. 10"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                        {state?.errors?.max_members && <p className="text-red-500 text-sm mt-1">{state.errors.max_members[0]}</p>}
                    </div>

                    <div>
                        <label htmlFor="interval" className="mb-2 block text-sm font-medium">Payment Frequency</label>
                        <select
                            id="interval"
                            name="interval"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                        >
                            <option value="" disabled selected>Select a Frequency</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">How frequent, payment should be made</p>
                        {state?.errors?.interval && <p className="text-red-500 text-sm mt-1">{state.errors.interval[0]}</p>}
                    </div>
                </div>

                {/* Contribution Amount (Kept as it is required for logic) */}
                <div>
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">Contribution Amount ($)</label>
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                        required
                    />
                    {state?.errors?.amount && <p className="text-red-500 text-sm mt-1">{state.errors.amount[0]}</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="start_date" className="mb-2 block text-sm font-medium">Start Date</label>
                        <input
                            id="start_date"
                            name="start_date"
                            type="date"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                        {state?.errors?.start_date && <p className="text-red-500 text-sm mt-1">{state.errors.start_date[0]}</p>}
                    </div>
                    {/* End Date is calculated automatically based on start date and duration */}
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <Link href="/dashboard/groups" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
                        Cancel
                    </Link>
                    <Button type="submit">Create Group</Button>
                </div>
                {state?.message && <p className="text-red-500 text-sm mt-4 text-center">{state.message}</p>}
            </form>
        </div>
    );
}
