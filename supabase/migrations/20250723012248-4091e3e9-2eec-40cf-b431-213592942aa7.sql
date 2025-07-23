-- Habilitar real-time para a tabela comprovativos_pagamento
ALTER TABLE public.comprovativos_pagamento REPLICA IDENTITY FULL;

-- Adicionar a tabela à publicação do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.comprovativos_pagamento;