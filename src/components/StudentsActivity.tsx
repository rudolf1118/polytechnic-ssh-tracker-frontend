'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function formatDurationToMinutes(duration: string) {
  const [days, hours, minutes] = duration.split(':').map(Number);
  return days * 24 * 60 + hours * 60 + minutes;
}

function formatDateShort(dateString: string) {
  const dateParts = dateString.split(' ');
  const month = dateParts[1];
  const day = dateParts[2];
  return `${month} ${day}`;
}

function sortActivitiesByDate(data: { date: string }[]) {
  return data.sort((a, b) => {
    const formattedDateA = formatDateShort(a.date);
    const formattedDateB = formatDateShort(b.date);
    return new Date(formattedDateA).getTime() - new Date(formattedDateB).getTime();
  });
}

export default function StudentsActivity({
  data,
}: {
  data: {
    ip: string;
    hostname: string;
    date: string;
    duration: string;
    description: string;
    _id: string;
    createdAt: string;
    modifyAt: string;
  }[];
}) {
  const chartData = data
    .map((entry) => {
      const durationInMinutes = formatDurationToMinutes(entry.duration);
      return {
        date: formatDateShort(entry.date),
        durationInMinutes: durationInMinutes === 0 ? '> 0' : durationInMinutes,
      };
    })
    .sort((a, b) => {
      const durationA = typeof a.durationInMinutes === 'string' ? 0 : a.durationInMinutes;
      const durationB = typeof b.durationInMinutes === 'string' ? 0 : b.durationInMinutes;
      return durationA - durationB;
    });

  const totalMinutes = chartData.reduce((acc, curr) => acc + (typeof curr.durationInMinutes === 'number' ? curr.durationInMinutes : 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl shadow-xl p-6 mb-6">
        <h2 className="text-3xl font-bold mb-2">Your Activity Summary</h2>
        <p className="text-lg">
          Total activity time: <span className="font-semibold">{hours} hours {minutes} minutes</span>
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">Activity by Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fill: '#6B7280' }} />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB',
              }}
              formatter={(value: number) => [`${value} min`, 'Duration']}
            />
            <Bar dataKey="durationInMinutes" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {chartData.some(entry => entry.date === 'Invalid Date') && (
          <p className="text-red-500 text-center mt-4">Some entries have invalid dates.</p>
        )}
      </div>
    </div>
  );
}