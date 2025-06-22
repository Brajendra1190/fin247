import { useState } from 'react';
import Leads from './Leads';
import Opportunities from './Opportunities';
import Contacts from './Contacts';
import Activities from './Activities';
import Reporting from './Reporting';
import { CRMProvider } from './context';

const CRMMenu = [
  { key: 'leads', label: 'Leads' },
  { key: 'opportunities', label: 'Opportunities' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'activities', label: 'Activities' },
  { key: 'reporting', label: 'Reporting' },
];

export default function CRMApp() {
  const [section, setSection] = useState('leads');
  return (
    <CRMProvider>
      <div className="flex min-h-screen">
        <aside className="w-56 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-bold mb-4">CRM</h2>
          <nav className="space-y-2">
            {CRMMenu.map((item) => (
              <button
                key={item.key}
                className={`block w-full text-left px-3 py-2 rounded transition-colors ${section === item.key ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-100 dark:hover:bg-gray-800'}`}
                onClick={() => setSection(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {section === 'leads' && <Leads />}
          {section === 'opportunities' && <Opportunities />}
          {section === 'contacts' && <Contacts />}
          {section === 'activities' && <Activities />}
          {section === 'reporting' && <Reporting />}
        </main>
      </div>
    </CRMProvider>
  );
}
