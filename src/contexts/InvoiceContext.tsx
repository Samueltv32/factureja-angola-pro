
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  // Company Info
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyTaxId?: string;
  companyLogo?: string;
  
  // Client Info
  clientName: string;
  clientAddress: string;
  clientPhone?: string;
  clientEmail?: string;
  clientTaxId?: string;
  
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  
  // Items
  items: InvoiceItem[];
  
  // Payment
  paymentMethod: string;
  bankDetails?: string;
  observations?: string;
  
  // Template
  selectedTemplate: 'classic' | 'modern' | 'minimal';
}

interface InvoiceContextType {
  invoiceData: InvoiceData;
  updateInvoiceData: (data: Partial<InvoiceData>) => void;
  addItem: (item: Omit<InvoiceItem, 'id' | 'total'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<InvoiceItem>) => void;
  getTotalAmount: () => number;
  resetInvoice: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const initialInvoiceData: InvoiceData = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyTaxId: '',
  companyLogo: '',
  clientName: '',
  clientAddress: '',
  clientPhone: '',
  clientEmail: '',
  clientTaxId: '',
  invoiceNumber: '',
  invoiceDate: new Date(),
  dueDate: undefined,
  items: [],
  paymentMethod: 'Transferência Bancária',
  bankDetails: '',
  observations: '',
  selectedTemplate: 'classic'
};

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialInvoiceData);

  const updateInvoiceData = (data: Partial<InvoiceData>) => {
    setInvoiceData(prev => ({ ...prev, ...data }));
  };

  const addItem = (item: Omit<InvoiceItem, 'id' | 'total'>) => {
    const newItem: InvoiceItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      total: item.quantity * item.unitPrice
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id: string, updatedItem: Partial<InvoiceItem>) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id 
          ? { 
              ...item, 
              ...updatedItem, 
              total: (updatedItem.quantity ?? item.quantity) * (updatedItem.unitPrice ?? item.unitPrice)
            }
          : item
      )
    }));
  };

  const getTotalAmount = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const resetInvoice = () => {
    setInvoiceData(initialInvoiceData);
  };

  return (
    <InvoiceContext.Provider value={{
      invoiceData,
      updateInvoiceData,
      addItem,
      removeItem,
      updateItem,
      getTotalAmount,
      resetInvoice
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
