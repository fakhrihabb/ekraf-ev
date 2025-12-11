'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, ReactNode } from 'react';
import Navbar from './Navbar';

// Create context for search handler
interface SearchContextType {
    onSearchLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
    setSearchHandler: (handler: (location: { lat: number; lng: number; address: string }) => void) => void;
}

const SearchContext = createContext<SearchContextType>({
    setSearchHandler: () => { },
});

export const useSearchContext = () => useContext(SearchContext);

export default function LayoutContent({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';
    const [searchHandler, setSearchHandler] = useState<((location: { lat: number; lng: number; address: string }) => void) | undefined>();

    return (
        <SearchContext.Provider value={{ onSearchLocationSelect: searchHandler, setSearchHandler: (handler) => setSearchHandler(() => handler) }}>
            <Navbar onSearchLocationSelect={searchHandler} />
            <div className={isLandingPage ? '' : 'pt-16'}>
                {children}
            </div>
        </SearchContext.Provider>
    );
}
