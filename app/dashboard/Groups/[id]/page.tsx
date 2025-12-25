import { fetchGroupDetails, joinGroup, payoutToMember, recordContribution } from '@/app/lib/actions-groups';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/button';
import { Member } from '@/app/lib/definitions';
import { UserCircleIcon, CalendarIcon, BanknotesIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { auth } from '@/auth';

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    // @ts-expect-error: Inferred type from server action is complex
    const { group, members, stats } = await fetchGroupDetails(id);
    const session = await auth();
    const currentUserEmail = session?.user?.email;

    const isMember = members.some((m: Member) => m.email === currentUserEmail);
    const isFull = group.max_members && members.length >= group.max_members;

    return (
        <div className="w-full">
            <div className="flex w-full items-start justify-between">
                <div>
                    <h1 className={`${lusitana.className} text-2xl`}>{group.name}</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <BanknotesIcon className="h-4 w-4" />
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(group.amount)} / {group.interval}
                        </div>
                        <div className="flex items-center gap-1">
                            <UserGroupIcon className="h-4 w-4" />
                            {members.length} / {group.max_members} Members
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            Starts {new Date(group.start_date).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {!isMember && !isFull && (
                    <form action={joinGroup.bind(null, id)}>
                        <Button type="submit">Join Group</Button>
                    </form>
                )}
                {!isMember && isFull && (
                    <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300">
                        Group Full
                    </Button>
                )}
                {isMember && (
                    <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Member
                    </div>
                )}
            </div>

            {/* Stats Card */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-6 shadow-sm border border-gray-100">
                    <div className="flex p-4">
                        <BanknotesIcon className="h-5 w-5 text-gray-700" />
                        <h3 className="ml-2 text-sm font-medium">Total Collected (Lifetime)</h3>
                    </div>
                    <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl font-bold text-gray-900 border border-gray-100">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats?.totalCollected || 0)}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Rotation Schedule</h2>
                <div className="rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                    <table className="min-w-full text-gray-900">
                        <thead className="bg-gray-100 text-left text-sm font-semibold">
                            <tr>
                                <th scope="col" className="px-4 py-3 sm:pl-6">Pos</th>
                                <th scope="col" className="px-4 py-3">Member</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Contributed</th>
                                <th scope="col" className="px-4 py-3">Payout Est.</th>
                                <th scope="col" className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {members.map((member) => (
                                <tr key={member.user_id} className="hover:bg-gray-50/50">
                                    <td className="whitespace-nowrap px-4 py-3 sm:pl-6 font-mono text-gray-500">#{member.position}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${member.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(member.total_contributed || 0)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <span className="text-sm text-gray-500">
                                            {new Date(new Date(group.start_date).getTime() + (member.position - 1) * (group.interval === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 space-y-2">
                                        {/* Payout Action */}
                                        {member.status === 'active' && (
                                            <form action={payoutToMember.bind(null, id, member.user_id)}>
                                                <Button type="submit" className="bg-green-600 hover:bg-green-500 h-8 px-3 text-xs w-full">
                                                    Pay Out
                                                </Button>
                                            </form>
                                        )}
                                        {/* Contribution Action */}
                                        <form action={recordContribution.bind(null, id, member.user_id, group.amount)}>
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 h-8 px-3 text-xs w-full">
                                                Mark Contributed
                                            </Button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {members.length === 0 && (
                        <div className="p-6 text-center text-gray-500">No members yet. Be the first to join!</div>
                    )}
                </div>
            </div>
        </div>
    );
}
