'use client';

import { useActionState } from 'react';
import { updateSettings } from '@/app/lib/actions-user';
import { Button } from '@/app/ui/button';
import { BuildingLibraryIcon, BellIcon } from '@heroicons/react/24/outline';

export default function SettingsForm({ settings }) {
    const initialState = { message: '', errors: {} };
    const [state, dispatch] = useActionState(updateSettings, initialState);

    return (
        <form action={dispatch} className="space-y-4">
            {/* Show Success/Error Message */}
            {state?.message && (
                <div className={`p-3 rounded text-sm ${state.message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                    </label>
                    <input
                        id="bank_name"
                        name="bank_name"
                        type="text"
                        defaultValue={settings?.bank_name}
                        placeholder="e.g. Chase, Wells Fargo"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                    </label>
                    <input
                        id="account_number"
                        name="account_number"
                        type="text"
                        defaultValue={settings?.account_number}
                        placeholder="•••• •••• •••• 1234"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-2">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                            <BellIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">Notifications</h3>
                            <p className="text-xs text-gray-500">Receive alerts when it&apos;s your turn.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="notifications_enabled"
                            defaultChecked={settings?.notifications_enabled}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    );
}
