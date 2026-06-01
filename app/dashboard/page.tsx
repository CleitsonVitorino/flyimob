'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { MESES, MesData, DESPESAS_BASE, INVESTIMENTOS_BASE, CATS, DESP_FIXA_MIN, fmt, pct } from '@/lib/data'
import TopBar from '@/components/TopBar'
import KpiCard from '@/components/KpiCard'
import TabVisaoGeral from '@/components/TabVisaoGeral'
import TabDespesas from '@/components/TabDespesas'
import TabMensal from '@/components/TabMensal'
import TabEmergencia from '@/components/TabEmergencia'
import TabAdmin from '@/components/TabAdmin'

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('visao-geral')
  const [meses, setMeses] = useState<MesData[]>([])
  const [loading, setLoading] = useState(true)

  // Build full 12-month array merging DB data with base defaults
  const buildRows = useCallback((dbRows: MesData[]): MesData[] => {
    return Array.from({length: 12}, (_, i) => {
      const mes = i + 1
      const db = dbRows.find(r => r.mes === mes)
      return {
        ano: 2026, mes,
        imob_liquido: db?.imob_liquido ?? 0,
        despesas: db?.despesas ?? DESPESAS_BASE[mes] ?? 0,
        investimentos: db?.investimentos ?? INVESTIMENTOS_BASE[mes] ?? 0,
        notas: db?.notas ?? '',
        id: db?.id,
      }
    })
  }, [])

  useEffect(() => {
    const sb = createClient()
    sb.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/login'); return }
      const email = data.session.user.email || ''
      setUserEmail(email)
      setIsAdmin(email === process.env.NEXT_PUBLIC_ADMIN_EMAIL)

      // Fetch data from Supabase
      const { data: rows } = await sb
        .from('financeiro_2026')
        .select('*')
        .eq('ano', 2026)
        .order('mes')
      setMeses(buildRows((rows as MesData[]) || []))
      setLoading(false)
    })
  }, [router, buildRows])

  const reload = useCallback(async () => {
    const sb = createClient()
    const { data: rows } = await sb
      .from('financeiro_2026')
      .select('*')
      .eq('ano', 2026)
      .order('mes')
    setMeses(buildRows((rows as MesData[]) || []))
  }, [buildRows])

  // KPI calculations
  const mesesComImob = meses.filter(m => m.imob_liquido > 0)
  const totalImob    = meses.reduce((a, m) => a + m.imob_liquido, 0)
  const totalDesp    = mesesComImob.reduce((a, m) => a + m.despesas, 0)
  const saldo        = totalImob - totalDesp
  const avgDesp      = meses.filter(m => m.despesas > 0).reduce((a,m,_,arr) => a + m.despesas/arr.length, 0) || 1
  const lastInvest   = [...meses].reverse().find(m => m.investimentos > 0)?.investimentos || 0
  const mesesReserva = lastInvest / avgDesp

  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral' },
    { id: 'despesas',    label: 'Despesas' },
    { id: 'mensal',      label: 'Por Mês' },
    { id: 'emergencia',  label: '⚡ Reserva', emerg: true },
    ...(isAdmin ? [{ id: 'admin', label: '✏ Lançar Dados', emerg: false }] : []),
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'var(--bg)'}}>
      <p className="text-sm" style={{color:'var(--text-faint)'}}>Carregando dados...</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{background:'var(--bg)'}}>
      <TopBar email={userEmail} isAdmin={isAdmin} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Info banner */}
        <div className="rounded-lg px-4 py-3 mb-6 text-xs leading-relaxed border"
          style={{background:'var(--blue-bg)', borderColor:'#b5d4f4', color:'var(--blue)'}}>
          <strong>Como ler este dashboard:</strong> A <strong>Receita da Empresa</strong> é o <strong>Imob Líquido</strong> — o que entra no caixa após dividir comissões com corretores e sócios. O faturamento bruto não está incluído pois não transita pelo caixa.
        </div>

        {/* KPIs */}
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{color:'var(--text-faint)'}}>
          Indicadores do Ano — base: Imob Líquido vs Despesas
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <KpiCard label="Imob Líquido (Caixa)" value={fmt(totalImob)} sub={`${mesesComImob.length} meses lançados`} accent="green" />
          <KpiCard label="Despesas" value={fmt(totalDesp)} sub={`Meses c/ receita`} accent="red" />
          <KpiCard label="Saldo Operacional" value={fmt(saldo)} sub="Imob − despesas" accent="blue" valueColor={saldo >= 0 ? 'var(--green)' : 'var(--red)'} />
          <KpiCard label="Despesa Média/Mês" value={fmt(Math.round(avgDesp))} sub="Base p/ reserva" accent="amber" />
          <KpiCard label="Investimentos" value={fmt(lastInvest)} sub="Último registrado" accent="blue" />
          <KpiCard label="Reserva Emergência" value={mesesReserva.toFixed(1)} sub="meses de cobertura" accent="orange"
            valueColor={mesesReserva >= 3 ? 'var(--green)' : mesesReserva >= 1 ? 'var(--amber)' : 'var(--red)'} />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 p-1.5 rounded-xl mb-6 shadow-sm border w-fit"
          style={{background:'var(--surface)', borderColor:'var(--border)'}}>
          {tabs.map(t => (
            <button key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`tab-btn px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === t.id ? (t.emerg ? 'active-emerg' : 'active') : ''}`}
              style={{color: activeTab === t.id ? undefined : 'var(--text-muted)'}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'visao-geral' && <TabVisaoGeral meses={meses} />}
        {activeTab === 'despesas'    && <TabDespesas />}
        {activeTab === 'mensal'      && <TabMensal meses={meses} />}
        {activeTab === 'emergencia'  && <TabEmergencia meses={meses} avgDesp={avgDesp} lastInvest={lastInvest} />}
        {activeTab === 'admin' && isAdmin && <TabAdmin meses={meses} onSaved={reload} />}

      </div>

      <footer className="text-center text-xs pb-8 pt-4 border-t" style={{color:'var(--text-faint)', borderColor:'var(--border)'}}>
        FLY Imob · Dashboard Financeiro 2026 · Uso interno dos Sócios
      </footer>
    </div>
  )
}
