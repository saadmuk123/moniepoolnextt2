'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

// Reusing styling logic from revenue-chart.tsx but adapted dynamically
export default function AnalyticsChart({
    data,
}: {
    data: { date: string; total: number }[];
}) {
    const chartHeight = 350;

    const { yAxisLabels, topLabel } = generateYAxis(data);

    if (!data || data.length === 0) {
        return (
            <div className="w-full md:col-span-4">
                <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                    Transaction Analytics
                </h2>
                <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center justify-center h-[350px] text-gray-500">
                        No data available yet.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Transaction Volume (Last 7 Days)
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="sm:grid-cols-8 mt-0 grid grid-cols-7 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
                    {/* Y-Axis (Hidden on small, explicit width on large if needed, here mimicking revenue-chart) */}
                    <div
                        className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
                        style={{ height: `${chartHeight}px` }}
                    >
                        {yAxisLabels.map((label) => (
                            <p key={label}>{label}</p>
                        ))}
                    </div>

                    {data.map((item, i) => (
                        <div key={item.date} className="flex flex-col items-center gap-2">
                            <div
                                className="w-full rounded-md bg-blue-500 hover:bg-blue-600 transition-colors"
                                style={{
                                    height: `${(chartHeight / topLabel) * (item.total / 100)}px`, // Amount is in cents in DB usually? Yes.
                                }}
                            ></div>
                            <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                                {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Recent Activity</h3>
                </div>
            </div>
        </div>
    );
}

const generateYAxis = (data: { total: number }[]) => {
    const yAxisLabels = [];
    const highestRecord = Math.max(...data.map((item) => item.total / 100)); // Convert cents to dollars
    const topLabel = Math.ceil(highestRecord / 1000) * 1000 || 1000;

    for (let i = topLabel; i >= 0; i -= (topLabel / 5)) { // 5 ticks
        yAxisLabels.push(`$${Math.round(i)}`);
    }

    return { yAxisLabels, topLabel };
};
