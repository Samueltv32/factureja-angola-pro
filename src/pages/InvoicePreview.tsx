
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Edit, Printer } from 'lucide-react';
import { toast } from 'sonner';

// Template Components
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

const InvoicePreview = () => {
  const navigate = useNavigate();
  const { invoiceData, resetInvoice } = useInvoice();
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (window.print) {
      window.print();
    } else {
      toast.error('Funcionalidade de PDF não disponível neste navegador');
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Fatura ${invoiceData.invoiceNumber}</title>
              <style>
                body { margin: 0; font-family: Arial, sans-serif; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleNewInvoice = () => {
    resetInvoice();
    navigate('/');
  };

  const renderTemplate = () => {
    switch (invoiceData.selectedTemplate) {
      case 'modern':
        return <ModernTemplate data={invoiceData} />;
      case 'minimal':
        return <MinimalTemplate data={invoiceData} />;
      case 'classic':
      default:
        return <ClassicTemplate data={invoiceData} />;
    }
  };

  const getTotalAmount = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 no-print">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/escolher-modelo')}
                className="text-angola-red hover:bg-red-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-bold text-angola-black">
                Visualizar Fatura #{invoiceData.invoiceNumber}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/criar-fatura')}
                className="border-angola-red text-angola-red hover:bg-red-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrint}
                className="border-gray-300"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button 
                size="sm"
                onClick={handleDownloadPDF}
                className="bg-angola-red hover:bg-red-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Payment Notice */}
        <div className="bg-angola-yellow/10 border border-angola-yellow/20 rounded-lg p-4 mb-6 no-print">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-angola-black mb-1">
                Fatura Pronta para Download!
              </h3>
              <p className="text-sm text-gray-600">
                Total: <span className="font-bold">{getTotalAmount().toLocaleString('pt-AO')} Kz</span> • 
                Taxa de serviço: <span className="font-bold text-angola-red">500 Kz</span>
              </p>
            </div>
            <Button 
              className="bg-angola-red hover:bg-red-700"
              onClick={() => toast.info('Integração de pagamento será adicionada em breve!')}
            >
              Pagar & Baixar
            </Button>
          </div>
        </div>

        {/* Invoice Preview */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div ref={printRef} className="bg-white">
              {renderTemplate()}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 no-print">
          <Button 
            variant="outline" 
            onClick={handleNewInvoice}
            className="border-angola-red text-angola-red hover:bg-red-50"
          >
            Nova Fatura
          </Button>
          <Button 
            onClick={() => navigate('/escolher-modelo')}
            variant="outline"
          >
            Trocar Modelo
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-angola-red hover:bg-red-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .container { max-width: none; margin: 0; padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default InvoicePreview;
