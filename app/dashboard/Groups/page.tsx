import { fetchUserGroups, fetchAvailableGroups } from '@/app/lib/actions-groups';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import Search from '@/app/ui/search';
import GroupCard from '@/app/ui/groups/group-card';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const view = params?.view || 'explore'; // Default to explore

  // Fetch logic based on tab
  let groups: any[] = [];
  if (view === 'my') {
    groups = await fetchUserGroups();
  } else {
    groups = await fetchAvailableGroups();
  }

  // Simple in-memory search filtering (since SQL search was removed for simplicity in specific fetches, or we can add it back)
  // For now, let's just filter array if query exists, to keep SQL simple
  if (query) {
    groups = groups.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className} text-2xl`}>Adashe Groups</h1>
        <Link
          href="/dashboard/groups/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-sm"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Group
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-xl bg-gray-100/80 p-1 mb-6 w-fit">
        <Link
          href="/dashboard/groups?view=explore"
          scroll={false}
          className={`w-32 rounded-lg py-2.5 text-sm font-medium leading-5 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${view === 'explore'
              ? 'bg-white text-blue-700 shadow'
              : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'
            }`}
        >
          Explore
        </Link>
        <Link
          href="/dashboard/groups?view=my"
          scroll={false}
          className={`w-32 rounded-lg py-2.5 text-sm font-medium leading-5 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${view === 'my'
              ? 'bg-white text-purple-700 shadow'
              : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'
            }`}
        >
          My Groups
        </Link>
      </div>

      <div className="mb-8">
        <Search placeholder={`Search ${view === 'my' ? 'your' : 'available'} groups...`} />
      </div>

      <Suspense fallback={<div className="text-center py-10">Loading groups...</div>}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">
                {view === 'my'
                  ? "You haven't joined any groups yet."
                  : "No available groups found matching your criteria."}
              </p>
              {view === 'my' && (
                <Link href="/dashboard/groups?view=explore" className="text-blue-600 hover:underline">
                  Explore groups to join
                </Link>
              )}
            </div>
          ) : (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isMember={view === 'my'}
              />
            ))
          )}
        </div>
      </Suspense>
    </div>
  );
}
