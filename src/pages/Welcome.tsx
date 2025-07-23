import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Zap, Shield, Smartphone } from 'lucide-react';
const Welcome = () => {
  const navigate = useNavigate();
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
          
          <p className="text-lg opacity-90 mb-12 max-w-xl mx-auto">Feito especialmente para empreendedores e pequenos negócios.</p>
          
          <Button onClick={() => navigate('/criar-fatura')} size="lg" className="bg-white text-angola-red hover:bg-gray-100 text-lg px-8 py-6 rounded-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-200">
            Criar Minha Primeira Fatura
          </Button>
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