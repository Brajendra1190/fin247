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

function LeadForm({ onSave }: { onSave: (lead: Omit<Lead, 'id'>) => void }) {
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
      <button className="bg-blue-500 text-white px-3 py-1 rounded" type="submit">Add Lead</button>
    </form>
  );
}

function KanbanBoard({ leads, onMove }: { leads: Lead[]; onMove: (id: string, status: Lead['status']) => void }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {STAGES.map(stage => (
        <div key={stage.key} className="min-w-[220px] bg-gray-100 rounded p-2 flex-1">
          <div className="font-bold mb-2">{stage.label}</div>
          {leads.filter(l => l.status === stage.key).map(lead => (
            <div key={lead.id} className="bg-white rounded shadow p-2 mb-2">
              <div className="font-semibold">{lead.name}</div>
              <div className="text-xs text-gray-500">{lead.email}</div>
              <div className="text-xs text-gray-500">{lead.phone}</div>
              <div className="text-xs mt-1">{lead.notes}</div>
              <div className="flex gap-1 mt-2">
                {STAGES.filter(s => s.key !== lead.status).map(s => (
                  <button key={s.key} className="text-xs bg-blue-100 px-2 py-0.5 rounded" onClick={() => onMove(lead.id, s.key as Lead['status'])}>{s.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Leads() {
  const { leads, addLead } = useCRM();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [allLeads, setAllLeads] = useState<Lead[]>(leads);

  const handleAdd = (lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = { ...lead, id: Date.now().toString() };
    addLead(newLead);
    setAllLeads(prev => [...prev, newLead]);
  };
  const handleMove = (id: string, status: Lead['status']) => {
    setAllLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button className={`px-2 py-1 rounded ${view === 'kanban' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('kanban')}>Kanban</button>
        <button className={`px-2 py-1 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('list')}>List</button>
      </div>
      <LeadForm onSave={handleAdd} />
      {view === 'kanban' ? (
        <KanbanBoard leads={allLeads} onMove={handleMove} />
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
            {allLeads.map(lead => (
              <tr key={lead.id}>
                <td className="p-2">{lead.name}</td>
                <td className="p-2">{lead.email}</td>
                <td className="p-2">{lead.phone}</td>
                <td className="p-2">{lead.status}</td>
                <td className="p-2">{lead.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
