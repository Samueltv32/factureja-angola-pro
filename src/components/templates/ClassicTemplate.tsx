
import React from 'react';
import { InvoiceData } from '@/contexts/InvoiceContext';

interface ClassicTemplateProps {
  data: InvoiceData;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
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
    <div className="bg-white p-8 text-gray-900 font-inter" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="border-b-2 border-slate-700 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {data.companyLogo && (
              <div className="mb-4">
                <img 
                  src={data.companyLogo} 
                  alt="Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold text-slate-700 mb-2">
              {data.companyName}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{data.companyAddress}</p>
              <div className="flex flex-wrap gap-4">
                <span>Tel: {data.companyPhone}</span>
                {data.companyEmail && <span>Email: {data.companyEmail}</span>}
                {data.companyTaxId && <span>NIF: {data.companyTaxId}</span>}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-4xl font-bold text-slate-700 mb-2">FATURA</h2>
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">Número:</span> {data.invoiceNumber}</p>
              <p><span className="font-semibold">Data:</span> {formatDate(data.invoiceDate)}</p>
              {data.dueDate && (
                <p><span className="font-semibold">Vencimento:</span> {formatDate(data.dueDate)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b border-gray-300 pb-1">
          FATURAR A:
        </h3>
        <div className="bg-gray-50 p-4 rounded border">
          <h4 className="font-semibold text-lg text-gray-900 mb-2">{data.clientName}</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>{data.clientAddress}</p>
            <div className="flex flex-wrap gap-4">
              {data.clientPhone && <span>Tel: {data.clientPhone}</span>}
              {data.clientEmail && <span>Email: {data.clientEmail}</span>}
              {data.clientTaxId && <span>NIF: {data.clientTaxId}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="border border-gray-300 p-3 text-left font-semibold">Descrição</th>
              <th className="border border-gray-300 p-3 text-center font-semibold w-20">Qtd.</th>
              <th className="border border-gray-300 p-3 text-right font-semibold w-32">Preço Unit.</th>
              <th className="border border-gray-300 p-3 text-right font-semibold w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3">{item.description}</td>
                <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-3 text-right">
                  {item.unitPrice.toLocaleString('pt-AO')} Kz
                </td>
                <td className="border border-gray-300 p-3 text-right font-semibold">
                  {item.total.toLocaleString('pt-AO')} Kz
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mt-4">
          <div className="bg-slate-700 text-white p-4 rounded">
            <div className="text-right">
              <p className="text-lg font-bold">
                TOTAL: {getTotalAmount().toLocaleString('pt-AO')} Kz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 border-b border-gray-300 pb-1">
            FORMA DE PAGAMENTO:
          </h4>
          <p className="text-sm">{data.paymentMethod}</p>
          {data.bankDetails && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">Dados Bancários:</p>
              <p>{data.bankDetails}</p>
            </div>
          )}
        </div>
        
        {data.observations && (
          <div>
            <h4 className="font-semibold text-slate-700 mb-2 border-b border-gray-300 pb-1">
              OBSERVAÇÕES:
            </h4>
            <p className="text-sm text-gray-600">{data.observations}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 pt-4 mt-auto">
        <div className="text-center text-xs text-gray-500">
          <p>Esta fatura foi gerada digitalmente pelo FactureJá</p>
          <p>Emita suas faturas profissionais em minutos - www.factureja.ao</p>
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
