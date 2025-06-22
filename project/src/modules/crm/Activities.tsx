import { useState } from 'react';

interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'task';
  subject: string;
  date: string;
  relatedTo?: string;
  status: 'scheduled' | 'done';
}

const ACTIVITY_TYPES = [
  { key: 'call', label: 'Call' },
  { key: 'meeting', label: 'Meeting' },
  { key: 'email', label: 'Email' },
  { key: 'task', label: 'Task' },
];

function ActivityForm({ onSave }: { onSave: (activity: Omit<Activity, 'id'>) => void }) {
  const [form, setForm] = useState<Omit<Activity, 'id'>>({
    type: 'call',
    subject: '',
    date: '',
    relatedTo: '',
    status: 'scheduled',
  });
  return (
    <form
      className="space-y-2 p-2 bg-gray-50 rounded"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
        setForm({ type: 'call', subject: '', date: '', relatedTo: '', status: 'scheduled' });
      }}
    >
      <select className="border p-1 rounded w-full" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Activity['type'] }))}>
        {ACTIVITY_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
      </select>
      <input className="border p-1 rounded w-full" placeholder="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
      <input className="border p-1 rounded w-full" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
      <input className="border p-1 rounded w-full" placeholder="Related To (Lead/Contact)" value={form.relatedTo} onChange={e => setForm(f => ({ ...f, relatedTo: e.target.value }))} />
      <select className="border p-1 rounded w-full" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Activity['status'] }))}>
        <option value="scheduled">Scheduled</option>
        <option value="done">Done</option>
      </select>
      <button className="bg-blue-500 text-white px-3 py-1 rounded" type="submit">Add Activity</button>
    </form>
  );
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const handleAdd = (activity: Omit<Activity, 'id'>) => {
    setActivities(prev => [...prev, { ...activity, id: Date.now().toString() }]);
  };

  return (
    <div className="space-y-4">
      <ActivityForm onSave={handleAdd} />
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Subject</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Related To</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(act => (
            <tr key={act.id}>
              <td className="p-2">{act.type}</td>
              <td className="p-2">{act.subject}</td>
              <td className="p-2">{act.date}</td>
              <td className="p-2">{act.relatedTo}</td>
              <td className="p-2">{act.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
