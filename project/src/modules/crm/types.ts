// Basic types for CRM
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  industry?: string;
  value?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  region?: string;
  totalRevenue?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesData {
  revenue: number;
  target: number;
  growth: number;
  byRegion: {
    [key: string]: {
      achieved: number;
      target: number;
    };
  };
  byIndustry: {
    [key: string]: {
      won: number;
      open: number;
      lost: number;
      growth: number;
    };
  };
}

export interface LeadAnalytics {
  totalLeads: number;
  conversionRate: number;
  byStage: {
    [key in LeadStatus]: number;
  };
  byIndustry: {
    [key: string]: number;
  };
}
