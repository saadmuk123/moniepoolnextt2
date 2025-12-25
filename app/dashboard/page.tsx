import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { lusitana } from '@/app/ui/fonts';
import { fetchDashboardData } from '@/app/lib/actions-dashboard';
import { Suspense } from 'react';
import { CardsSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default async function Page() {
    const data = await fetchDashboardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>

            {/* Stat Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper data={data} />
                </Suspense>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                {/* Revenue Chart */}
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart contributions={data.contributions} />
                </Suspense>

                {/* My Groups List - Simple View */}
                <div className="w-full md:col-span-4 flex flex-col">
                    <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                        My Groups
                    </h2>
                    <div className="flex-grow flex flex-col justify-between rounded-xl bg-gray-50 p-4">
                        <div className="bg-white px-6">
                            {data.joinedGroups.map((group: any, i: number) => (
                                <div
                                    key={group.id}
                                    className={`flex flex-row items-center justify-between py-4 ${i !== 0 ? 'border-t' : ''}`}
                                >
                                    <div className="flex items-center">
                                        <div className="mr-4 rounded-full bg-blue-100 p-2 text-blue-600">
                                            <span className="font-bold text-xs">{group.interval === 'weekly' ? 'W' : 'M'}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold md:text-base">
                                                {group.name}
                                            </p>
                                            <p className="hidden text-sm text-gray-500 sm:block">
                                                Pos: #{group.position}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(group.amount / 100)}
                                    </p>
                                </div>
                            ))}
                            {data.joinedGroups.length === 0 && (
                                <p className="py-4 text-gray-500">You haven't joined any groups yet.</p>
                            )}
                        </div>
                        <div className="flex items-center pb-2 pt-6">
                            <ArrowRightIcon className="h-5 w-5 text-gray-500" />
                            <Link href="/dashboard/groups" className="ml-2 text-sm text-gray-500 hover:text-blue-600">
                                View all groups
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
