import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
  wallet: CurrencyDollarIcon,
  payout: ClockIcon,
  groups: UserGroupIcon,
};

export default async function CardWrapper({ data }: { data?: any }) {
  if (!data) return null; // Or skeleton

  const { walletBalance, totalSavings, nextPayout, joinedGroups } = data;

  const formattedWallet = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(walletBalance / 100);
  const formattedSavings = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(totalSavings / 100);
  const formattedPayout = nextPayout
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(nextPayout.amount / 100)
    : '$0.00';

  const payoutDate = nextPayout?.date
    ? new Date(nextPayout.date).toLocaleDateString()
    : 'No active payouts';

  return (
    <>
      <Card title="Wallet Balance" value={formattedWallet} type="wallet" />
      <Card title="Total Savings" value={formattedSavings} type="collected" />
      <Card title="Next Payout" value={formattedPayout} type="payout" subtext={payoutDate} />
      <Card title="Active Groups" value={joinedGroups?.length || 0} type="groups" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
  subtext,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected' | 'wallet' | 'payout' | 'groups';
  subtext?: string;
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : null}
        <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl text-gray-900 dark:bg-gray-900 dark:text-white`}
      >
        {value}
      </p>
      {subtext && <p className="text-xs text-center text-gray-500 mt-2 pb-2 dark:text-gray-400">{subtext}</p>}
    </div>
  );
}
