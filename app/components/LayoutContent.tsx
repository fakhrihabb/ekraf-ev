'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    return (
        <>
            <Navbar />
            <div className={isLandingPage ? '' : 'pt-16'}>
                {children}
            </div>
        </>
    );
}
