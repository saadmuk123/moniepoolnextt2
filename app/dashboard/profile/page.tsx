

import { fetchUserProfile } from '@/app/lib/data';
import { auth } from '@/auth';
import { lusitana } from '@/app/ui/fonts';
import {
    UserCircleIcon,
    BanknotesIcon,
    CreditCardIcon,
    ClockIcon,
    WalletIcon,
    UserGroupIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function Page() {
    const session = await auth();

    if (!session?.user?.email) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-2">
                <h2 className="text-xl font-semibold">Not Authenticated</h2>
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    const user = await fetchUserProfile(session.user.email);

    return (
        <div className="w-full space-y-8">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>My Profile</h1>
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit Settings
                </Link>
            </div>

            {/* Profile & Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* User Info - Spans 2 cols on large screens */}
                <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                                <UserCircleIcon className="h-10 w-10 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <div className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                                    Verified Member
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wallet Balance */}
                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-md">
                    <div className="flex items-center justify-between opacity-80">
                        <span className="text-sm font-medium">Wallet Balance</span>
                        <WalletIcon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-3xl font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.balance)}
                    </div>
                    <p className="mt-1 text-xs opacity-70">Available for withdrawal</p>
                </div>

                {/* Total Contributed */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between text-gray-500">
                        <span className="text-sm font-medium">Total Contributed</span>
                        <BanknotesIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="mt-4 text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.total_contributed)}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Lifetime savings</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Bank Information */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <CreditCardIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Bank Details</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Bank Name</p>
                            <p className="text-base font-medium text-gray-900 mt-1">{user.bank_name || 'Not set'}</p>
                        </div>
                        <div className="pt-4 border-t border-gray-50">
                            <p className="text-sm font-medium text-gray-500">Account Number</p>
                            <p className="font-mono text-base font-medium text-gray-900 mt-1 tracking-wider">
                                {user.account_number ? `****${user.account_number.slice(-4)}` : 'Not set'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <ClockIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                    </div>

                    <div className="flow-root">
                        <ul className="-my-5 divide-y divide-gray-100">
                            {user.recent_activity.length > 0 ? (
                                user.recent_activity.map((activity: any, i: number) => (
                                    <li key={i} className="py-4 hover:bg-gray-50/50 transition-colors -mx-4 px-4 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-none rounded-full bg-green-50 p-1.5">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    Contribution to {activity.group_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {activity.date}
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activity.amount)}
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="py-4 text-center text-sm text-gray-500">No recent activity</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
