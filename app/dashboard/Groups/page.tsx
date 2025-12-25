
import { fetchGroups } from '@/app/lib/actions-groups';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { PlusIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import Search from '@/app/ui/search';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const groups = await fetchGroups(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Adashe Groups</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search groups..." />
        <Link
          href="/dashboard/groups/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Group
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.length === 0 ? (
          <p className="text-gray-500">No groups available. Create one to get started!</p>
        ) : (
          groups.map((group) => (
            <Link key={group.id} href={`/dashboard/groups/${group.id}`}>
              <div className="rounded-xl bg-gray-50 p-6 shadow-sm hover:bg-sky-50 transition-colors cursor-pointer border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <UserGroupIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-bold">
                      <span>{group.interval}</span>
                      <span>&bull;</span>
                      {group.max_members && group.member_count >= group.max_members ? (
                        <span className="text-red-600">Full</span>
                      ) : (
                        <span>{group.max_members ? `${group.max_members - group.member_count} spots left` : `${group.member_count} members`}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Members */}
                {group.max_members > 0 && (
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                    <div
                      className={`h-1.5 rounded-full ${group.member_count >= group.max_members ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min((group.member_count / group.max_members) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}

                <div className="flex items-end justify-between border-t pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Contribution</p>
                    <p className="font-medium text-lg">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(group.amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                    <span>{group.max_members && group.member_count >= group.max_members ? 'View Details' : 'Join Group'}</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
