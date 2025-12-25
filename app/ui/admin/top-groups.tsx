'use client';

import { clsx } from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function TopGroupsWidget({
    groups,
}: {
    groups: { name: string; total: number }[];
}) {
    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Top Performing Groups
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                <div className="bg-white px-6">
                    {groups.map((group, i) => {
                        return (
                            <div
                                key={group.name}
                                className={clsx(
                                    'flex flex-row items-center justify-between py-4',
                                    {
                                        'border-t': i !== 0,
                                    },
                                )}
                            >
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center bg-blue-100 text-blue-700 w-8 h-8 rounded-full mr-4 font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {group.name}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    ${group.total.toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
                    {groups.length === 0 && (
                        <div className="py-4 text-gray-500 text-center text-sm">No groups found</div>
                    )}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <UserGroupIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Ranked by Total Balance</h3>
                </div>
            </div>
        </div>
    );
}
