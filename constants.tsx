
import { Encarte } from './types';

export const EDUCATIONAL_ENCARTES: Record<string, Encarte> = {
  vision: {
    id: 'vision',
    title: 'A Conexão Emocional',
    content: 'A conexão emocional é o combustível. Sem uma visão clara, você abandonará as táticas difíceis no Vale do Desespero.'
  },
  plan: {
    id: 'plan',
    title: 'A Unidade de Execução',
    content: 'O ano agora tem 12 semanas. O mês tem 1 semana. O dia tem a importância de um mês antigo. Execute o hoje.'
  },
  score: {
    id: 'score',
    title: 'Enfrente a Verdade',
    content: 'Os números não têm emoção. Eles dizem se suas ações estão alinhadas com sua visão. Não fuja da sua pontuação.'
  },
  scorecard_85: {
    id: 'scorecard_85',
    title: 'Por que 85%?',
    content: 'A excelência não é perfeição. Cumprir 85% das suas táticas garante que você atinja seus resultados sem o estresse da busca pela perfeição impossível.'
  },
  strategic_block: {
    id: 'strategic_block',
    title: 'Blindagem de Tempo',
    content: 'Três horas de foco ininterrupto produzem mais que uma semana de trabalho reativo. Proteja este bloco com sua vida.'
  }
};

export const COLORS = {
  primary: '#111827',
  secondary: '#6B7280',
  accent: '#10B981', // Emerald-500 for "metas concluídas"
  bg: '#F9FAFB',
  white: '#FFFFFF',
  border: '#E5E7EB'
};
