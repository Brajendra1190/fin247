import { useState } from 'react';
import { useCRM } from './context';
import { Lead } from './types';

const STAGES = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  status: 'new' as const,
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function OpportunityForm({ onSave }: { onSave: (opportunity: Omit<Lead, 'id'>) => void }) {
  const [form, setForm] = useState<Omit<Lead, 'id'>>(initialForm);
  return (
    <form
      className="space-y-2 p-2 bg-gray-50 rounded"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
        setForm({ ...initialForm, createdAt: new Date(), updatedAt: new Date() });
      }}
    >
      <input className="border p-1 rounded w-full" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      <input className="border p-1 rounded w-full" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      <input className="border p-1 rounded w-full" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      <select className="border p-1 rounded w-full" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Lead['status'] }))}>
        {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
      </select>
      <textarea className="border p-1 rounded w-full" placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      <button className="bg-blue-500 text-white px-3 py-1 rounded" type="submit">Add Opportunity</button>
    </form>
  );
}

function KanbanBoard({ opportunities, onMove }: { opportunities: Lead[]; onMove: (id: string, status: Lead['status']) => void }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {STAGES.map(stage => (
        <div key={stage.key} className="min-w-[220px] bg-gray-100 rounded p-2 flex-1">
          <div className="font-bold mb-2">{stage.label}</div>
          {opportunities.filter(l => l.status === stage.key).map(opp => (
            <div key={opp.id} className="bg-white rounded shadow p-2 mb-2">
              <div className="font-semibold">{opp.name}</div>
              <div className="text-xs text-gray-500">{opp.email}</div>
              <div className="text-xs text-gray-500">{opp.phone}</div>
              <div className="text-xs mt-1">{opp.notes}</div>
              <div className="flex gap-1 mt-2">
                {STAGES.filter(s => s.key !== opp.status).map(s => (
                  <button key={s.key} className="text-xs bg-blue-100 px-2 py-0.5 rounded" onClick={() => onMove(opp.id, s.key as Lead['status'])}>{s.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Opportunities() {
  const { leads, addLead } = useCRM();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [allOpportunities, setAllOpportunities] = useState<Lead[]>(leads);

  const handleAdd = (opportunity: Omit<Lead, 'id'>) => {
    const newOpp: Lead = { ...opportunity, id: Date.now().toString() };
    addLead(newOpp);
    setAllOpportunities(prev => [...prev, newOpp]);
  };
  const handleMove = (id: string, status: Lead['status']) => {
    setAllOpportunities(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button className={`px-2 py-1 rounded ${view === 'kanban' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('kanban')}>Kanban</button>
        <button className={`px-2 py-1 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('list')}>List</button>
      </div>
      <OpportunityForm onSave={handleAdd} />
      {view === 'kanban' ? (
        <KanbanBoard opportunities={allOpportunities} onMove={handleMove} />
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {allOpportunities.map(opp => (
              <tr key={opp.id}>
                <td className="p-2">{opp.name}</td>
                <td className="p-2">{opp.email}</td>
                <td className="p-2">{opp.phone}</td>
                <td className="p-2">{opp.status}</td>
                <td className="p-2">{opp.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
