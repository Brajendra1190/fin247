import { useCRM } from './context';
import { useMemo } from 'react';
import { Lead } from './types';

function countByStatus(leads: Lead[]): Record<string, number> {
  return leads.reduce((acc: Record<string, number>, l: Lead) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});
}

function PieChart({ data }: { data: { name: string; value: number }[] }) {
  // Placeholder for a real chart library (e.g., recharts, chart.js)
  return (
    <div className="flex gap-2">
      {data.map((d) => (
        <div key={d.name} className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full" style={{ background: '#'+Math.floor(Math.random()*16777215).toString(16) }} />
          <span className="text-xs">{d.name}</span>
          <span className="text-xs font-bold">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Reporting() {
  const { leads, customers } = useCRM();
  const statusCounts = useMemo(() => countByStatus(leads), [leads]);
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value: value as number }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-lg mb-2">Leads by Status</h2>
        <PieChart data={pieData} />
      </div>
      <div>
        <h2 className="font-bold text-lg mb-2">Total Contacts</h2>
        <div className="text-2xl font-semibold">{customers.length}</div>
      </div>
    </div>
  );
}
