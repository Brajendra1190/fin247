import { useState } from 'react';
import { useCRM } from './context';
import { Customer } from './types';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function ContactForm({ onSave }: { onSave: (contact: Omit<Customer, 'id'>) => void }) {
  const [form, setForm] = useState<Omit<Customer, 'id'>>(initialForm);
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
      <input className="border p-1 rounded w-full" placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
      <textarea className="border p-1 rounded w-full" placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      <button className="bg-blue-500 text-white px-3 py-1 rounded" type="submit">Add Contact</button>
    </form>
  );
}

export default function Contacts() {
  const { customers, addCustomer } = useCRM();
  const [allContacts, setAllContacts] = useState(customers);

  const handleAdd = (contact: Omit<Customer, 'id'>) => {
    const newContact: Customer = { ...contact, id: Date.now().toString() };
    addCustomer(newContact);
    setAllContacts(prev => [...prev, newContact]);
  };

  return (
    <div className="space-y-4">
      <ContactForm onSave={handleAdd} />
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Company</th>
            <th className="p-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {allContacts.map(contact => (
            <tr key={contact.id}>
              <td className="p-2">{contact.name}</td>
              <td className="p-2">{contact.email}</td>
              <td className="p-2">{contact.phone}</td>
              <td className="p-2">{contact.company}</td>
              <td className="p-2">{contact.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
