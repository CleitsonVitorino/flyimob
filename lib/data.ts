export const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export type MesData = {
  id?: number
  ano: number
  mes: number        // 1-12
  imob_liquido: number
  despesas: number
  investimentos: number
  notas?: string
  updated_at?: string
}

// Despesas fixas lançadas na planilha (base 2026)
export const DESPESAS_BASE: Record<number, number> = {
  1:  26060, 2:  20140, 3:  26632, 4:  24124,
  5:  26647, 6:  18981, 7:  17379, 8:  17379,
  9:  17379, 10: 17379, 11: 17316, 12: 18574
}

// Investimentos registrados
export const INVESTIMENTOS_BASE: Record<number, number> = {
  1: 84000, 2: 120000, 6: 76962
}

export const CATS = [
  { nome:'Habitação', cor:'#2ea870', itens:[
    {nome:'Aluguel', anual:54000, mensal:4500},
    {nome:'Conta de energia', anual:8693, mensal:724},
    {nome:'Vaga aluguel', anual:3850, mensal:350},
    {nome:'Internet', anual:1679, mensal:140},
    {nome:'Seguro sala', anual:1235, mensal:103},
    {nome:'Condomínio', anual:145, mensal:12},
  ]},
  { nome:'Financeiro / Impostos', cor:'#e05050', itens:[
    {nome:'Imposto', anual:54373, mensal:4531},
    {nome:'Empréstimo Sicredi', anual:49120, mensal:3783},
    {nome:'Sicredi (outros)', anual:8706, mensal:726},
    {nome:'Cartão C6', anual:4014, mensal:335},
  ]},
  { nome:'Marketing', cor:'#e88c3a', itens:[
    {nome:'Gestor (Ede)', anual:30000, mensal:3000},
    {nome:'Campanhas', anual:21569, mensal:1797},
  ]},
  { nome:'Sistemas e Tecnologia', cor:'#9b72e8', itens:[
    {nome:'Chaves na Mão', anual:8352, mensal:696},
    {nome:'Emmovel', anual:5394, mensal:450},
    {nome:'Checkout', anual:5194, mensal:433},
    {nome:'C2S', anual:6300, mensal:525},
    {nome:'Site', anual:4197, mensal:330},
    {nome:'Bolsão', anual:1884, mensal:157},
    {nome:'CRM', anual:1764, mensal:147},
  ]},
  { nome:'Operacional / Jurídico', cor:'#4a9de8', itens:[
    {nome:'Contabilidade', anual:7116, mensal:550},
    {nome:'INSS', anual:6646, mensal:509},
    {nome:'ADV Contratos', anual:6000, mensal:562},
    {nome:'CRECI PJ', anual:1590, mensal:367},
    {nome:'Alvarás', anual:922, mensal:77},
  ]},
  { nome:'Limpeza / Operação', cor:'#888', itens:[
    {nome:'Limpeza', anual:10400, mensal:800},
  ]},
]

export const DESP_FIXA_MIN = 13500 // estrutura sem marketing

export const fmt = (v: number | null | undefined, d = 0): string => {
  if (v === null || v === undefined || isNaN(v)) return '—'
  return (v < 0 ? '-' : '') + 'R$ ' + Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })
}

export const pct = (v: number): string =>
  !isFinite(v) || isNaN(v) ? '—' : v.toFixed(1) + '%'
