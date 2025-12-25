import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { lusitana } from '@/app/ui/fonts';
import { fetchDashboardData } from '@/app/lib/actions-dashboard';
import { Suspense } from 'react';
import { CardsSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const data = await fetchDashboardData();

    if (data.role === 'admin') {
        redirect('/dashboard/admin');
    }

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Welcome, {data.userName || 'User'} to your Dashboard
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

                {/* My Groups List - Premium View */}
                <div className="w-full md:col-span-4 flex flex-col">
                    <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                        My Groups
                    </h2>
                    <div className="flex-grow flex flex-col justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                        {/* Inner Card */}
                        <div className="bg-white px-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
                            {data.joinedGroups.map((group: any, i: number) => (
                                <div
                                    key={group.id}
                                    className={`group flex flex-row items-center justify-between py-4 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 -mx-6 px-6 ${i !== 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
                                >
                                    <div className="flex items-center">
                                        {/* Avatar with Gradient */}
                                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 shadow-sm dark:from-blue-900 dark:to-blue-800 dark:text-blue-200">
                                            <span className="font-bold text-xs">{group.interval === 'weekly' ? 'W' : 'M'}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold md:text-base text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {group.name}
                                            </p>
                                            {/* Badge for Position */}
                                            <div className="hidden sm:flex items-center mt-0.5">
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                    Pos #{group.position}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`${lusitana.className} truncate text-sm font-bold md:text-base text-gray-900 dark:text-gray-100`}>
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(group.amount / 100)}
                                    </p>
                                </div>
                            ))}
                            {data.joinedGroups.length === 0 && (
                                <p className="py-4 text-center text-gray-500 dark:text-gray-400">You haven't joined any groups yet.</p>
                            )}
                        </div>

                        {/* polished View All Button */}
                        <div className="flex items-center pb-2 pt-6">
                            <Link
                                href="/dashboard/groups"
                                className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400 transition-all"
                            >
                                <span>View all groups</span>
                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
