import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { lusitana } from '@/app/ui/fonts';
import { fetchDashboardData } from '@/app/lib/actions-dashboard';
import { Suspense } from 'react';
import { RevenueChartSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  const dashboardData = await fetchDashboardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Adashe Stats */}
        <Card title="Wallet Balance" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dashboardData.walletBalance / 100)} type="collected" />
        <Card title="Total Savings" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dashboardData.totalSavings / 100)} type="pending" />
        <Card title="Active Groups" value={dashboardData.joinedGroups.length} type="invoices" />
        {/* Next Payout Card Logic could go here or remain in specific component */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart contributions={dashboardData.contributions} />
        </Suspense>
        {/* Removed LatestInvoices */}
      </div>
    </main>
  );
}