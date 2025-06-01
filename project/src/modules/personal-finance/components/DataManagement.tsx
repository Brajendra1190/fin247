import React from 'react';
import { Download, Upload, Save } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

function DataManagement() {
  const { state, dispatch } = useTransactions();

  const exportData = () => {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: state
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal-finance-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);
        
        // Validate imported data structure
        if (!imported.data || !imported.version) {
          throw new Error('Invalid backup file format');
        }

        // Load the imported data
        dispatch({ type: 'LOAD_STATE', payload: imported.data });
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Backup Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export your financial data for safekeeping
            </p>
          </div>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Restore Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Import previously exported data
            </p>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
            <Upload className="h-4 w-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg">
          <h3 className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            <Save className="h-4 w-4" />
            Automatic Saving
          </h3>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Your data is automatically saved in your browser's local storage. For long-term backup, 
            please use the export feature regularly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DataManagement;