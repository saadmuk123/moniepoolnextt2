'use client';

import { useState, useTransition } from 'react';
import { disbandGroup } from '@/app/lib/actions-admin';
import { lusitana } from '@/app/ui/fonts';
import { PowerIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import AdminGroupMembersModal from './admin-group-modal';

export default function AdminGroupTable({
    groups,
}: {
    groups: {
        id: string;
        name: string;
        amount: number;
        interval: string;
        status: string;
        start_date: string;
        member_count: number;
    }[];
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [viewGroup, setViewGroup] = useState < { id: string, name: string } | null > (null);

    const handleDisband = async (groupId: string, groupName: string) => {
        if (!confirm(`Are you sure you want to FORCE CLOSE the group "${groupName}"?`)) return;

        startTransition(async () => {
            await disbandGroup(groupId);
            router.refresh();
        });
    };

    return (
        <div className="w-full">
            {viewGroup && (
                <AdminGroupMembersModal
                    groupId={viewGroup.id}
                    groupName={viewGroup.name}
                    onClose={() => setViewGroup(null)}
                />
            )}
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            Group Name
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Contribution
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Interval
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Members
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3 pl-6 pr-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {groups.map((group) => (
                                        <tr key={group.id} className="group">
                                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                                <div className="flex items-center gap-3">
                                                    <p>{group.name}</p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(group.amount)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {group.interval}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {group.member_count}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${group.status === 'disbanded'
                                                    ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                                    : group.status === 'active'
                                                        ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                        : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
                                                    }`}>
                                                    {group.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => setViewGroup({ id: group.id, name: group.name })}
                                                        className="rounded-md border p-2 hover:bg-gray-100"
                                                        title="View Members"
                                                    >
                                                        <EyeIcon className="w-4 h-4 text-gray-500" />
                                                    </button>
                                                    {group.status !== 'disbanded' && (
                                                        <button
                                                            onClick={() => handleDisband(group.id, group.name)}
                                                            disabled={isPending}
                                                            title="Force Close / Disband"
                                                            className="rounded-md border p-2 hover:bg-red-50 text-red-600 border-red-200"
                                                        >
                                                            <PowerIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {groups.length === 0 && (
                                <div className="p-4 text-center text-gray-500">No groups found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
