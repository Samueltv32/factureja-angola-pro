-- Criar bucket para comprovativos de pagamento
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comprovativos', 'comprovativos', true);

-- Criar políticas para permitir acesso aos comprovativos
CREATE POLICY "Permitir visualização de comprovativos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'comprovativos');

CREATE POLICY "Permitir upload de comprovativos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'comprovativos');

CREATE POLICY "Permitir update de comprovativos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'comprovativos');

CREATE POLICY "Permitir delete de comprovativos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'comprovativos');