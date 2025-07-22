
import React from 'react';
import { InvoiceData } from '@/contexts/InvoiceContext';

interface MinimalTemplateProps {
  data: InvoiceData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const getTotalAmount = () => {
    return data.items.reduce((sum, item) => sum + item.total, 0);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white p-12 text-gray-900 font-poppins" style={{ minHeight: '297mm', lineHeight: '1.6' }}>
      {/* Header */}
      <div className="mb-16">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {data.companyLogo && (
              <div className="mb-8">
                <img 
                  src={data.companyLogo} 
                  alt="Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-light text-gray-900 mb-6">
              {data.companyName}
            </h1>
            <div className="text-sm text-gray-600 space-y-2 font-light">
              <p>{data.companyAddress}</p>
              <p>{data.companyPhone}</p>
              {data.companyEmail && <p>{data.companyEmail}</p>}
              {data.companyTaxId && <p>NIF: {data.companyTaxId}</p>}
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-light text-gray-900 mb-6">FATURA</h2>
            <div className="text-sm text-gray-600 space-y-2 font-light">
              <p>{data.invoiceNumber}</p>
              <p>{formatDate(data.invoiceDate)}</p>
              {data.dueDate && <p>Venc: {formatDate(data.dueDate)}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-16">
        <div className="mb-8">
          <h3 className="text-sm font-light text-gray-500 uppercase tracking-wide mb-4">
            Faturar a
          </h3>
          <div className="font-light">
            <h4 className="text-lg text-gray-900 mb-4">{data.clientName}</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>{data.clientAddress}</p>
              {data.clientPhone && <p>{data.clientPhone}</p>}
              {data.clientEmail && <p>{data.clientEmail}</p>}
              {data.clientTaxId && <p>NIF: {data.clientTaxId}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-16">
        <div className="space-y-6">
          {data.items.map((item, index) => (
            <div key={item.id} className="flex justify-between items-start py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex-1 pr-8">
                <p className="text-base font-light text-gray-900 mb-1">{item.description}</p>
                <p className="text-sm text-gray-500 font-light">
                  {item.quantity} × {item.unitPrice.toLocaleString('pt-AO')} Kz
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-light text-gray-900">
                  {item.total.toLocaleString('pt-AO')} Kz
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <p className="text-lg font-light text-gray-900">Total</p>
            <p className="text-2xl font-light text-gray-900">
              {getTotalAmount().toLocaleString('pt-AO')} Kz
            </p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-16 space-y-8">
        <div>
          <h4 className="text-sm font-light text-gray-500 uppercase tracking-wide mb-4">
            Pagamento
          </h4>
          <p className="text-sm font-light text-gray-700">{data.paymentMethod}</p>
          {data.bankDetails && (
            <div className="mt-4 text-sm font-light text-gray-600">
              <p>{data.bankDetails}</p>
            </div>
          )}
        </div>
        
        {data.observations && (
          <div>
            <h4 className="text-sm font-light text-gray-500 uppercase tracking-wide mb-4">
              Observações
            </h4>
            <p className="text-sm font-light text-gray-600 leading-relaxed">{data.observations}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <div className="text-center text-xs text-gray-400 font-light">
          <p>Fatura gerada digitalmente</p>
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
