import { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, Customer } from './types';

interface CRMContextProps {
  leads: Lead[];
  customers: Customer[];
  addLead: (lead: Lead) => void;
  addCustomer: (customer: Customer) => void;
}

const CRMContext = createContext<CRMContextProps | undefined>(undefined);

export const CRMProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const addLead = (lead: Lead) => setLeads((prev) => [...prev, lead]);
  const addCustomer = (customer: Customer) => setCustomers((prev) => [...prev, customer]);

  return (
    <CRMContext.Provider value={{ leads, customers, addLead, addCustomer }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within a CRMProvider');
  return context;
};
