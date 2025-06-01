import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';

interface Props {
  data: Array<{
    date: string;
    income: number;
    expenses: number;
  }>;
  currency: string;
}

export function CashFlowChart({ data, currency }: Props) {
  const processedData = data.map((item, index) => {
    const cumulative = data
      .slice(0, index + 1)
      .reduce((sum, d) => sum + (d.income - d.expenses), 0);
    
    return {
      date: item.date,
      netFlow: item.income - item.expenses,
      cumulative
    };
  });

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedData}
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
          <ReferenceLine
            y={0}
            stroke="#666"
            strokeDasharray="3 3"
            label={undefined}
            segment={[]}
            ifOverflow="extendDomain"
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.2}
            name="Cumulative Cash Flow"
          />
          <Area
            type="monotone"
            dataKey="netFlow"
            stroke="#34D399"
            fill="#34D399"
            fillOpacity={0.2}
            name="Net Cash Flow"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}