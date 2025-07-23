
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

      {/* Company and Client Details - Always show */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Company Details - Show all on first page, minimal on others */}
        <div className="bg-sophisticated-beige-light border-l-4 border-sophisticated-navy rounded-r-lg p-3">
          <h3 className="text-sm font-semibold text-sophisticated-navy mb-2 flex items-center">
            <Building2 className="h-4 w-4 mr-1" />
            Dados da Empresa
          </h3>
          <div className="space-y-2 text-xs">
            {data.currentPage === 1 ? (
              <>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-sophisticated-navy flex-shrink-0" />
                  <span className="text-sophisticated-gray-dark">{data.companyPhone}</span>
                </div>
                {data.companyEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-sophisticated-navy flex-shrink-0" />
                    <span className="text-sophisticated-gray-dark break-all">{data.companyEmail}</span>
                  </div>
                )}
                {data.companyTaxId && (
                  <div className="text-sophisticated-gray-medium">
                    <span className="font-medium text-sophisticated-navy">NIF:</span> {data.companyTaxId}
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-sophisticated-gray-medium">
                Tel: {data.companyPhone}
              </div>
            )}
          </div>
        </div>

        {/* Client Details - Always show */}
        <div className="bg-sophisticated-gray-light border-l-4 border-sophisticated-gray-dark rounded-r-lg p-3">
          <h3 className="text-sm font-semibold text-sophisticated-gray-dark mb-2 flex items-center">
            <div className="w-4 h-4 bg-sophisticated-gray-dark rounded-full mr-1 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            Faturado Para
          </h3>
          <div>
            <h4 className="font-bold text-sm text-sophisticated-gray-dark mb-2">{data.clientName}</h4>
            {data.currentPage === 1 ? (
              <div className="space-y-1 text-xs text-sophisticated-gray-medium">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-3 w-3 text-sophisticated-gray-dark mt-0.5 flex-shrink-0" />
                  <span>{data.clientAddress}</span>
                </div>
                {data.clientPhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-sophisticated-gray-dark flex-shrink-0" />
                    <span>{data.clientPhone}</span>
                  </div>
                )}
                {data.clientEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-sophisticated-gray-dark flex-shrink-0" />
                    <span className="break-all">{data.clientEmail}</span>
                  </div>
                )}
                {data.clientTaxId && (
                  <div>
                    <span className="font-medium text-sophisticated-gray-dark">NIF:</span> {data.clientTaxId}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-sophisticated-gray-medium">
                {data.clientAddress}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="items-area mb-4">
        <div className="overflow-hidden rounded-lg shadow-sm border border-sophisticated-gray-light">
          <table className="w-full">
            <thead>
              <tr className="bg-sophisticated-navy text-white">
                <th className="p-2 text-left font-medium text-xs">Descrição</th>
                <th className="p-2 text-center font-medium text-xs w-12">Qtd.</th>
                <th className="p-2 text-right font-medium text-xs w-20">Preço Unit.</th>
                <th className="p-2 text-right font-medium text-xs w-20">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-sophisticated-beige'} hover:bg-sophisticated-beige-light transition-colors`}>
                  <td className="p-2 border-b border-sophisticated-gray-light font-medium text-sophisticated-gray-dark text-xs">{item.description}</td>
                  <td className="p-2 text-center border-b border-sophisticated-gray-light text-sophisticated-gray-medium text-xs">{item.quantity}</td>
                  <td className="p-2 text-right border-b border-sophisticated-gray-light text-sophisticated-gray-medium text-xs">
                    {item.unitPrice.toLocaleString('pt-AO')} Kz
                  </td>
                  <td className="p-2 text-right font-bold border-b border-sophisticated-gray-light text-sophisticated-navy text-xs">
                    {item.total.toLocaleString('pt-AO')} Kz
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total - Only on last page */}
        {showTotal && (
          <div className="flex justify-end mt-4">
            <div className="bg-sophisticated-navy text-white p-3 rounded-lg shadow-lg min-w-[150px]">
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
          <div className="bg-sophisticated-beige border border-sophisticated-navy/20 rounded-lg p-3">
            <h4 className="font-semibold text-sophisticated-navy mb-2 flex items-center text-xs">
              <div className="w-1.5 h-1.5 bg-sophisticated-navy rounded-full mr-1"></div>
              Forma de Pagamento
            </h4>
            <p className="text-xs text-sophisticated-gray-dark mb-2 font-medium">{data.paymentMethod}</p>
            {data.bankDetails && (
              <div className="text-xs text-sophisticated-gray-medium">
                <p className="font-medium mb-1 text-sophisticated-gray-dark">Dados Bancários:</p>
                <p>{data.bankDetails}</p>
              </div>
            )}
          </div>
          
          {data.observations && (
            <div className="bg-sophisticated-gray-light border border-sophisticated-gray-dark/20 rounded-lg p-3">
              <h4 className="font-semibold text-sophisticated-gray-dark mb-2 flex items-center text-xs">
                <div className="w-1.5 h-1.5 bg-sophisticated-gray-dark rounded-full mr-1"></div>
                Observações
              </h4>
              <p className="text-xs text-sophisticated-gray-medium">{data.observations}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="invoice-footer border-t border-sophisticated-gray-light pt-3">
        <div className="flex justify-between items-center">
          <div className="text-xs text-sophisticated-gray-medium">
            <p className="font-medium">Gerado digitalmente pelo FactureJá</p>
            <p className="mt-1">www.factureja.ao • {data.companyName}</p>
            {data.companyTaxId && (
              <p className="mt-1">NIF: {data.companyTaxId}</p>
            )}
          </div>
          
          {/* QR Code Placeholder */}
          <div className="w-12 h-12 border-2 border-dashed border-sophisticated-gray-medium rounded-lg flex items-center justify-center bg-sophisticated-beige">
            <span className="text-xs text-sophisticated-gray-medium font-medium">QR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
