'use client'
import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { MesData, MESES, fmt, pct } from '@/lib/data'
Chart.register(...registerables)

export default function TabVisaoGeral({ meses }: { meses: MesData[] }) {
  const refImob  = useRef<HTMLCanvasElement>(null)
  const refDesp  = useRef<HTMLCanvasElement>(null)
  const refComp  = useRef<HTMLCanvasElement>(null)
  const charts   = useRef<Chart[]>([])

  useEffect(() => {
    charts.current.forEach(c => c.destroy())
    charts.current = []

    const gc = 'rgba(0,0,0,0.05)', tc = '#aaa'
    const bsc = {
      x: { grid:{color:gc}, ticks:{color:tc, font:{size:11, family:"'DM Sans'"}}},
      y: { grid:{color:gc}, ticks:{color:tc, font:{size:11, family:"'DM Sans'"}, callback: (v: number|string) => 'R$'+((+v)>=1000?((+v)/1000).toFixed(0)+'k':v)}}
    }
    const tt = (label: string) => ({ callbacks: { label: (ctx: {parsed:{y:number}}) => `${label}: ${fmt(ctx.parsed.y)}` }})

    if (refImob.current) charts.current.push(new Chart(refImob.current, {
      type: 'bar',
      data: { labels: MESES, datasets: [{ data: meses.map(m => m.imob_liquido), backgroundColor: meses.map(m => m.imob_liquido > 0 ? '#2ea870' : '#e0ddd5'), borderRadius: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.parsed.y > 0 ? fmt(ctx.parsed.y) : 'Não lançado' }}}, scales: bsc as never }
    }))

    if (refDesp.current) charts.current.push(new Chart(refDesp.current, {
      type: 'bar',
      data: { labels: MESES, datasets: [{ data: meses.map(m => m.despesas), backgroundColor: '#e05050aa', borderRadius: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tt('Despesas') }, scales: bsc as never }
    }))

    const saldos = meses.map(m => m.imob_liquido > 0 ? m.imob_liquido - m.despesas : null)
    if (refComp.current) charts.current.push(new Chart(refComp.current, {
      type: 'bar',
      data: { labels: MESES, datasets: [
        { label: 'Imob Líquido', data: meses.map(m => m.imob_liquido), backgroundColor: '#2ea87066', borderColor: '#2ea870', borderWidth: 1.5, borderRadius: 3 },
        { label: 'Despesas',    data: meses.map(m => m.despesas),      backgroundColor: '#e0505066', borderColor: '#e05050', borderWidth: 1.5, borderRadius: 3 },
        { label: 'Saldo',       data: saldos, type: 'line', borderColor: '#4a9de8', backgroundColor: '#4a9de815', tension: 0.4, pointRadius: 5, pointBackgroundColor: '#4a9de8', spanGaps: false, fill: true } as never
      ]},
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.parsed.y)}` }}}, scales: bsc as never }
    }))

    return () => { charts.current.forEach(c => c.destroy()); charts.current = [] }
  }, [meses])

  const mesesComImob = meses.filter(m => m.imob_liquido > 0)
  const totImob = meses.reduce((a,m) => a + m.imob_liquido, 0)
  const totDesp = mesesComImob.reduce((a,m) => a + m.despesas, 0)
  const totSaldo = totImob - totDesp
  const totMg = totImob > 0 ? totSaldo / totImob * 100 : 0

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-6 shadow-sm border" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{color:'var(--text-muted)'}}>Imob Líquido Mensal</div>
          <div className="flex gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs" style={{color:'var(--text-muted)'}}><div className="w-2.5 h-2.5 rounded-sm" style={{background:'#2ea870'}}></div>Lançado</div>
            <div className="flex items-center gap-2 text-xs" style={{color:'var(--text-muted)'}}><div className="w-2.5 h-2.5 rounded-sm" style={{background:'#e0ddd5'}}></div>Pendente</div>
          </div>
          <div className="relative h-48"><canvas ref={refImob} /></div>
        </div>
        <div className="rounded-xl p-6 shadow-sm border" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{color:'var(--text-muted)'}}>Despesas Mensais</div>
          <div className="relative h-48"><canvas ref={refDesp} /></div>
        </div>
      </div>

      <div className="rounded-xl p-6 shadow-sm border mb-4" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{color:'var(--text-muted)'}}>Imob Líquido vs Despesas — Saldo Operacional</div>
        <div className="flex gap-4 mb-4 flex-wrap">
          {[['#2ea870','Imob Líquido'],['#e05050','Despesas'],['#4a9de8','Saldo']].map(([c,l]) => (
            <div key={l} className="flex items-center gap-2 text-xs" style={{color:'var(--text-muted)'}}><div className="w-2.5 h-2.5 rounded-sm" style={{background:c}}></div>{l}</div>
          ))}
        </div>
        <div className="relative h-64"><canvas ref={refComp} /></div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-sm border overflow-hidden" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
        <div className="px-6 pt-5 pb-3 text-xs font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)'}}>Resumo por Mês</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{borderBottom:'1px solid var(--border)'}}>
                {['Mês','Imob Líquido','Despesas','Saldo','Margem'].map((h,i) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{color:'var(--text-faint)', textAlign: i > 0 ? 'right' : 'left'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meses.map((m, i) => {
                const hasImob = m.imob_liquido > 0
                const saldo = hasImob ? m.imob_liquido - m.despesas : null
                const mg = hasImob && m.imob_liquido > 0 ? ((m.imob_liquido - m.despesas) / m.imob_liquido * 100) : null
                return (
                  <tr key={i} className="border-b hover:bg-gray-50/50 transition-colors" style={{borderColor:'var(--border)'}}>
                    <td className="px-4 py-2.5 font-medium">{MESES[i]}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs" style={{color: hasImob ? 'var(--green)' : 'var(--text-faint)', fontStyle: hasImob ? 'normal' : 'italic'}}>
                      {hasImob ? fmt(m.imob_liquido) : 'aguardando'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs" style={{color:'var(--red)'}}>{fmt(m.despesas)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs font-medium" style={{color: saldo === null ? 'var(--text-faint)' : saldo >= 0 ? 'var(--green)' : 'var(--red)'}}>
                      {saldo === null ? '—' : fmt(saldo)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs" style={{color: mg === null ? 'var(--text-faint)' : mg >= 50 ? 'var(--green)' : mg >= 20 ? 'var(--amber)' : 'var(--red)'}}>
                      {mg === null ? '—' : pct(mg)}
                    </td>
                  </tr>
                )
              })}
              <tr style={{background:'var(--surface2)'}}>
                <td className="px-4 py-2.5 font-semibold text-sm">Total lançado</td>
                <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold" style={{color:'var(--green)'}}>{fmt(totImob)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold" style={{color:'var(--red)'}}>{fmt(totDesp)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold" style={{color: totSaldo >= 0 ? 'var(--green)' : 'var(--red)'}}>{fmt(totSaldo)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold">{pct(totMg)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
