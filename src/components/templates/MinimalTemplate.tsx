
import React from 'react';
import { InvoiceData } from '@/contexts/InvoiceContext';

interface MinimalTemplateProps {
  data: InvoiceData & {
    currentPage?: number;
    totalPages?: number;
    hasMultiplePages?: boolean;
  };
  className?: string;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data, className = '' }) => {
  const getTotalAmount = () => {
    // For paginated view, calculate total from all items in original data
    const allItems = data.items || [];
    return allItems.reduce((sum, item) => sum + item.total, 0);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isLastPage = data.currentPage === data.totalPages;
  const showTotal = !data.hasMultiplePages || isLastPage;

  return (
    <div className={`a4-content bg-white text-gray-900 font-poppins ${className}`} style={{ lineHeight: '1.6' }}>
      {/* Header */}
      <div className="mb-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {data.companyLogo && (
              <div className="mb-4">
                <img 
                  src={data.companyLogo} 
                  alt="Logo" 
                  className="h-8 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-xl font-light text-gray-900 mb-3">
              {data.companyName}
            </h1>
            <div className="text-xs text-gray-600 space-y-1 font-light">
              <p>{data.companyAddress}</p>
              <p>{data.companyPhone}</p>
              {data.companyEmail && <p>{data.companyEmail}</p>}
              {data.companyTaxId && <p>NIF: {data.companyTaxId}</p>}
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-2xl font-light text-gray-900 mb-3">FATURA</h2>
            <div className="text-xs text-gray-600 space-y-1 font-light">
              <p>{data.invoiceNumber}</p>
              <p>{formatDate(data.invoiceDate)}</p>
              {data.dueDate && <p>Venc: {formatDate(data.dueDate)}</p>}
              {data.hasMultiplePages && (
                <p className="text-gray-500">
                  Página {data.currentPage} de {data.totalPages}
                </p>
              )}
              {/* Cliente compacto para páginas múltiplas */}
              {data.hasMultiplePages && data.currentPage > 1 && data.clientName && (
                <div className="border-t border-gray-300 pt-1 mt-1">
                  <p className="text-gray-700 font-medium">
                    Cliente: {data.clientName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client Information - Always show */}
      <div className="mb-10">
        <div className="mb-4">
          <h3 className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
            Faturar a
          </h3>
          <div className="font-light">
            <h4 className="text-base text-gray-900 mb-2">{data.clientName}</h4>
            {data.currentPage === 1 ? (
              <div className="text-xs text-gray-600 space-y-1">
                <p>{data.clientAddress}</p>
                {data.clientPhone && <p>{data.clientPhone}</p>}
                {data.clientEmail && <p>{data.clientEmail}</p>}
                {data.clientTaxId && <p>NIF: {data.clientTaxId}</p>}
              </div>
            ) : (
              <div className="text-xs text-gray-600">
                {data.clientAddress}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="items-area mb-10">
        <div className="space-y-3 min-h-[300px]">
          {data.items.map((item, index) => (
            <div key={item.id} className="flex justify-between items-start py-3 border-b border-gray-100">
              <div className="flex-1 pr-4">
                <p className="text-sm font-light text-gray-900 mb-1">{item.description}</p>
                <p className="text-xs text-gray-500 font-light">
                  {item.quantity} × {item.unitPrice.toLocaleString('pt-AO')} Kz
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-light text-gray-900">
                  {item.total.toLocaleString('pt-AO')} Kz
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total - Only on last page */}
        {showTotal && (
          <div className="mt-8 pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <p className="text-base font-light text-gray-900">Total</p>
              <p className="text-xl font-light text-gray-900">
                {getTotalAmount().toLocaleString('pt-AO')} Kz
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Information - Only on last page */}
      {showTotal && (
        <div className="mb-10 space-y-4">
          <div>
            <h4 className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
              Pagamento
            </h4>
            <p className="text-xs font-light text-gray-700">{data.paymentMethod}</p>
            {data.bankDetails && (
              <div className="mt-2 text-xs font-light text-gray-600">
                <p>{data.bankDetails}</p>
              </div>
            )}
          </div>
          
          {data.observations && (
            <div>
              <h4 className="text-xs font-light text-gray-500 uppercase tracking-wide mb-2">
                Observações
              </h4>
              <p className="text-xs font-light text-gray-600 leading-relaxed">{data.observations}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="invoice-footer pt-4">
        <div className="text-center text-xs text-gray-400 font-light">
          <p>Fatura gerada digitalmente</p>
          {data.companyTaxId && (
            <p className="mt-1">NIF: {data.companyTaxId} • {data.companyPhone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
