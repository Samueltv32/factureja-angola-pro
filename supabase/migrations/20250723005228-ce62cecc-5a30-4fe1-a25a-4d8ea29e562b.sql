-- Criar tabela para comprovativos de pagamento
CREATE TABLE public.comprovativos_pagamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_cliente TEXT NOT NULL,
  fatura_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  comprovativo_url TEXT NOT NULL,
  link_fatura TEXT,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (mesmo sendo admin, é boa prática)
ALTER TABLE public.comprovativos_pagamento ENABLE ROW LEVEL SECURITY;

-- Política permissiva para admins (por enquanto permitir tudo)
CREATE POLICY "Permitir tudo para comprovativos" 
ON public.comprovativos_pagamento 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Trigger para update automatico do updated_at
CREATE TRIGGER update_comprovativos_pagamento_updated_at
BEFORE UPDATE ON public.comprovativos_pagamento
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();