
import React from 'react';
import { InvoiceData } from '@/contexts/InvoiceContext';
import { Phone, Mail, MapPin } from 'lucide-react';

interface ModernTemplateProps {
  data: InvoiceData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
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
    <div className="bg-white text-gray-900 font-inter" style={{ minHeight: '297mm' }}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-teal-500 to-purple-500 text-white p-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {data.companyLogo && (
              <div className="mb-4">
                <img 
                  src={data.companyLogo} 
                  alt="Logo" 
                  className="h-16 w-auto object-contain filter brightness-0 invert"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold mb-2">{data.companyName}</h1>
            <div className="flex items-start space-x-6 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{data.companyAddress}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-4xl font-light mb-4">FATURA</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-sm">
              <p className="mb-1"># {data.invoiceNumber}</p>
              <p>{formatDate(data.invoiceDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-4 h-4 bg-teal-500 rounded-full mr-2"></div>
              De:
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-teal-500" />
                <span>{data.companyPhone}</span>
              </div>
              {data.companyEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-teal-500" />
                  <span>{data.companyEmail}</span>
                </div>
              )}
              {data.companyTaxId && (
                <div className="text-gray-600">
                  <span className="font-medium">NIF:</span> {data.companyTaxId}
                </div>
              )}
            </div>
          </div>

          {/* Client Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
              Para:
            </h3>
            <div className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-purple-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">{data.clientName}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span>{data.clientAddress}</span>
                </div>
                {data.clientPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-purple-500" />
                    <span>{data.clientPhone}</span>
                  </div>
                )}
                {data.clientEmail && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-purple-500" />
                    <span>{data.clientEmail}</span>
                  </div>
                )}
                {data.clientTaxId && (
                  <div>
                    <span className="font-medium">NIF:</span> {data.clientTaxId}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div className="overflow-hidden rounded-lg shadow-sm border">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-teal-500 to-purple-500 text-white">
                  <th className="p-4 text-left font-medium">Descrição</th>
                  <th className="p-4 text-center font-medium w-20">Qtd.</th>
                  <th className="p-4 text-right font-medium w-32">Preço Unit.</th>
                  <th className="p-4 text-right font-medium w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-teal-50/50 transition-colors`}>
                    <td className="p-4 border-b border-gray-100">{item.description}</td>
                    <td className="p-4 text-center border-b border-gray-100">{item.quantity}</td>
                    <td className="p-4 text-right border-b border-gray-100">
                      {item.unitPrice.toLocaleString('pt-AO')} Kz
                    </td>
                    <td className="p-4 text-right font-semibold border-b border-gray-100">
                      {item.total.toLocaleString('pt-AO')} Kz
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end mt-6">
            <div className="bg-gradient-to-r from-teal-500 to-purple-500 text-white p-6 rounded-lg shadow-lg">
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Total da Fatura</p>
                <p className="text-2xl font-bold">
                  {getTotalAmount().toLocaleString('pt-AO')} Kz
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h4 className="font-semibold text-teal-800 mb-3 flex items-center">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              Forma de Pagamento
            </h4>
            <p className="text-sm text-teal-700 mb-3">{data.paymentMethod}</p>
            {data.bankDetails && (
              <div className="text-sm text-teal-600">
                <p className="font-medium mb-1">Dados Bancários:</p>
                <p>{data.bankDetails}</p>
              </div>
            )}
          </div>
          
          {data.observations && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Observações
              </h4>
              <p className="text-sm text-purple-700">{data.observations}</p>
            </div>
          )}
        </div>

        {/* QR Code placeholder and Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              <p>Gerado digitalmente pelo FactureJá</p>
              <p>www.factureja.ao</p>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">QR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
