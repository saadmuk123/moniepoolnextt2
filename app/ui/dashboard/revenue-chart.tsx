'use client';

// Basic chart to show contribution growth over time
import { lusitana } from '@/app/ui/fonts';
import { CalendarIcon } from '@heroicons/react/24/outline';

// Note: For a real chart, I'd use Recharts or similar. 
// For now, I'll build a custom simple bar chart using Tailwind to avoid new dependencies.

export default function RevenueChart({
  contributions,
}: {
  contributions: { amount: number; date: string }[];
}) {
  const chartHeight = 350;

  // Aggregate contributions by month
  // Or just list latest 12 entries

  // For simplicity: Show last 12 contribution instances.
  const data = contributions.slice(-12);

  if (!data || data.length === 0) {
    return (
      <div className="w-full md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Contributions
        </h2>
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-center h-[350px] text-gray-500">
            Start contributing to see your growth!
          </div>
        </div>
      </div>
    );
  }

  const { yAxisLabels, topLabel } = generateYAxis(data);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Contributions History
      </h2>
      <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4 dark:bg-gray-900">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {data.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300 dark:bg-blue-400"
                style={{
                  height: `${(chartHeight / topLabel) * (item.amount / 100)}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {/* {month} */}
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="ml-2 text-sm text-gray-500 dark:text-gray-400">Last 12 Contributions</h3>
        </div>
      </div>
    </div>
  );
}

const generateYAxis = (revenue: { amount: number }[]) => {
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.amount / 100));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000 || 1000; // Default to 1000 if 0

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}k`);
  }

  return { yAxisLabels, topLabel };
};
