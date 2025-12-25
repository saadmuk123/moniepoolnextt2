import { lusitana } from '@/app/ui/fonts';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function AuditLogTable({
    transactions,
}: {
    transactions: {
        id: string;
        amount: number;
        date: string;
        userName: string;
        groupName: string;
    }[];
}) {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h2 className={`${lusitana.className} text-xl`}>Global Transaction Feed (Audit Log)</h2>
                <a
                    href="/api/admin/export-audit"
                    target="_blank"
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export CSV
                </a>
            </div>
            <div className="mt-4 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            Date
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            User
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Group
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="group">
                                            <td className="whitespace-nowrap py-3 pl-6 pr-3 text-sm text-gray-500">
                                                {new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString()}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3 text-sm font-medium">
                                                {t.userName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                {t.groupName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-green-600">
                                                +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(t.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {transactions.length === 0 && (
                                <div className="p-4 text-center text-gray-500">No recent transactions</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
