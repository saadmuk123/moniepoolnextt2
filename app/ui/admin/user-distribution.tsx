'use client';

import { lusitana } from '@/app/ui/fonts';
import { UsersIcon } from '@heroicons/react/24/outline';

export default function UserDistributionWidget({
    distribution,
}: {
    distribution: { admins: number; users: number; active: number; suspended: number };
}) {
    const total = distribution.admins + distribution.users;
    const adminPct = total ? (distribution.admins / total) * 100 : 0;

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                User Distribution
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="bg-white p-4 rounded-md">

                    {/* Role Breakdown */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Admins</span>
                            <span className="font-bold">{distribution.admins}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${adminPct}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                            <span>Users</span>
                            <span className="font-bold">{distribution.users}</span>
                        </div>
                    </div>

                    {/* Status Breakdown (Simple Grid) */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{distribution.active}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Active</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">{distribution.suspended}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Suspended</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <UsersIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">User Segments</h3>
                </div>
            </div>
        </div>
    );
}
