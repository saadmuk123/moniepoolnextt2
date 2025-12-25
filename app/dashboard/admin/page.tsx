import { fetchAdminStats } from '@/app/lib/actions-admin';
import { lusitana } from '@/app/ui/fonts';
import { Card } from '@/app/ui/dashboard/cards'; // Reusing components
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline'; // Importing icons

export default async function Page() {
    const stats = await fetchAdminStats();

    const formattedVolume = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalVolume / 100);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className={`${lusitana.className} text-2xl`}>Admin Dashboard</h1>
                <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <ShieldCheckIcon className="h-4 w-4" />
                    Admin Area
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card title="Total Users" value={stats.totalUsers} type="customers" />
                <Card title="Total Groups" value={stats.totalGroups} type="groups" />
                <Card title="Total Volume" value={formattedVolume} type="collected" />
            </div>

            {/* User Management Table */}
            <h2 className={`${lusitana.className} mb-4 text-xl`}>User Management</h2>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Balance</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.users.map((user: any) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                <UserIcon className="h-6 w-6" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.group_count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.wallet_balance / 100)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Action buttons (Edit/Delete) could go here */}
                                        <a href="#" className="text-blue-600 hover:text-blue-900">Edit</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
