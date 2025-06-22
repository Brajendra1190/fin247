import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Placeholder data (replace with real data from your backend)
const mockData = {
  revenueData: {
    current: 107509,
    lastYear: 27952,
    growth: 284.6,
    regionalTargets: {
      'India': { achieved: 82821, target: 150000 },
      'UK': { achieved: 77389, target: 135000 },
      'Canada': { achieved: 58098, target: 125000 },
      'China': { achieved: 39187, target: 120000 }
    }
  },
  leadConversion: [
    { stage: 'Created', value: 2000 },
    { stage: 'Contacted', value: 1600 },
    { stage: 'Qualified', value: 1440 },
    { stage: 'Won', value: 1080 }
  ],
  industryData: [
    { name: 'Finance', won: 62, open: 296, lost: 42, growth: 47.6 },
    { name: 'Retail', won: 206, open: 823, lost: 114, growth: 42.1 },
    { name: 'Insurance', won: 230, open: 617, lost: 104, growth: 198.7 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function RevenueCard({ value, growth, lastYear }: { value: number; growth: number; lastYear: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm font-medium">REVENUE THIS MONTH</h3>
      <div className="mt-2">
        <span className="text-2xl font-bold">${value.toLocaleString()}</span>
        <span className={`ml-2 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {growth >= 0 ? '+' : ''}{growth}%
        </span>
      </div>
      <div className="text-sm text-gray-400 mt-1">
        Last year: ${lastYear.toLocaleString()}
      </div>
    </div>
  );
}

function RegionalTargets({ data }: { data: typeof mockData.revenueData.regionalTargets }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-700 font-semibold mb-4">Q3 - REVENUE TARGET</h3>
      <div className="space-y-4">
        {Object.entries(data).map(([region, { achieved, target }]) => (
          <div key={region}>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{region}</span>
              <span>Target: ${target.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(100, (achieved / target) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Achieved: ${achieved.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndustryComparator({ data }: { data: typeof mockData.industryData }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-700 font-semibold mb-4">INDUSTRY-WISE COMPARATOR</h3>
      <table className="w-full text-sm">
        <thead className="text-gray-500">
          <tr>
            <th className="text-left pb-2">Industry</th>
            <th className="text-right pb-2">Won</th>
            <th className="text-right pb-2">Open</th>
            <th className="text-right pb-2">Lost</th>
            <th className="text-right pb-2">Growth</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.name} className="border-t">
              <td className="py-2">{row.name}</td>
              <td className="text-right py-2">{row.won}</td>
              <td className="text-right py-2">{row.open}</td>
              <td className="text-right py-2">{row.lost}</td>
              <td className="text-right py-2 text-green-500">+{row.growth}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadConversionChart({ data }: { data: typeof mockData.leadConversion }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-700 font-semibold mb-4">LEAD CONVERSION ANALYTICS</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function CRMDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-2xl font-bold text-gray-800 mb-6">
        Sales Analytics Dashboard
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevenueCard
          value={mockData.revenueData.current}
          growth={mockData.revenueData.growth}
          lastYear={mockData.revenueData.lastYear}
        />
        
        <RegionalTargets data={mockData.revenueData.regionalTargets} />
        
        <IndustryComparator data={mockData.industryData} />
        
        <div className="md:col-span-2">
          <LeadConversionChart data={mockData.leadConversion} />
        </div>
      </div>
    </div>
  );
}
