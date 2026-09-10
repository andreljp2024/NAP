import { pgTable, serial, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha: varchar('senha', { length: 255 }).notNull(),
  cargo: varchar('cargo', { length: 50 }).notNull(), // 'admin', 'operador', 'tecnico_campo', 'tecnico_noc'
  ativo: boolean('ativo').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  documento: varchar('documento', { length: 20 }).notNull().unique(), // CPF/CNPJ
  telefone: varchar('telefone', { length: 20 }),
  contrato: varchar('contrato', { length: 50 }),
  plano: varchar('plano', { length: 100 }),
  status: varchar('status', { length: 50 }).default('ativo'), // ativo, bloqueado, cancelado
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const faturas = pgTable('faturas', {
  id: serial('id').primaryKey(),
  clienteId: serial('cliente_id').references(() => clientes.id),
  valor: varchar('valor', { length: 50 }).notNull(), // Pode ser decimal(10,2) na vida real, simplificando com varchar p/ demo
  vencimento: varchar('vencimento', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'pendente', 'pago', 'vencido'
  linhaDigitavel: text('linha_digitavel'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const atendimentos = pgTable('atendimentos', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 255 }).notNull(),
  estagio: varchar('estagio', { length: 100 }).notNull(),
  pipeline: varchar('pipeline', { length: 100 }).notNull(),
  contato: varchar('contato', { length: 255 }),
  telefone: varchar('telefone', { length: 50 }),
  endereco: text('endereco'),
  plano: varchar('plano', { length: 100 }),
  prioridade: serial('prioridade'),
  contextoIa: text('contexto_ia'),
  criadoEm: varchar('criado_em', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


export const conversas = pgTable('conversas', {
  id: serial('id').primaryKey(),
  telefone: varchar('telefone', { length: 20 }).notNull().unique(), // O ID do WABA ou telefone real
  nomeCliente: varchar('nome_cliente', { length: 255 }),
  clienteId: serial('cliente_id').references(() => clientes.id),
  fila: varchar('fila', { length: 50 }).default('triagem_ia'), // 'triagem_ia', 'fila_geral', 'meus', 'finalizados'
  statusConexao: text('status_conexao'), // JSON com uptime, sinal onu etc p/ contexto
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mensagens = pgTable('mensagens', {
  id: serial('id').primaryKey(),
  conversaId: serial('conversa_id').references(() => conversas.id),
  remetente: varchar('remetente', { length: 50 }).notNull(), // 'cliente', 'operador', 'ia', 'sistema'
  conteudo: text('conteudo').notNull(),
  tipo: varchar('tipo', { length: 50 }).default('texto'), // 'texto', 'audio', 'imagem'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
