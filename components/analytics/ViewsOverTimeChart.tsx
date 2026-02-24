"use client";

interface ViewsChartProps {
  data: Array<{ date: string; views: number }>;
}

export default function ViewsOverTimeChart({ data }: ViewsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const maxViews = Math.max(...data.map(d => d.views), 1);
  const chartHeight = 200;
  const chartWidth = 100;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="relative" style={{ height: chartHeight + 40 }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-xs text-gray-500 w-8">
            <span>{maxViews}</span>
            <span>{Math.floor(maxViews / 2)}</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-10 relative" style={{ height: chartHeight}}>
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="border-t border-gray-100" />
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between gap-1">
              {data.map((item, index) => {
                const height = maxViews > 0 ? (item.views / maxViews) * 100 : 0;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group"
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {item.views} {item.views === 1 ? 'view' : 'views'}
                      <div className="text-gray-400 text-[10px]">{new Date(item.date).toLocaleDateString()}</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="ml-10 mt-2 flex justify-between text-xs text-gray-500">
            <span>{new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>{new Date(data[Math.floor(data.length / 2)].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>{new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
