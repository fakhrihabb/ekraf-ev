'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, FolderKanban } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isLandingPage = pathname === '/';

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On landing page: invisible when at top, visible when scrolled
  // On other pages: always visible
  const navClasses = isLandingPage
    ? isScrolled
      ? 'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 opacity-100'
      : 'fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 opacity-0 pointer-events-none'
    : 'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm opacity-100';

  const textClasses = isLandingPage && !isScrolled ? 'text-white' : 'text-gray-700';
  const logoTextClasses = isLandingPage && !isScrolled ? 'text-white' : 'gradient-text';

  return (
    <nav className={navClasses}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            {/* Logo SVG */}
            <img src="/branding/logo.svg" alt="SIVANA Logo" className="h-10 w-10" />
            {/* Text */}
            <span className={`text-2xl font-extrabold italic ${logoTextClasses}`} style={{ fontFamily: 'Inter, sans-serif' }}>SIVANA</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/intelligence-planner"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/intelligence-planner')
                ? 'bg-[var(--color-light-blue)] text-white'
                : `${textClasses} hover:bg-gray-100`
                }`}
            >
              <Map className="w-4 h-4" />
              <span className="font-medium">Intelligence Planner</span>
            </Link>
            <Link
              href="/projects"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/projects')
                ? 'bg-[var(--color-light-blue)] text-white'
                : `${textClasses} hover:bg-gray-100`
                }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span className="font-medium">Proyek</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
