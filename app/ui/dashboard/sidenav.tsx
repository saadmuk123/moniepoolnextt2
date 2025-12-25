import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 dark:bg-white/10 p-4 md:h-40 dark:backdrop-blur-sm transition-colors"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-transparent md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });

          }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-white p-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-red-50 hover:text-red-600 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 md:flex-none md:justify-start md:p-2 md:px-3 transition-all border border-gray-200 dark:border-transparent">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
