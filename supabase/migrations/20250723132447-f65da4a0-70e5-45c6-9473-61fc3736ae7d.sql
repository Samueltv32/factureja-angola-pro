-- Adicionar coluna codigo_fatura na tabela comprovativos_pagamento
ALTER TABLE public.comprovativos_pagamento 
ADD COLUMN codigo_fatura TEXT NOT NULL DEFAULT '';

-- Criar índice para otimizar consultas por código da fatura
CREATE INDEX idx_comprovativos_pagamento_codigo_fatura 
ON public.comprovativos_pagamento(codigo_fatura);