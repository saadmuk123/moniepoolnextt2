import { fetchAdminStats } from '@/app/lib/actions-admin';
import { lusitana } from '@/app/ui/fonts';
import { Card } from '@/app/ui/dashboard/cards';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import AdminUserTable from '@/app/ui/admin/user-table';
import AdminGroupTable from '@/app/ui/admin/group-table';
import AuditLogTable from '@/app/ui/admin/audit-log-table';
import AnalyticsChart from '@/app/ui/admin/analytics-chart';
import TopGroupsWidget from '@/app/ui/admin/top-groups';
import UserDistributionWidget from '@/app/ui/admin/user-distribution';
import { fetchGlobalTransactions } from '@/app/lib/actions-admin';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const stats = await fetchAdminStats();
    const transactions = await fetchGlobalTransactions();

    const formattedVolume = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(stats.totalVolume / 100);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className={`${lusitana.className} text-2xl`}>Admin Dashboard</h1>
                <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <ShieldCheckIcon className="h-4 w-4" />
                    Admin Area
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card title="Total Users" value={stats.totalUsers} type="customers" />
                <Card title="Total Groups" value={stats.totalGroups} type="groups" />
                <Card title="Total Volume" value={formattedVolume} type="collected" />
            </div>

            {/* Analytics Section */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8 mb-8">
                <div className="md:col-span-4 lg:col-span-4">
                    <AnalyticsChart data={stats.analytics} />
                </div>
                <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-6">
                    <TopGroupsWidget groups={stats.topGroups} />
                    <UserDistributionWidget distribution={stats.userDistribution} />
                </div>
            </div>

            {/* Audit Logs */}
            <div className="mb-8">
                <AuditLogTable transactions={transactions} />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Group Management Table */}
                <div>
                    <h2 className={`${lusitana.className} mb-4 text-xl`}>Group Oversight & Management</h2>
                    <AdminGroupTable groups={stats.groups} />
                </div>

                {/* User Management Table */}
                <div>
                    <h2 className={`${lusitana.className} mb-4 text-xl`}>User Management</h2>
                    <AdminUserTable users={stats.users} />
                </div>
            </div>
        </div>
    );
}
