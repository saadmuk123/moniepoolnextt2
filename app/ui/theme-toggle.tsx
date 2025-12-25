'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-10 w-full animate-pulse rounded-md bg-gray-100 dark:bg-slate-800"></div>;
    }

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${theme === 'light'
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400'
                        : 'border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
            >
                <SunIcon className="h-5 w-5" />
                Light
            </button>

            <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${theme === 'dark'
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400'
                        : 'border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
            >
                <MoonIcon className="h-5 w-5" />
                Dark
            </button>

            <button
                onClick={() => setTheme('system')}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${theme === 'system'
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400'
                        : 'border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
            >
                <ComputerDesktopIcon className="h-5 w-5" />
                System
            </button>
        </div>
    );
}
