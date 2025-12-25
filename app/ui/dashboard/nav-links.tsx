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
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-purple-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-purple-600': pathname === link.href,
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
