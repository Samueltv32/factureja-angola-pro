
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Download, Edit, Printer, Copy, Upload, CheckCircle, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Template Components
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

const InvoicePreview = () => {
  const navigate = useNavigate();
  const { invoiceData, resetInvoice } = useInvoice();
  const printRef = useRef<HTMLDivElement>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'verifying' | 'rejected'>('pending');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'kwik' | 'express' | ''>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [comprovativoId, setComprovativoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar status do pagamento ao carregar
  useEffect(() => {
    const storedComprovativoId = localStorage.getItem(`comprovativo_${invoiceData.invoiceNumber}`);
    if (storedComprovativoId) {
      setComprovativoId(storedComprovativoId);
      verificarStatusPagamento(storedComprovativoId);
    }
  }, []);

  // Real-time updates para status do pagamento
  useEffect(() => {
    if (!comprovativoId) return;

    const channel = supabase
      .channel('comprovativo-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'comprovativos_pagamento',
          filter: `id=eq.${comprovativoId}`
        },
        (payload) => {
          console.log('Status atualizado:', payload);
          const novoStatus = payload.new.status;
          if (novoStatus === 'aprovado') {
            setPaymentStatus('paid');
            toast.success('Pagamento aprovado! Pode agora baixar a fatura.');
          } else if (novoStatus === 'rejeitado') {
            setPaymentStatus('rejected');
            toast.error('Pagamento rejeitado. Verifique o comprovativo e tente novamente.');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [comprovativoId]);

  const verificarStatusPagamento = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('comprovativos_pagamento')
        .select('status')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        switch (data.status) {
          case 'aprovado':
            setPaymentStatus('paid');
            break;
          case 'rejeitado':
            setPaymentStatus('rejected');
            break;
          case 'pendente':
            setPaymentStatus('verifying');
            break;
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const uploadComprovativo = async (file: File): Promise<string> => {
    const fileName = `comprovativo_${invoiceData.invoiceNumber}_${Date.now()}.${file.name.split('.').pop()}`;
    
    // Simular upload - em produção seria para o Supabase Storage
    const mockUrl = `https://storage.supabase.com/comprovativos/${fileName}`;
    
    // Simular delay do upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockUrl;
  };

  const submitPaymentProof = async () => {
    if (!paymentProof || !selectedPaymentMethod) {
      toast.error('Selecione o método de pagamento e carregue o comprovativo');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload do comprovativo
      const comprovantivoUrl = await uploadComprovativo(paymentProof);
      
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('comprovativos_pagamento')
        .insert({
          nome_cliente: invoiceData.clientName,
          fatura_id: invoiceData.invoiceNumber,
          comprovativo_url: comprovantivoUrl,
          status: 'pendente'
        })
        .select()
        .single();

      if (error) throw error;

      // Salvar ID localmente para verificações futuras
      localStorage.setItem(`comprovativo_${invoiceData.invoiceNumber}`, data.id);
      setComprovativoId(data.id);
      
      setPaymentStatus('verifying');
      setIsPaymentDialogOpen(false);
      toast.success('Comprovativo enviado! Aguarde a verificação do administrador.');
      
    } catch (error) {
      console.error('Erro ao enviar comprovativo:', error);
      toast.error('Erro ao enviar comprovativo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (paymentStatus !== 'paid') {
      toast.error('Efetue o pagamento primeiro para baixar a fatura');
      setIsPaymentDialogOpen(true);
      return;
    }
    if (window.print) {
      window.print();
    } else {
      toast.error('Funcionalidade de PDF não disponível neste navegador');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  const handlePaymentProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      toast.success('Comprovativo carregado com sucesso');
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
        {/* Payment Status */}
        {paymentStatus === 'pending' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 no-print">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800 mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Pagamento Pendente
                </h3>
                <p className="text-sm text-orange-600">
                  Taxa de serviço: <span className="font-bold">500 Kz</span> • Efetue o pagamento para baixar a fatura
                </p>
              </div>
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-angola-red hover:bg-red-700">
                    Pagar Agora
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Efetuar Pagamento - 500 Kz</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Escolha o método de pagamento:</Label>
                      
                      {/* Kwik Option */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPaymentMethod === 'kwik' 
                            ? 'border-angola-red bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('kwik')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Transferência Kwik</h4>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === 'kwik' ? 'bg-angola-red border-angola-red' : 'border-gray-300'
                          }`}></div>
                        </div>
                        {selectedPaymentMethod === 'kwik' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm font-medium">IBAN:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono">0040.0000.4792.3716.1016.9</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => copyToClipboard('0040.0000.4792.3716.1016.9')}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">
                              Nome: FactureJá • Valor: 500 Kz
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Express Option */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPaymentMethod === 'express' 
                            ? 'border-angola-red bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('express')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Transferência Express</h4>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === 'express' ? 'bg-angola-red border-angola-red' : 'border-gray-300'
                          }`}></div>
                        </div>
                        {selectedPaymentMethod === 'express' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm font-medium">Telefone:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono">941890316</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => copyToClipboard('941890316')}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">
                              Nome: FactureJá • Valor: 500 Kz
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Proof */}
                    {selectedPaymentMethod && (
                      <div className="space-y-3">
                        <Label className="text-base font-medium">Enviar comprovativo de pagamento:</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handlePaymentProofUpload}
                            className="hidden"
                            id="payment-proof"
                          />
                          <Label 
                            htmlFor="payment-proof" 
                            className="cursor-pointer flex flex-col items-center space-y-2"
                          >
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {paymentProof ? paymentProof.name : 'Clique para selecionar arquivo'}
                            </span>
                            <span className="text-xs text-gray-400">PNG, JPG ou PDF até 5MB</span>
                          </Label>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={submitPaymentProof}
                      disabled={!selectedPaymentMethod || !paymentProof}
                      className="w-full bg-angola-red hover:bg-red-700"
                    >
                      Enviar Comprovativo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {paymentStatus === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <X className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">
                    Pagamento Rejeitado
                  </h3>
                  <p className="text-sm text-red-600">
                    Comprovativo rejeitado. Verifique os dados e envie novamente.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setPaymentStatus('pending');
                  setPaymentProof(null);
                  setSelectedPaymentMethod('');
                  setIsPaymentDialogOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        )}

        {paymentStatus === 'verifying' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 no-print">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">
                  Verificando Pagamento...
                </h3>
                <p className="text-sm text-blue-600">
                  Comprovativo enviado! Verificação em andamento (até 24h)
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'paid' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 no-print">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">
                  Pagamento Confirmado!
                </h3>
                <p className="text-sm text-green-600">
                  Pode agora baixar a sua fatura em PDF
                </p>
              </div>
            </div>
          </div>
        )}

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
