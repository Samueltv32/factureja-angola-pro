
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Upload, Building2, User, Receipt } from 'lucide-react';
import { toast } from 'sonner';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { invoiceData, updateInvoiceData, addItem, removeItem, updateItem, getTotalAmount } = useInvoice();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo deve ter no máximo 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target?.result as string;
        updateInvoiceData({ companyLogo: logoData });
        setLogoFile(file);
        toast.success('Logo carregado com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    addItem({
      description: '',
      quantity: 1,
      unitPrice: 0
    });
  };

  const handleContinue = () => {
    if (!invoiceData.companyName || !invoiceData.clientName || invoiceData.items.length === 0) {
      toast.error('Preencha os campos obrigatórios e adicione pelo menos um item');
      return;
    }
    
    // Generate invoice number if not set
    if (!invoiceData.invoiceNumber) {
      const invoiceNum = `FJ${Date.now().toString().slice(-6)}`;
      updateInvoiceData({ invoiceNumber: invoiceNum });
    }
    
    navigate('/escolher-modelo');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-angola-red hover:bg-red-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-bold text-angola-black">Criar Nova Fatura</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Company Info Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-angola-black">
                <Building2 className="h-5 w-5 mr-2 text-angola-red" />
                Dados da Sua Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName" className="text-sm font-medium">
                    Nome da Empresa *
                  </Label>
                  <Input
                    id="companyName"
                    value={invoiceData.companyName}
                    onChange={(e) => updateInvoiceData({ companyName: e.target.value })}
                    placeholder="Ex: Minha Empresa Lda"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone" className="text-sm font-medium">
                    Telefone *
                  </Label>
                  <Input
                    id="companyPhone"
                    value={invoiceData.companyPhone}
                    onChange={(e) => updateInvoiceData({ companyPhone: e.target.value })}
                    placeholder="+244 900 000 000"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="companyAddress" className="text-sm font-medium">
                  Endereço *
                </Label>
                <Textarea
                  id="companyAddress"
                  value={invoiceData.companyAddress}
                  onChange={(e) => updateInvoiceData({ companyAddress: e.target.value })}
                  placeholder="Rua, Bairro, Município, Província"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyEmail" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={invoiceData.companyEmail}
                    onChange={(e) => updateInvoiceData({ companyEmail: e.target.value })}
                    placeholder="contato@minhaempresa.ao"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyTaxId" className="text-sm font-medium">
                    NIF (opcional)
                  </Label>
                  <Input
                    id="companyTaxId"
                    value={invoiceData.companyTaxId}
                    onChange={(e) => updateInvoiceData({ companyTaxId: e.target.value })}
                    placeholder="000000000"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <Label className="text-sm font-medium">Logo da Empresa (opcional)</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="border-dashed"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {logoFile ? 'Trocar Logo' : 'Adicionar Logo'}
                  </Button>
                  {logoFile && (
                    <span className="text-sm text-green-600">
                      ✓ {logoFile.name}
                    </span>
                  )}
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos: PNG, JPG, SVG (máx. 2MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Client Info Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-angola-black">
                <User className="h-5 w-5 mr-2 text-angola-red" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName" className="text-sm font-medium">
                    Nome do Cliente *
                  </Label>
                  <Input
                    id="clientName"
                    value={invoiceData.clientName}
                    onChange={(e) => updateInvoiceData({ clientName: e.target.value })}
                    placeholder="Ex: João Silva"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone" className="text-sm font-medium">
                    Telefone
                  </Label>
                  <Input
                    id="clientPhone"
                    value={invoiceData.clientPhone}
                    onChange={(e) => updateInvoiceData({ clientPhone: e.target.value })}
                    placeholder="+244 900 000 000"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="clientAddress" className="text-sm font-medium">
                  Endereço *
                </Label>
                <Textarea
                  id="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={(e) => updateInvoiceData({ clientAddress: e.target.value })}
                  placeholder="Endereço do cliente"
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientEmail" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={(e) => updateInvoiceData({ clientEmail: e.target.value })}
                    placeholder="cliente@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="clientTaxId" className="text-sm font-medium">
                    NIF do Cliente
                  </Label>
                  <Input
                    id="clientTaxId"
                    value={invoiceData.clientTaxId}
                    onChange={(e) => updateInvoiceData({ clientTaxId: e.target.value })}
                    placeholder="000000000"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-angola-black">
                <Receipt className="h-5 w-5 mr-2 text-angola-red" />
                Detalhes da Fatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber" className="text-sm font-medium">
                    Número da Fatura
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => updateInvoiceData({ invoiceNumber: e.target.value })}
                    placeholder="Auto-gerado"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceDate" className="text-sm font-medium">
                    Data da Fatura
                  </Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceData.invoiceDate.toISOString().split('T')[0]}
                    onChange={(e) => updateInvoiceData({ invoiceDate: new Date(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod" className="text-sm font-medium">
                    Forma de Pagamento
                  </Label>
                  <Select
                    value={invoiceData.paymentMethod}
                    onValueChange={(value) => updateInvoiceData({ paymentMethod: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
                      <SelectItem value="Multicaixa">Multicaixa</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Cartão">Cartão</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-angola-black">
                  Produtos/Serviços
                </CardTitle>
                <Button onClick={handleAddItem} size="sm" className="bg-angola-red hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {invoiceData.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum item adicionado ainda</p>
                  <p className="text-sm">Clique em "Adicionar Item" para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoiceData.items.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Item #{index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium">Descrição</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            placeholder="Ex: Consultoria em Marketing"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Quantidade</Label>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Preço (Kz)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          Total: {(item.quantity * item.unitPrice).toLocaleString('pt-AO')} Kz
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-angola-red">
                        Total Geral: {getTotalAmount().toLocaleString('pt-AO')} Kz
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-angola-black">Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bankDetails" className="text-sm font-medium">
                  Dados Bancários (opcional)
                </Label>
                <Textarea
                  id="bankDetails"
                  value={invoiceData.bankDetails}
                  onChange={(e) => updateInvoiceData({ bankDetails: e.target.value })}
                  placeholder="Ex: Banco BAI - Conta: 123456789"
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="observations" className="text-sm font-medium">
                  Observações (opcional)
                </Label>
                <Textarea
                  id="observations"
                  value={invoiceData.observations}
                  onChange={(e) => updateInvoiceData({ observations: e.target.value })}
                  placeholder="Informações adicionais sobre a fatura"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleContinue}
              size="lg"
              className="bg-angola-red hover:bg-red-700 px-8"
            >
              Continuar para Modelos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
