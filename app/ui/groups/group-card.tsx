import Link from 'next/link';
import { UserGroupIcon, ArrowRightIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function GroupCard({
    group,
    isMember = false,
}: {
    group: {
        id: string;
        name: string;
        amount: number;
        interval: string;
        member_count: number;
        max_members: number;
        member_status?: string;
    };
    isMember?: boolean;
}) {
    const isFull = group.max_members > 0 && group.member_count >= group.max_members;
    const progressPercent = group.max_members > 0
        ? Math.min((group.member_count / group.max_members) * 100, 100)
        : 0;

    return (
        <Link href={`/dashboard/groups/${group.id}`} className="group relative block overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md border border-gray-100">

            {/* Decorative Gradient Header */}
            <div className={`h-24 w-full bg-gradient-to-r ${isMember ? 'from-purple-500 to-indigo-600' : 'from-blue-500 to-teal-500'} relative`}>
                <div className="absolute -bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg text-gray-700 ring-4 ring-white">
                    <UserGroupIcon className="h-6 w-6" />
                </div>
                {isMember && group.member_status && (
                    <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center rounded-full bg-black/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {group.member_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                    </div>
                )}
            </div>

            <div className="px-6 pt-8 pb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`${lusitana.className} text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors`}>
                            {group.name}
                        </h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                            {group.interval} Contribution
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 bg-green-50 px-2 py-1 rounded text-green-700">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(group.amount)}
                        </p>
                    </div>
                </div>

                {/* Access/Capacity Info */}
                <div className="mt-6">
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-600 font-medium">Capacity</span>
                        <span className={`${isFull ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                            {isFull ? 'FULL' : `${group.member_count} / ${group.max_members} Members`}
                        </span>
                    </div>
                    {group.max_members > 0 && (
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : isMember ? 'bg-purple-500' : 'bg-blue-500'}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <BanknotesIcon className="h-4 w-4" />
                        <span>Pool: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN', notation: 'compact' }).format(group.amount * group.max_members)}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                        {isMember ? 'Go to Dashboard' : (isFull ? 'View Details' : 'Join Now')}
                        <ArrowRightIcon className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
