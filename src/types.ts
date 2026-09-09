export interface Operador {
  id: number;
  nome: string;
  role: "operator" | "admin_operator" | "super_admin";
  status: "online" | "pausa" | "offline";
}

export interface Contato {
  id: number;
  cpf_cnpj: string;
  nome: string;
  telefone: string;
  plano?: string;
  status_cliente: "ativo" | "bloqueado" | "cancelado";
}

export interface Conversa {
  id: number;
  canal: "whatsapp" | "webchat" | "telefone";
  contato_id: number;
  operador_id?: number;
  status: "aberta" | "fechada";
  prioridade: number;
  mensagens: Mensagem[];
}

export interface Mensagem {
  id: number;
  conversa_id: number;
  autor_tipo: "cliente" | "ia" | "operador";
  conteudo: string;
  enviada_em: string;
}

export interface Deal {
  id: number;
  titulo: string;
  estagio: string;
  pipeline: "Suporte" | "Vendas";
  contato: string;
  prioridade: number;
}
