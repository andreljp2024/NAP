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
  documento: varchar('documento', { length: 20 }).notNull().unique(),
  contrato: varchar('contrato', { length: 50 }),
  plano: varchar('plano', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const atendimentos = pgTable('atendimentos', {
  id: serial('id').primaryKey(),
  clienteId: serial('cliente_id').references(() => clientes.id),
  tipo: varchar('tipo', { length: 50 }).notNull(), // 'Suporte', 'Cobranca', 'Vendas'
  status: varchar('status', { length: 50 }).notNull(), // 'Aberto', 'Em Andamento', 'Resolvido'
  descricao: text('descricao'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
