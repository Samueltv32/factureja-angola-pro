
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Palette, Sparkles, Minimize2 } from 'lucide-react';

const TemplateSelection = () => {
  const navigate = useNavigate();
  const { invoiceData, updateInvoiceData } = useInvoice();

  const templates = [
    {
      id: 'classic' as const,
      name: 'Clássico Profissional',
      description: 'Estrutura tradicional com cabeçalho em destaque e bordas discretas',
      features: [
        'Cores neutras (cinza, azul escuro)',
        'Logo no canto superior esquerdo',
        'Tabela com colunas bem definidas',
        'Rodapé com observações',
        'Ideal para qualquer negócio formal'
      ],
      icon: <Palette className="h-6 w-6" />,
      color: 'from-slate-500 to-slate-700',
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'modern' as const,
      name: 'Moderno & Elegante',
      description: 'Visual ousado com layout em duas colunas e cores suaves',
      features: [
        'Layout em duas colunas',
        'Cores elegantes (verde-água, lilás)',
        'Ícones para contato',
        'Espaço para código QR',
        'Ideal para freelancers e criativos'
      ],
      icon: <Sparkles className="h-6 w-6" />,
      color: 'from-teal-500 to-purple-500',
      preview: '/api/placeholder/300/400'
    },
    {
      id: 'minimal' as const,
      name: 'Minimalista & Clean',
      description: 'Design limpo em preto e branco com tipografia moderna',
      features: [
        'Sem bordas ou cores de fundo',
        'Tipografia leve e moderna',
        'Espaçamento generoso',
        'Estrutura linear e simples',
        'Ideal para serviços técnicos'
      ],
      icon: <Minimize2 className="h-6 w-6" />,
      color: 'from-gray-400 to-gray-600',
      preview: '/api/placeholder/300/400'
    }
  ];

  const handleSelectTemplate = (templateId: 'classic' | 'modern' | 'minimal') => {
    updateInvoiceData({ selectedTemplate: templateId });
    navigate('/visualizar');
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
                onClick={() => navigate('/criar-fatura')}
                className="text-angola-red hover:bg-red-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-bold text-angola-black">Escolher Modelo</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-angola-black mb-4">
            Escolha o Modelo Perfeito
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Selecione o design que melhor representa o seu negócio. 
            Todos os modelos são profissionais e otimizados para impressão.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                invoiceData.selectedTemplate === template.id 
                  ? 'ring-2 ring-angola-red shadow-xl' 
                  : 'shadow-sm'
              }`}
              onClick={() => updateInvoiceData({ selectedTemplate: template.id })}
            >
              {/* Selected Badge */}
              {invoiceData.selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-angola-red text-white rounded-full p-2">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}

              {/* Template Header */}
              <div className={`bg-gradient-to-r ${template.color} p-6 text-white`}>
                <div className="flex items-center space-x-3 mb-3">
                  {template.icon}
                  <h3 className="text-xl font-bold">{template.name}</h3>
                </div>
                <p className="text-white/90 text-sm">{template.description}</p>
              </div>

              {/* Template Preview */}
              <div className="bg-gray-100 h-48 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="w-16 h-20 border-2 border-dashed border-gray-300 mx-auto mb-2"></div>
                  <p className="text-sm">Preview do Modelo</p>
                </div>
              </div>

              {/* Template Features */}
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-angola-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              {/* Select Button */}
              <div className="p-6 pt-0">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template.id);
                  }}
                  variant={invoiceData.selectedTemplate === template.id ? "default" : "outline"}
                  className={`w-full ${
                    invoiceData.selectedTemplate === template.id 
                      ? 'bg-angola-red hover:bg-red-700' 
                      : 'border-angola-red text-angola-red hover:bg-red-50'
                  }`}
                >
                  {invoiceData.selectedTemplate === template.id ? 'Visualizar Fatura' : 'Selecionar Modelo'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Template Action */}
        {invoiceData.selectedTemplate && (
          <div className="text-center animate-fade-in">
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
              <h4 className="font-semibold text-angola-black mb-2">
                Modelo Selecionado: {templates.find(t => t.id === invoiceData.selectedTemplate)?.name}
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Pronto para visualizar sua fatura?
              </p>
              <Button 
                onClick={() => navigate('/visualizar')}
                size="lg"
                className="bg-angola-red hover:bg-red-700 px-8"
              >
                Visualizar & Baixar Fatura
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelection;
