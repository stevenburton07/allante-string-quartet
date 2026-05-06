'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/concerts', label: 'Concerts' },
  { href: '/sunset-series', label: 'Sunset Series' },
  { href: '/hire', label: 'Hire us' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation({ mobile = false, onNavigate }: NavigationProps) {
  const pathname = usePathname();

  const baseClasses = mobile
    ? 'block px-3 py-2 rounded-md text-base font-medium'
    : 'px-3 py-2 rounded-md text-sm font-medium';

  const getClasses = (href: string) => {
    const isActive = pathname === href;
    if (mobile) {
      return `${baseClasses} ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-700 hover:bg-light-gray hover:text-primary'
      }`;
    }
    return `${baseClasses} ${
      isActive
        ? 'text-primary border-b-2 border-primary'
        : 'text-gray-700 hover:text-primary transition-colors'
    }`;
  };

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={getClasses(item.href)}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
