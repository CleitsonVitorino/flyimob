'use client'
import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { CATS, fmt } from '@/lib/data'
Chart.register(...registerables)

export default function TabDespesas() {
  const refPizza = useRef<HTMLCanvasElement>(null)
  const refTop   = useRef<HTMLCanvasElement>(null)
  const charts   = useRef<Chart[]>([])

  const totalAnual = CATS.reduce((a,c) => a + c.itens.reduce((s,i) => s+i.anual, 0), 0)

  useEffect(() => {
    charts.current.forEach(c => c.destroy())
    charts.current = []

    if (refPizza.current) charts.current.push(new Chart(refPizza.current, {
      type: 'doughnut',
      data: {
        labels: CATS.map(c => c.nome),
        datasets: [{ data: CATS.map(c => c.itens.reduce((s,i)=>s+i.anual,0)), backgroundColor: CATS.map(c => c.cor), borderWidth: 2, borderColor: '#fff' }]
      },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { font: { size: 11, family: "'DM Sans'" }, color: '#666', boxWidth: 12, padding: 10 }},
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${fmt(ctx.parsed as number)} (${((ctx.parsed as number)/totalAnual*100).toFixed(1)}%)` }}
        }
      }
    }))

    const top = CATS.flatMap(c => c.itens).sort((a,b) => b.anual - a.anual).slice(0,10)
    const gc = 'rgba(0,0,0,0.05)', tc = '#aaa'
    if (refTop.current) charts.current.push(new Chart(refTop.current, {
      type: 'bar', indexAxis: 'y' as const,
      data: { labels: top.map(i => i.nome), datasets: [{ data: top.map(i => i.anual), backgroundColor: '#4a9de8aa', borderColor: '#4a9de8', borderWidth: 1, borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmt(ctx.parsed.x) }}},
        scales: {
          x: { grid:{color:gc}, ticks:{color:tc, font:{size:10}, callback:(v)=>'R$'+((+v)/1000).toFixed(0)+'k'}},
          y: { grid:{display:false}, ticks:{color:tc, font:{size:11, family:"'DM Sans'"}}}
        }
      }
    }))

    return () => { charts.current.forEach(c => c.destroy()); charts.current = [] }
  }, [totalAnual])

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-6 shadow-sm border" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{color:'var(--text-muted)'}}>Composição das Despesas Anuais</div>
          <div className="relative h-64"><canvas ref={refPizza} /></div>
        </div>
        <div className="rounded-xl p-6 shadow-sm border" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{color:'var(--text-muted)'}}>Top 10 Itens de Despesa</div>
          <div className="relative h-64"><canvas ref={refTop} /></div>
        </div>
      </div>

      <div className="rounded-xl shadow-sm border overflow-hidden" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
        <div className="px-6 pt-5 pb-3 text-xs font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)'}}>Detalhamento por Categoria</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{borderBottom:'1px solid var(--border)'}}>
                {['Item','Anual (R$)','% do total','Média/mês'].map((h,i) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{color:'var(--text-faint)', textAlign: i===0?'left':'right'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATS.map(cat => {
                const ct = cat.itens.reduce((s,i) => s+i.anual, 0)
                return [
                  <tr key={`sec-${cat.nome}`} style={{background:'var(--surface2)'}}>
                    <td colSpan={4} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border-l-2" style={{color:'var(--text-faint)', borderLeftColor: cat.cor}}>
                      {cat.nome} — R$ {ct.toLocaleString('pt-BR')}
                    </td>
                  </tr>,
                  ...cat.itens.map(item => (
                    <tr key={item.nome} className="border-b hover:bg-gray-50/50" style={{borderColor:'var(--border)'}}>
                      <td className="px-4 py-2 pl-8 text-sm" style={{color:'var(--text-muted)'}}>{item.nome}</td>
                      <td className="px-4 py-2 text-right font-mono text-xs">{fmt(item.anual)}</td>
                      <td className="px-4 py-2 text-right font-mono text-xs" style={{color:'var(--text-faint)'}}>{(item.anual/totalAnual*100).toFixed(1)}%</td>
                      <td className="px-4 py-2 text-right font-mono text-xs" style={{color:'var(--text-faint)'}}>{fmt(item.mensal)}</td>
                    </tr>
                  )),
                  <tr key={`tot-${cat.nome}`} style={{background:'var(--surface2)'}}>
                    <td className="px-4 py-2.5 font-semibold text-sm">Subtotal {cat.nome}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold">{fmt(ct)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{(ct/totalAnual*100).toFixed(1)}%</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{fmt(ct/12)}</td>
                  </tr>
                ]
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
