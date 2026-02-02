/**
 * LifecycleChart - Entity lifecycle timeline chart
 * Shows entity state changes over time
 */

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { EntityLifecycle } from '@/types';
import { format } from 'date-fns';

interface LifecycleChartProps {
  data: EntityLifecycle[];
  isLoading?: boolean;
}

/**
 * Timeline chart showing entity lifecycle progression
 * TODO: Replace with real-time data from API
 */
export const LifecycleChart = ({ data, isLoading }: LifecycleChartProps) => {
  // Transform data for chart display
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      time: format(new Date(item.timestamp), 'HH:mm'),
      displayTime: format(new Date(item.timestamp), 'HH:mm:ss'),
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-card rounded-lg border">
        <div className="text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Entity Lifecycle Timeline</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              label={{
                value: 'Entity Count',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px hsl(0 0% 0% / 0.3)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--primary))' }}
              formatter={(value: number, name: string) => [value, 'Count']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              name="Processed Entities"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['CREATED', 'PROCESSING', 'VALIDATED', 'TRANSFORMED', 'COMPLETED'].map((state, idx) => (
          <span
            key={state}
            className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
          >
            {state}
          </span>
        ))}
      </div>
    </div>
  );
};
