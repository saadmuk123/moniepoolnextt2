
import { fetchUserProfile } from '@/app/lib/data';
import { auth } from '@/auth';
import { lusitana } from '@/app/ui/fonts';
import {
    UserCircleIcon,
    BanknotesIcon,
    CreditCardIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

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
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>My Profile</h1>
            </div>

            <div className="mt-8 flex flex-col gap-6 md:flex-row">
                {/* Main Info Card */}
                <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-gray-50 p-6 md:w-1/2">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <UserCircleIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">{user.name}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-medium text-gray-500">Account Status</p>
                        <div className="mt-1 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            {user.status}
                        </div>
                    </div>
                </div>

                {/* Bank Details Card */}
                <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-blue-600 p-6 text-white md:w-1/2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Total Balance</h3>
                        <BanknotesIcon className="h-6 w-6 opacity-80" />
                    </div>

                    <div className="mt-2 text-3xl font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: user.currency }).format(user.balance)}
                    </div>

                    <div className="mt-6 flex flex-col gap-1 text-sm opacity-90">
                        <div className="flex justify-between">
                            <span>Account Number</span>
                            <span className="font-mono tracking-wider">{user.accountNumber}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-500 pt-1 mt-1">
                            <span>Sort Code</span>
                            <span className="font-mono tracking-wider">{user.sortCode}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section (Mocked) */}
            <div className="mt-8 rounded-xl bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-white p-2 text-gray-500 shadow-sm">
                                    <ClockIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Payment Received</p>
                                    <p className="text-xs text-gray-500">From Invoice #{Math.floor(Math.random() * 1000)}</p>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-green-600">
                                + $1,200.00
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
