import { updateSettings, fetchUserSettings } from '@/app/lib/actions-user';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/button';
import { auth } from '@/auth';
import { BuildingLibraryIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default async function Page() {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) return <p>Access Denied</p>;

    const settings = await fetchUserSettings(userEmail);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className={`${lusitana.className} text-2xl mb-8`}>Account Settings</h1>

            <div className="grid gap-8">
                {/* Bank Settings Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                            <BuildingLibraryIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Bank Details</h2>
                            <p className="text-sm text-gray-500">Manage your connected bank account for deposits.</p>
                        </div>
                    </div>

                    <form action={updateSettings} className="space-y-4">
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
                                        <p className="text-xs text-gray-500">Receive alerts when it's your turn.</p>
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
                </div>

                {/* Privacy Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Your data is encrypted and secure.</span>
                </div>
            </div>
        </div>
    );
}
