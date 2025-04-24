'use client';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function TopStudentsChart({
  data,
}: {
  data: {
    username: string;
    score: number;
    fullName: string;
    group: string;
    totalDuration: string;
    totalSessions: number;
    uniqueIPs: number;
    lastOnline: string;
  }[];
}) {
  const router = useRouter();
  return (
    <div className="w-full h-96 bg-white dark:bg-gray-900 p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Top Students</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload[0]) {
              const clickedData = data.activePayload[0].payload;
              router.push(`/profile/${clickedData.studentId}`);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="username"
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <YAxis
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F9FAFB',
            }}
            formatter={(value, name) => [`${value}`, name]}
            labelFormatter={(label) => {
              const user = data.find((u) => u.username === label);
              return `${user?.fullName} (${user?.username}) (${user?.totalDuration})`;
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              color: '#E5E7EB',
            }}
          />
          <Bar
            dataKey="score"
            fill="#3B82F6"
            name="Score"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}