import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';

interface Props {
  budgets: Array<{
    id: string;
    category: string;
    amount: number;
    spent: number;
    remaining: number;
    progress: number;
  }>;
  currency: string;
}

export function BudgetOverview({ budgets, currency }: Props) {
  const data = budgets.map(budget => ({
    name: budget.category,
    spent: budget.spent,
    remaining: budget.remaining,
    limit: budget.amount
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, currency)}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend />
          <Bar dataKey="spent" fill="#F87171" name="Spent" />
          <Bar dataKey="remaining" fill="#34D399" name="Remaining" stackId="a" />
          {data.map((entry, index) => (
            <ReferenceLine
              key={index}
              y={entry.limit}
              stroke="#4B5563"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
              label={undefined}
              segment={[]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}