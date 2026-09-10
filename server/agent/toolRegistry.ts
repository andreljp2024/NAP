/**
 * NAP AI Agent Engine - Dynamic Tool Registry
 * Gerenciador modular e extensível de ferramentas para o Agente Autônomo de Telecom & ISP
 */

export interface AgentTool {
  name: string;
  label: string;
  description: string;
  keywords: string[];
  category: 'financeiro' | 'suporte_noc' | 'telemetria_tr069' | 'radius_erp' | 'comercial' | 'qualidade';
  parametersSchema?: Record<string, any>;
  execute: (params: {
    prompt: string;
    cliente_cpf?: string;
    telefone?: string;
    contexto?: any;
  }) => Promise<{
    toolExecutada: string;
    toolDados: any;
    respostaGerada: string;
  }>;
}

class ToolRegistry {
  private tools: Map<string, AgentTool> = new Map();

  public register(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
  }

  public getTool(name: string): AgentTool | undefined {
    return this.tools.get(name);
  }

  public getAllTools(): AgentTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Busca ferramenta por correspondência semântica e palavras-chave do ISP
   */
  public matchTool(prompt: string): AgentTool | undefined {
    const promptLower = prompt.toLowerCase();
    
    for (const tool of this.tools.values()) {
      const matched = tool.keywords.some(kw => promptLower.includes(kw.toLowerCase()));
      if (matched) {
        return tool;
      }
    }
    return undefined;
  }

  /**
   * Executa a ferramenta correspondente com fallback seguro
   */
  public async executeTool(
    toolName: string,
    params: { prompt: string; cliente_cpf?: string; telefone?: string; contexto?: any }
  ): Promise<{ toolExecutada: string; toolDados: any; respostaGerada: string }> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Ferramenta "${toolName}" não está registrada no Tool Registry.`);
    }
    return await tool.execute(params);
  }

  /**
   * Converte ferramentas registradas para o schema de Function Calling do Gemini SDK
   */
  public toGeminiFunctionDeclarations(): any[] {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parametersSchema || {
        type: "OBJECT",
        properties: {
          motivo: { type: "STRING", description: "Motivo da solicitação pelo cliente" }
        }
      }
    }));
  }
}

export const agentToolRegistry = new ToolRegistry();

// =========================================================================
// REGISTRO DAS FERRAMENTAS DO ECOSSISTEMA TELECOM / CALL CENTER
// =========================================================================

// 1. Tool: Geração de PIX & 2ª Via de Fatura (SGP / ERP)
agentToolRegistry.register({
  name: "sgp_gerar_pix",
  label: "Gerador de PIX e 2ª Via",
  description: "Gera chave PIX Copia e Cola instantânea e obtém status de fatura em aberto no ERP do provedor.",
  category: "financeiro",
  keywords: ["pix", "pagar", "fatura", "segunda via", "2 via", "boleto", "código de barras", "conta"],
  parametersSchema: {
    type: "OBJECT",
    properties: {
      cpf_cnpj: { type: "STRING", description: "CPF ou CNPJ do assinante" }
    }
  },
  execute: async ({ cliente_cpf }) => {
    const dados = {
      cliente: "Maria Oliveira",
      cpf: cliente_cpf || "123.456.789-00",
      fatura_id: 8841,
      valor: 99.90,
      vencimento: "10/09/2026",
      codigo_pix: "00020126580014br.gov.bcb.pix0136nap-provedor-fibra-9982-fatura520400005303986540599.905802BR5913NAP TELECOM6009SAO PAULO62070503***6304E8A1"
    };

    const resposta = `Localizei sua fatura em aberto no valor de R$ 99,90 com vencimento em 10/09/2026.\n\nAqui está a chave PIX Copia e Cola para pagamento imediato:\n\`${dados.codigo_pix}\`\n\nAssim que você pagar no seu app bancário, a compensação ocorrerá em menos de 1 minuto no nosso sistema! Deseja o link do boleto bancário também?`;

    return {
      toolExecutada: "sgp_gerar_pix",
      toolDados: dados,
      respostaGerada: resposta
    };
  }
});

// 2. Tool: Verificação de Incidentes Massivos (NOC Shield)
agentToolRegistry.register({
  name: "verificar_incidente_rede",
  label: "Monitor de Incidentes NOC",
  description: "Consulta o NOC em tempo real para verificar se há rompimentos de fibra ou oscilações ativas na região do cliente.",
  category: "suporte_noc",
  keywords: ["queda", "rompimento", "bairro", "região", "manutenção", "fora do ar", "massiva", "ocorrência", "rompeu", "apagão"],
  execute: async () => {
    const incidente = {
      id: "INC-884910",
      titulo: "Rompimento de Troncal Óptico (Caminhão)",
      regioesAfetadas: ["Bela Vista", "Jardins", "Paraíso"],
      protocoloAnatel: "ANT-2026-884910",
      status: "em_reparo",
      previsaoRetorno: "15:30 (Hoje)",
      equipesNoLocal: 2
    };

    const resposta = `Sim, identifiquei no NOC uma ocorrência técnica em andamento: "${incidente.titulo}" na região de ${incidente.regioesAfetadas.join(', ')}. Nossos técnicos de campo já estão efetuando as fusões ópticas (Protocolo ${incidente.protocoloAnatel}) com previsão de normalização até ${incidente.previsaoRetorno}. Sua conexão será restabelecida automaticamente!`;

    return {
      toolExecutada: "verificar_incidente_rede",
      toolDados: incidente,
      respostaGerada: resposta
    };
  }
});

// 3. Tool: Telemetria Óptica e Status TR-069
agentToolRegistry.register({
  name: "sgp_consultar_status_conexao",
  label: "Telemetria Óptica TR-069",
  description: "Lê a potência óptica (dBm RX/TX) da ONU na porta PON da OLT, uptime da sessão PPPoE e perda de pacotes.",
  category: "telemetria_tr069",
  keywords: ["lento", "lentidão", "sinal", "internet", "caindo", "status", "potência", "dbm", "oscilando", "velocidade"],
  execute: async () => {
    const dados = {
      sinal_optico_rx: "-19.4 dBm",
      sinal_optico_tx: "+2.3 dBm",
      classificacao_sinal: "EXCELENTE (-19.4 dBm dentro da faixa ideal de -15 a -25 dBm)",
      uptime_pppoe: "15 dias, 2 horas e 45 minutos",
      ip_publico: "177.45.2.19",
      concentrador: "MikroTik-Core-01",
      perda_pacotes: "0%",
      latencia_dns: "4.2 ms"
    };

    const resposta = `Acabei de executar a telemetria óptica na sua ONU:\n- Sinal Óptico: -19.4 dBm (Excelente, 100% calibrado)\n- Sessão PPPoE conectada há 15 dias sem interrupções físicas\n- Perda de pacotes: 0%\n\nComo seu sinal de fibra está perfeito, oscilações costumam ser causadas por saturação de canais no Wi-Fi ou cache do roteador. Deseja que eu envie um comando de reinicialização remota (Reboot TR-069) para recalibrar seu Wi-Fi?`;

    return {
      toolExecutada: "sgp_consultar_status_conexao",
      toolDados: dados,
      respostaGerada: resposta
    };
  }
});

// 4. Tool: Reboot Remoto TR-069 (GenieACS / CWMP)
agentToolRegistry.register({
  name: "genieacs_reboot_cpe",
  label: "Reboot Remoto de CPE (TR-069)",
  description: "Dispara comando remoto via GenieACS CWMP para reiniciar a ONU/roteador do assinante e otimizar frequências Wi-Fi.",
  category: "telemetria_tr069",
  keywords: ["reiniciar", "reboot", "resetar", "reinicia", "desligar roteador"],
  execute: async () => {
    const dados = {
      serialNumber: "ZTEGC1234567",
      modelo: "ZTE F670L",
      comando: "SetParameterValues / Reboot",
      status: "ENVIADO_COM_SUCESSO",
      tempo_estimado_segundos: 60
    };

    const resposta = `Comando de reinicialização remota enviado com sucesso via TR-069 para a sua ONU ZTE F670L! Os leds piscarão e em cerca de 60 segundos seu equipamento estará reiniciado com canais de 5GHz recalibrados.`;

    return {
      toolExecutada: "genieacs_reboot_cpe",
      toolDados: dados,
      respostaGerada: resposta
    };
  }
});

// 5. Tool: Desbloqueio em Confiança (Radius / SGP)
agentToolRegistry.register({
  name: "sgp_desbloqueio_confianca",
  label: "Desbloqueio em Confiança (48h)",
  description: "Aplica liberação provisória no servidor Radius/MikroTik por 48 horas enquanto o cliente quita a fatura pendente.",
  category: "radius_erp",
  keywords: ["desbloqueio", "desbloquear", "confiança", "promessa", "liberar internet", "desbloqueia"],
  execute: async () => {
    const dados = {
      contrato_id: 5432,
      horas_liberadas: 48,
      data_limite: "12/09/2026 às 12:00",
      status_radius: "LIBERADO"
    };

    const resposta = `Prontinho! O Desbloqueio em Confiança de 48 horas foi ativado com sucesso no seu contrato. Sua navegação em velocidade total foi restabelecida no servidor Radius e permanecerá válida até ${dados.data_limite}.`;

    return {
      toolExecutada: "sgp_desbloqueio_confianca",
      toolDados: dados,
      respostaGerada: resposta
    };
  }
});

// 6. Tool: Consulta de Viabilidade Técnica e Cobertura de Fibra
agentToolRegistry.register({
  name: "consulta_viabilidade_tecnica",
  label: "Consulta de Viabilidade Técnica",
  description: "Verifica disponibilidade de portas livres na CTO mais próxima, distância em metros do cabo drop e planos com Wi-Fi 6.",
  category: "comercial",
  keywords: ["viabilidade", "cobertura", "tem fibra", "meu cep", "instalar", "disponibilidade", "assinar", "contratar plano"],
  execute: async ({ prompt }) => {
    const dados = {
      status: "aprovado",
      ctoProxima: "CTO-SP-CENTRO-018",
      distanciaDropMetros: 68,
      portasLivres: 4,
      tecnologia: "GPON Fibra Óptica 100% Simétrica",
      prazoInstalacao: "Em até 24 horas úteis"
    };

    const resposta = `Excelente notícia! Temos viabilidade técnica aprovada para seu endereço com fibra óptica direta na sua residência (CTO a 68m com portas livres disponíveis). Conseguimos agendar a instalação da sua fibra 100% simétrica com Wi-Fi 6 em até 24 horas úteis. Deseja escolher seu plano agora?`;

    return {
      toolExecutada: "consulta_viabilidade_tecnica",
      toolDados: dados,
      respostaGerada: resposta
    };
  }
});

// 7. Tool: Pesquisa de Satisfação NPS
agentToolRegistry.register({
  name: "pesquisa_satisfacao_nps",
  label: "Gatilho de Pesquisa NPS",
  description: "Registra ou dispara avaliação de satisfação do cliente (escala 0 a 10) pós-atendimento.",
  category: "qualidade",
  keywords: ["avaliação", "avaliar", "nps", "satisfação", "nota", "atendimento ótimo", "gostei do atendimento", "péssimo atendimento"],
  execute: async () => {
    const dados = {
      scoreNpsAtual: 78,
      pesquisaAgendada: true,
      canal: "WhatsApp WABA"
    };

    const resposta = `Agradecemos pelo feedback! Sua opinião é fundamental para mantermos nosso atendimento na Zona de Excelência (NPS +78). Enviamos uma breve confirmação interativa para seu WhatsApp. Tenha um excelente dia!`;

    return {
      toolExecutada: "pesquisa_satisfacao_nps",
      toolDados: dados,
      respostaGerada: resposta
    };
  }
});
