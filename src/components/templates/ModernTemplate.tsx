
import React from 'react';
import { InvoiceData } from '@/contexts/InvoiceContext';
import { Phone, Mail, MapPin, Building2 } from 'lucide-react';

interface ModernTemplateProps {
  data: InvoiceData & {
    currentPage?: number;
    totalPages?: number;
    hasMultiplePages?: boolean;
  };
  className?: string;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, className = '' }) => {
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
    <div className={`a4-content bg-white text-sophisticated-gray-dark font-montserrat ${className}`}>
      {/* Elegant Header */}
      <div className="bg-gradient-to-r from-sophisticated-navy to-sophisticated-navy-dark text-white px-4 py-4 mb-6 -mx-4 -mt-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {data.companyLogo && (
              <div className="mb-2">
                <img 
                  src={data.companyLogo} 
                  alt="Logo" 
                  className="h-10 w-auto object-contain filter brightness-0 invert"
                />
              </div>
            )}
            <h1 className="text-xl font-bold mb-2">{data.companyName}</h1>
            <div className="flex items-center space-x-4 text-xs opacity-90">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{data.companyAddress}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-2xl font-light mb-2 tracking-wide">FATURA</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-xs">
              <p className="mb-1 font-medium"># {data.invoiceNumber}</p>
              <p>{formatDate(data.invoiceDate)}</p>
              {data.hasMultiplePages && (
                <p className="text-white/80 mt-1">
                  Página {data.currentPage} de {data.totalPages}
                </p>
              )}
              {/* Cliente compacto para páginas múltiplas */}
              {data.hasMultiplePages && data.currentPage > 1 && data.clientName && (
                <div className="border-t border-white/20 pt-1 mt-1">
                  <p className="text-white/90 font-medium">
                    Cliente: {data.clientName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client Information - Only on first page */}
      {data.currentPage === 1 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Company Details */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-3">
              <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                Dados da Empresa
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{data.companyPhone}</span>
                </div>
                {data.companyEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 break-all">{data.companyEmail}</span>
                  </div>
                )}
                {data.companyTaxId && (
                  <div className="text-gray-600">
                    <span className="font-medium text-blue-800">NIF:</span> {data.companyTaxId}
                  </div>
                )}
              </div>
            </div>

            {/* Client Details */}
            <div className="bg-gray-50 border-l-4 border-gray-600 rounded-r-lg p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <div className="w-4 h-4 bg-gray-600 rounded-full mr-1 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                Faturado Para
              </h3>
              <div>
                <h4 className="font-bold text-sm text-gray-800 mb-2">{data.clientName}</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-3 w-3 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>{data.clientAddress}</span>
                  </div>
                  {data.clientPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-gray-600 flex-shrink-0" />
                      <span>{data.clientPhone}</span>
                    </div>
                  )}
                  {data.clientEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-gray-600 flex-shrink-0" />
                      <span className="break-all">{data.clientEmail}</span>
                    </div>
                  )}
                  {data.clientTaxId && (
                    <div>
                      <span className="font-medium text-gray-800">NIF:</span> {data.clientTaxId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="flex-1 flex flex-col mb-4">
        <div className="overflow-hidden rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
          <table className="w-full flex-1">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <th className="p-2 text-left font-medium text-xs">Descrição</th>
                <th className="p-2 text-center font-medium text-xs w-12">Qtd.</th>
                <th className="p-2 text-right font-medium text-xs w-20">Preço Unit.</th>
                <th className="p-2 text-right font-medium text-xs w-20">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'} hover:bg-blue-50 transition-colors`}>
                  <td className="p-2 border-b border-gray-100 font-medium text-gray-800 text-xs">{item.description}</td>
                  <td className="p-2 text-center border-b border-gray-100 text-gray-600 text-xs">{item.quantity}</td>
                  <td className="p-2 text-right border-b border-gray-100 text-gray-600 text-xs">
                    {item.unitPrice.toLocaleString('pt-AO')} Kz
                  </td>
                  <td className="p-2 text-right font-bold border-b border-gray-100 text-blue-800 text-xs">
                    {item.total.toLocaleString('pt-AO')} Kz
                  </td>
                </tr>
              ))}
              {/* Add empty rows to fill space when there are few items */}
              {data.items.length < 18 && Array.from({ length: 18 - data.items.length }).map((_, index) => (
                <tr key={`empty-${index}`} className={(data.items.length + index) % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                  <td className="p-2 border-b border-gray-100 text-xs">&nbsp;</td>
                  <td className="p-2 border-b border-gray-100 text-xs">&nbsp;</td>
                  <td className="p-2 border-b border-gray-100 text-xs">&nbsp;</td>
                  <td className="p-2 border-b border-gray-100 text-xs">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total - Only on last page */}
        {showTotal && (
          <div className="flex justify-end mt-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 rounded-lg shadow-lg min-w-[150px]">
              <div className="text-right">
                <p className="text-xs opacity-90 mb-1">Total da Fatura</p>
                <p className="text-lg font-bold">
                  {getTotalAmount().toLocaleString('pt-AO')} Kz
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment & Notes - Only on last page */}
      {showTotal && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center text-xs">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1"></div>
              Forma de Pagamento
            </h4>
            <p className="text-xs text-gray-800 mb-2 font-medium">{data.paymentMethod}</p>
            {data.bankDetails && (
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1 text-gray-800">Dados Bancários:</p>
                <p>{data.bankDetails}</p>
              </div>
            )}
          </div>
          
          {data.observations && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-xs">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-1"></div>
                Observações
              </h4>
              <p className="text-xs text-gray-600">{data.observations}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 pt-3 mt-auto">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p className="font-medium">Gerado digitalmente pelo FactureJá</p>
            <p className="mt-1">www.factureja.netlify.app</p>
          </div>
          
          {/* QR Code Placeholder */}
          <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <span className="text-xs text-gray-400 font-medium">QR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
