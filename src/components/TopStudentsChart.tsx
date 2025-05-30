'use client';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'wb';

interface TopStudentsChartProps {
  data: {
    username: string;
    score: number;
    fullName: string;
    group: string;
    totalDuration: string;
    totalSessions: number;
    uniqueIPs: number;
    lastOnline: string;
    Top: number;
  }[];
  onBarClick: (data: any) => void;
}

export default function TopStudentsChart({
  data,
  onBarClick,
}: TopStudentsChartProps) {
  const router = useRouter();

  data.forEach((item, index) => {
    item.Top = index + 1;
  })
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
              padding: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}
            formatter={(value, name) => [
              <span key="value" className="font-semibold text-blue-300">{value}</span>, 
              <span key="name" className="text-gray-300">{name}</span>
            ]}
            labelFormatter={(label) => {
              const user = data.find((u) => u.username === label);
              return (
                <span className="font-medium mb-1 border-b border-gray-600 pb-1 block">
                  <span className="text-blue-400">#{user?.Top}</span>
                  <span className="mx-1">·</span>
                  <span className="text-white">{user?.fullName}</span>
                  <span className="block text-xs text-gray-400 mt-1">
                    @{user?.username}
                    <span className="mx-1">·</span>
                    {user?.totalDuration} total
                  </span>
                </span>
              );
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.2)' }}
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