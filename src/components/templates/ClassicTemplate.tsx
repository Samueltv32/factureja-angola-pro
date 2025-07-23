
import React from 'react';
import { InvoiceData } from '@/contexts/InvoiceContext';

interface ClassicTemplateProps {
  data: InvoiceData & {
    currentPage?: number;
    totalPages?: number;
    hasMultiplePages?: boolean;
  };
  className?: string;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data, className = '' }) => {
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
    <div className={`a4-content bg-white text-gray-900 font-inter ${className}`}>
      {/* Header */}
      <div className="border-b-2 border-slate-700 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {data.companyLogo && (
              <div className="mb-3">
                <img 
                  src={data.companyLogo} 
                  alt="Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold text-slate-700 mb-1">
              {data.companyName}
            </h1>
            <div className="text-xs text-gray-600 space-y-1">
              <p>{data.companyAddress}</p>
              <div className="flex flex-wrap gap-3">
                <span>Tel: {data.companyPhone}</span>
                {data.companyEmail && <span>Email: {data.companyEmail}</span>}
                {data.companyTaxId && <span>NIF: {data.companyTaxId}</span>}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-bold text-slate-700 mb-1">FATURA</h2>
            <div className="text-xs space-y-1">
              <p><span className="font-semibold">Número:</span> {data.invoiceNumber}</p>
              <p><span className="font-semibold">Data:</span> {formatDate(data.invoiceDate)}</p>
              {data.dueDate && (
                <p><span className="font-semibold">Vencimento:</span> {formatDate(data.dueDate)}</p>
              )}
              {data.hasMultiplePages && (
                <p className="text-gray-500">
                  <span className="font-semibold">Página:</span> {data.currentPage} de {data.totalPages}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client Information - Only on first page */}
      {data.currentPage === 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 border-b border-gray-300 pb-1">
            FATURAR A:
          </h3>
          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="font-semibold text-base text-gray-900 mb-1">{data.clientName}</h4>
            <div className="text-xs text-gray-700 space-y-1">
              <p>{data.clientAddress}</p>
              <div className="flex flex-wrap gap-3">
                {data.clientPhone && <span>Tel: {data.clientPhone}</span>}
                {data.clientEmail && <span>Email: {data.clientEmail}</span>}
                {data.clientTaxId && <span>NIF: {data.clientTaxId}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="flex-1 mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="border border-gray-300 p-2 text-left font-semibold text-xs">Descrição</th>
              <th className="border border-gray-300 p-2 text-center font-semibold text-xs w-12">Qtd.</th>
              <th className="border border-gray-300 p-2 text-right font-semibold text-xs w-20">Preço Unit.</th>
              <th className="border border-gray-300 p-2 text-right font-semibold text-xs w-20">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-2 text-xs">{item.description}</td>
                <td className="border border-gray-300 p-2 text-center text-xs">{item.quantity}</td>
                <td className="border border-gray-300 p-2 text-right text-xs">
                  {item.unitPrice.toLocaleString('pt-AO')} Kz
                </td>
                <td className="border border-gray-300 p-2 text-right font-semibold text-xs">
                  {item.total.toLocaleString('pt-AO')} Kz
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total - Only on last page */}
        {showTotal && (
          <div className="flex justify-end mt-3">
            <div className="bg-slate-700 text-white p-3 rounded">
              <div className="text-right">
                <p className="text-sm font-bold">
                  TOTAL: {getTotalAmount().toLocaleString('pt-AO')} Kz
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Information - Only on last page */}
      {showTotal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-slate-700 mb-1 border-b border-gray-300 pb-1 text-xs">
              FORMA DE PAGAMENTO:
            </h4>
            <p className="text-xs">{data.paymentMethod}</p>
            {data.bankDetails && (
              <div className="mt-1 text-xs text-gray-600">
                <p className="font-medium">Dados Bancários:</p>
                <p>{data.bankDetails}</p>
              </div>
            )}
          </div>
          
          {data.observations && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-1 border-b border-gray-300 pb-1 text-xs">
                OBSERVAÇÕES:
              </h4>
              <p className="text-xs text-gray-600">{data.observations}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-300 pt-2 mt-auto">
        <div className="text-center text-xs text-gray-500">
          <p>Esta fatura foi gerada digitalmente pelo FactureJá</p>
          <p>Emita suas faturas profissionais em minutos - www.factureja.ao</p>
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
