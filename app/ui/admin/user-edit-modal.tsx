'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUser } from '@/app/lib/actions-admin';
import { UserIcon, CurrencyDollarIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function UserEditModal({ user, onClose }: { user: any, onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        role: user.role || 'user',
        status: user.status || 'active',
        wallet_balance: user.wallet_balance ? user.wallet_balance / 100 : 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateUser(user.id, {
                role: formData.role,
                status: formData.status,
                wallet_balance: Number(formData.wallet_balance) * 100 // Convert back to cents
            });
            router.refresh(); // Refresh the page data
            onClose();
        } catch (error) {
            console.error('Failed to update user', error);
            alert('Failed to update user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4">Edit User: {user.name}</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <div className="relative">
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Status Selection (Ban/Suspend) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                        <div className="relative">
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended / Banned</option>
                            </select>
                            <ShieldExclamationIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Wallet Balance Adjustment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Balance ($)</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                value={formData.wallet_balance}
                                onChange={(e) => setFormData({ ...formData, wallet_balance: Number(e.target.value) })}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                            <CurrencyDollarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Adjust only for corrections.</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
