'use client';

import { useState, useEffect, useTransition } from 'react';
import { fetchGroupMembersAdmin, markMemberAsPaid } from '@/app/lib/actions-admin';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AdminGroupMembersModal({
    groupId,
    groupName,
    onClose
}: {
    groupId: string;
    groupName: string;
    onClose: () => void;
}) {
    const [members, setMembers] = useState < any[] > ([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let mounted = true;
        fetchGroupMembersAdmin(groupId).then((data) => {
            if (mounted) {
                setMembers(data);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [groupId]);

    const handleMarkPaid = async (userId: string) => {
        if (!confirm('Are you sure you want to mark this member as PAID?')) return;

        startTransition(async () => {
            await markMemberAsPaid(groupId, userId);
            // Refresh local list
            const updated = await fetchGroupMembersAdmin(groupId);
            setMembers(updated);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">Members: {groupName}</h2>
                    <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-8">Loading members...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {members.map((member) => (
                                    <tr key={member.userId}>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                            #{member.position}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                                            {member.name}
                                            <div className="text-xs text-gray-500">{member.email}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${member.status === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-right text-sm">
                                            {member.status !== 'paid' && (
                                                <button
                                                    onClick={() => handleMarkPaid(member.userId)}
                                                    disabled={isPending}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
