import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Zap, Shield, Smartphone, Search } from 'lucide-react';
import { toast } from 'sonner';

const Welcome = () => {
  const navigate = useNavigate();
  const { updateInvoiceData } = useInvoice();
  const [codigoConsulta, setCodigoConsulta] = useState('');
  const features = [{
    icon: <Zap className="h-6 w-6 text-angola-red" />,
    title: "Rápido & Simples",
    description: "Crie faturas profissionais em poucos minutos"
  }, {
    icon: <FileText className="h-6 w-6 text-angola-red" />,
    title: "3 Modelos Únicos",
    description: "Escolha entre designs clássico, moderno ou minimalista"
  }, {
    icon: <Smartphone className="h-6 w-6 text-angola-red" />,
    title: "Mobile First",
    description: "Funciona perfeitamente no seu smartphone"
  }, {
    icon: <Shield className="h-6 w-6 text-angola-red" />,
    title: "Sem Cadastro",
    description: "Use instantaneamente, sem complicações"
  }];
  
  const consultarFatura = () => {
    if (!codigoConsulta.trim()) {
      toast.error('Insira o código da fatura');
      return;
    }
    
    // Debug: Listar todas as faturas no localStorage
    console.log('Todas as chaves no localStorage:', Object.keys(localStorage));
    const faturasKeys = Object.keys(localStorage).filter(key => key.startsWith('fatura_'));
    console.log('Faturas encontradas:', faturasKeys);
    
    // Limpar faturas expiradas
    limparFaturasExpiradas();
    
    // Buscar fatura no localStorage
    const chaveConsulta = `fatura_${codigoConsulta.trim()}`;
    console.log('Procurando por chave:', chaveConsulta);
    const faturaData = localStorage.getItem(chaveConsulta);
    console.log('Dados encontrados:', faturaData ? 'Sim' : 'Não');
    
    if (!faturaData) {
      toast.error('Fatura não encontrada. Verifique o código ou a fatura pode ter expirado (30 dias).');
      return;
    }
    
    try {
      const dadosFatura = JSON.parse(faturaData);
      
      // Verificar se não expirou
      if (Date.now() > dadosFatura.expiresAt) {
        localStorage.removeItem(`fatura_${codigoConsulta.trim()}`);
        toast.error('Fatura expirada. Os dados são mantidos por apenas 30 dias.');
        return;
      }
      
      // Converter strings de data de volta para objetos Date
      if (dadosFatura.invoiceDate) {
        dadosFatura.invoiceDate = new Date(dadosFatura.invoiceDate);
      }
      if (dadosFatura.dueDate) {
        dadosFatura.dueDate = new Date(dadosFatura.dueDate);
      }
      
      // Carregar dados da fatura no contexto
      updateInvoiceData(dadosFatura);
      toast.success('Fatura encontrada! Redirecionando...');
      
      // Redirecionar para visualização
      setTimeout(() => navigate('/visualizar'), 500);
      
    } catch (error) {
      toast.error('Erro ao carregar fatura. Dados podem estar corrompidos.');
    }
  };
  
  const limparFaturasExpiradas = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('fatura_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.expiresAt && Date.now() > data.expiresAt) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Remove dados corrompidos
          localStorage.removeItem(key);
        }
      }
    });
  };

  return <div className="min-h-screen bg-gradient-to-br from-angola-red via-red-600 to-angola-black font-inter">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-poppins">
              Facture<span className="text-angola-yellow">Já</span>
            </h1>
            <div className="w-24 h-1 bg-angola-yellow mx-auto mb-6"></div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
            Emita faturas profissionais em minutos, sem complicação.
          </h2>
          
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">Feito especialmente para empreendedores e pequenos negócios.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button onClick={() => navigate('/criar-fatura')} size="lg" className="bg-white text-angola-red hover:bg-gray-100 text-lg px-8 py-6 rounded-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-200">
              Criar Nova Fatura
            </Button>
          </div>
          
          {/* Consultar Fatura Existente */}
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Consultar Fatura Existente
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="codigo-consulta" className="text-white/90 text-sm">
                  Código da Fatura (ex: FJ123456)
                </Label>
                <Input
                  id="codigo-consulta"
                  type="text"
                  value={codigoConsulta}
                  onChange={(e) => setCodigoConsulta(e.target.value)}
                  placeholder="Insira o código da fatura"
                  className="mt-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  onKeyPress={(e) => e.key === 'Enter' && consultarFatura()}
                />
              </div>
              <Button 
                onClick={consultarFatura}
                disabled={!codigoConsulta.trim()}
                className="w-full bg-angola-yellow hover:bg-yellow-500 text-angola-black font-semibold"
              >
                Consultar Fatura
              </Button>
              <p className="text-xs text-white/70 text-center">
                Dados mantidos localmente por 30 dias
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-semibold text-angola-black">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-white/90 mb-6">
            Junte-se aos empreendedores que já confiam no FactureJá
          </p>
          <div className="text-center">
            <p className="text-angola-yellow font-semibold text-lg">
              Apenas 500 Kz por fatura gerada
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default Welcome;