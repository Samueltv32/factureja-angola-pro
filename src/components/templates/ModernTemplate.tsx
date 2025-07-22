
import React from 'react';
import { InvoiceData } from '@/contexts/InvoiceContext';
import { Phone, Mail, MapPin, Building2 } from 'lucide-react';

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
    <div className="bg-white text-sophisticated-gray-dark font-montserrat" style={{ minHeight: '297mm' }}>
      {/* Elegant Header */}
      <div className="bg-gradient-to-r from-sophisticated-navy to-sophisticated-navy-dark text-white px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1 w-full lg:w-auto">
            {data.companyLogo && (
              <div className="mb-4 flex justify-center lg:justify-start">
                <img 
                  src={data.companyLogo} 
                  alt="Logo" 
                  className="h-12 sm:h-16 w-auto object-contain filter brightness-0 invert"
                />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-center lg:text-left">{data.companyName}</h1>
            <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{data.companyAddress}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center lg:text-right w-full lg:w-auto">
            <h2 className="text-3xl sm:text-4xl font-light mb-4 tracking-wide">FATURA</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-sm inline-block">
              <p className="mb-1 font-medium"># {data.invoiceNumber}</p>
              <p className="text-xs sm:text-sm">{formatDate(data.invoiceDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8">
        {/* Two Column Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Company Details */}
          <div className="bg-sophisticated-beige-light border-l-4 border-sophisticated-navy rounded-r-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-sophisticated-navy mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Dados da Empresa
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-sophisticated-navy flex-shrink-0" />
                <span className="text-sophisticated-gray-dark">{data.companyPhone}</span>
              </div>
              {data.companyEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-sophisticated-navy flex-shrink-0" />
                  <span className="text-sophisticated-gray-dark break-all">{data.companyEmail}</span>
                </div>
              )}
              {data.companyTaxId && (
                <div className="text-sophisticated-gray-medium">
                  <span className="font-medium text-sophisticated-navy">NIF:</span> {data.companyTaxId}
                </div>
              )}
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-sophisticated-gray-light border-l-4 border-sophisticated-gray-dark rounded-r-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-sophisticated-gray-dark mb-4 flex items-center">
              <div className="w-5 h-5 bg-sophisticated-gray-dark rounded-full mr-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              Faturado Para
            </h3>
            <div>
              <h4 className="font-bold text-lg text-sophisticated-gray-dark mb-3">{data.clientName}</h4>
              <div className="space-y-2 text-sm text-sophisticated-gray-medium">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-sophisticated-gray-dark mt-0.5 flex-shrink-0" />
                  <span>{data.clientAddress}</span>
                </div>
                {data.clientPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-sophisticated-gray-dark flex-shrink-0" />
                    <span>{data.clientPhone}</span>
                  </div>
                )}
                {data.clientEmail && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-sophisticated-gray-dark flex-shrink-0" />
                    <span className="break-all">{data.clientEmail}</span>
                  </div>
                )}
                {data.clientTaxId && (
                  <div>
                    <span className="font-medium text-sophisticated-gray-dark">NIF:</span> {data.clientTaxId}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table - Mobile Responsive */}
        <div className="mb-8">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-hidden rounded-lg shadow-sm border border-sophisticated-gray-light">
            <table className="w-full">
              <thead>
                <tr className="bg-sophisticated-navy text-white">
                  <th className="p-4 text-left font-medium">Descrição</th>
                  <th className="p-4 text-center font-medium w-20">Qtd.</th>
                  <th className="p-4 text-right font-medium w-32">Preço Unit.</th>
                  <th className="p-4 text-right font-medium w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-sophisticated-beige'} hover:bg-sophisticated-beige-light transition-colors`}>
                    <td className="p-4 border-b border-sophisticated-gray-light font-medium text-sophisticated-gray-dark">{item.description}</td>
                    <td className="p-4 text-center border-b border-sophisticated-gray-light text-sophisticated-gray-medium">{item.quantity}</td>
                    <td className="p-4 text-right border-b border-sophisticated-gray-light text-sophisticated-gray-medium">
                      {item.unitPrice.toLocaleString('pt-AO')} Kz
                    </td>
                    <td className="p-4 text-right font-bold border-b border-sophisticated-gray-light text-sophisticated-navy">
                      {item.total.toLocaleString('pt-AO')} Kz
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {data.items.map((item, index) => (
              <div key={item.id} className="bg-sophisticated-beige-light border border-sophisticated-gray-light rounded-lg p-4">
                <div className="font-medium text-sophisticated-gray-dark mb-2">{item.description}</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-sophisticated-gray-medium">Qtd:</span>
                    <div className="font-medium">{item.quantity}</div>
                  </div>
                  <div>
                    <span className="text-sophisticated-gray-medium">Preço:</span>
                    <div className="font-medium">{item.unitPrice.toLocaleString('pt-AO')} Kz</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sophisticated-gray-medium">Total:</span>
                    <div className="font-bold text-sophisticated-navy">{item.total.toLocaleString('pt-AO')} Kz</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-end mt-6">
            <div className="bg-sophisticated-navy text-white p-4 sm:p-6 rounded-lg shadow-lg min-w-[200px]">
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Total da Fatura</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {getTotalAmount().toLocaleString('pt-AO')} Kz
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Notes - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div className="bg-sophisticated-beige border border-sophisticated-navy/20 rounded-lg p-4 sm:p-6">
            <h4 className="font-semibold text-sophisticated-navy mb-3 flex items-center">
              <div className="w-2 h-2 bg-sophisticated-navy rounded-full mr-2"></div>
              Forma de Pagamento
            </h4>
            <p className="text-sm text-sophisticated-gray-dark mb-3 font-medium">{data.paymentMethod}</p>
            {data.bankDetails && (
              <div className="text-sm text-sophisticated-gray-medium">
                <p className="font-medium mb-1 text-sophisticated-gray-dark">Dados Bancários:</p>
                <p>{data.bankDetails}</p>
              </div>
            )}
          </div>
          
          {data.observations && (
            <div className="bg-sophisticated-gray-light border border-sophisticated-gray-dark/20 rounded-lg p-4 sm:p-6">
              <h4 className="font-semibold text-sophisticated-gray-dark mb-3 flex items-center">
                <div className="w-2 h-2 bg-sophisticated-gray-dark rounded-full mr-2"></div>
                Observações
              </h4>
              <p className="text-sm text-sophisticated-gray-medium">{data.observations}</p>
            </div>
          )}
        </div>

        {/* Footer with QR Code */}
        <div className="border-t border-sophisticated-gray-light pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-sophisticated-gray-medium text-center sm:text-left">
              <p className="font-medium">Gerado digitalmente pelo FactureJá</p>
              <p className="mt-1">www.factureja.ao</p>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="w-16 h-16 border-2 border-dashed border-sophisticated-gray-medium rounded-lg flex items-center justify-center bg-sophisticated-beige">
              <span className="text-xs text-sophisticated-gray-medium font-medium">QR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
