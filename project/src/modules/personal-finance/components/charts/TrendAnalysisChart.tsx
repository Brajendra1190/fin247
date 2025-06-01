import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';

interface Props {
  data: Array<{
    date: string;
    income: number;
    expenses: number;
  }>;
  timeframe: 'day' | 'week' | 'month' | 'year';
  currency: string;
}

export function TrendAnalysisChart({ data, timeframe, currency }: Props) {
  const calculateMovingAverage = (data: any[], period: number) => {
    return data.map((item, index) => {
      const start = Math.max(0, index - period + 1);
      const subset = data.slice(start, index + 1);
      const avgExpenses = subset.reduce((sum, d) => sum + d.expenses, 0) / subset.length;
      const avgIncome = subset.reduce((sum, d) => sum + d.income, 0) / subset.length;
      
      return {
        ...item,
        avgExpenses,
        avgIncome
      };
    });
  };

  const movingAveragePeriod = timeframe === 'day' ? 7 : 3;
  const chartData = calculateMovingAverage(data, movingAveragePeriod);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, currency)}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#F87171"
            dot={false}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="avgExpenses"
            stroke="#DC2626"
            strokeDasharray="5 5"
            dot={false}
            name="Expense Trend"
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#34D399"
            dot={false}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="avgIncome"
            stroke="#059669"
            strokeDasharray="5 5"
            dot={false}
            name="Income Trend"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}