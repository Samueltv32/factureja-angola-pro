import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Check, X, Filter } from "lucide-react";

interface Comprovativo {
  id: string;
  nome_cliente: string;
  fatura_id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  data_envio: string;
  comprovativo_url: string;
  link_fatura?: string;
  observacao?: string;
}

const ADMIN_PASSWORD = "Money3200.";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [comprovativos, setComprovativos] = useState<Comprovativo[]>([]);
  const [filtro, setFiltro] = useState<string>("todos");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      buscarComprovativos();
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      buscarComprovativos();
      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Verifique a senha e tente novamente",
        variant: "destructive",
      });
    }
  };

  const buscarComprovativos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comprovativos_pagamento")
        .select("*")
        .order("data_envio", { ascending: false });

      if (error) throw error;
      setComprovativos((data || []) as Comprovativo[]);
    } catch (error) {
      console.error("Erro ao buscar comprovativos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os comprovativos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const aprovarComprovativo = async (id: string, faturaId: string) => {
    try {
      const linkFatura = `https://supabase.com/storage/faturas/${faturaId}.pdf`;
      
      const { error } = await supabase
        .from("comprovativos_pagamento")
        .update({ 
          status: "aprovado", 
          link_fatura: linkFatura 
        })
        .eq("id", id);

      if (error) throw error;
      
      await buscarComprovativos();
      toast({
        title: "Comprovativo aprovado",
        description: "O pagamento foi aprovado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o comprovativo",
        variant: "destructive",
      });
    }
  };

  const rejeitarComprovativo = async (id: string) => {
    try {
      const { error } = await supabase
        .from("comprovativos_pagamento")
        .update({ 
          status: "rejeitado",
          observacao: observacao || "Comprovativo rejeitado"
        })
        .eq("id", id);

      if (error) throw error;
      
      await buscarComprovativos();
      setObservacao("");
      toast({
        title: "Comprovativo rejeitado",
        description: "O pagamento foi rejeitado",
      });
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o comprovativo",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
      aprovado: "bg-green-500/20 text-green-700 border-green-500/30",
      rejeitado: "bg-red-500/20 text-red-700 border-red-500/30"
    };

    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const comprovativosFiltrados = comprovativos.filter(comp => {
    if (filtro === "todos") return true;
    return comp.status === filtro;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
            <p className="text-muted-foreground">Digite a senha para acessar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gestão de comprovativos de pagamento</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem("admin_authenticated");
              setIsAuthenticated(false);
              setPassword("");
            }}
          >
            Sair
          </Button>
        </div>

        <div className="mb-6 flex gap-4 items-center">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="aprovado">Aprovados</SelectItem>
              <SelectItem value="rejeitado">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={buscarComprovativos} variant="outline">
            Atualizar
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Carregando comprovativos...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {comprovativosFiltrados.map((comp) => (
              <Card key={comp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{comp.nome_cliente}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Fatura: {comp.fatura_id}
                      </p>
                    </div>
                    {getStatusBadge(comp.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Data de envio</p>
                    <p className="font-medium">
                      {new Date(comp.data_envio).toLocaleDateString("pt-AO")}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Comprovativo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Comprovativo - {comp.nome_cliente}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          {comp.comprovativo_url.toLowerCase().includes('.pdf') ? (
                            <iframe
                              src={comp.comprovativo_url}
                              className="w-full h-96 border rounded"
                              title="Comprovativo PDF"
                            />
                          ) : (
                            <img
                              src={comp.comprovativo_url}
                              alt="Comprovativo"
                              className="w-full max-h-96 object-contain border rounded"
                            />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {comp.status === "pendente" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => aprovarComprovativo(comp.id, comp.fatura_id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rejeitar Comprovativo</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <Textarea
                                placeholder="Observação (opcional)"
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                              />
                              <div className="flex gap-2 justify-end">
                                <DialogTrigger asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogTrigger>
                                <Button
                                  variant="destructive"
                                  onClick={() => rejeitarComprovativo(comp.id)}
                                >
                                  Confirmar Rejeição
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>

                  {comp.observacao && (
                    <div className="bg-muted p-3 rounded text-sm">
                      <p className="font-medium">Observação:</p>
                      <p>{comp.observacao}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {comprovativosFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum comprovativo encontrado para o filtro selecionado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;