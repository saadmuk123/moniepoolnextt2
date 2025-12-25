'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  WrenchIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';



// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'My Groups', href: '/dashboard/groups', icon: UserGroupIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: WrenchIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  { name: 'Help', href: '/dashboard/help', icon: QuestionMarkCircleIcon },


];

export default function NavLinks() {
  const pathname = usePathname();

  // Highlight the active link based on the current pathname.
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-white p-3 text-sm font-medium text-gray-700 shadow-sm md:bg-transparent md:shadow-none hover:bg-gray-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 transition-colors',
              {
                'bg-blue-600 md:bg-blue-600 text-white hover:bg-blue-600 md:hover:bg-blue-600 dark:bg-indigo-600 dark:md:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500 dark:md:hover:bg-indigo-500': pathname === link.href,
              },
            )} >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
