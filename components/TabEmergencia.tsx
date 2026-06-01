'use client'
import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import { MesData, MESES, DESP_FIXA_MIN, fmt } from '@/lib/data'
Chart.register(...registerables)

interface Props { meses: MesData[]; avgDesp: number; lastInvest: number }

export default function TabEmergencia({ meses, avgDesp, lastInvest }: Props) {
  const refInvest = useRef<HTMLCanvasElement>(null)
  const chartRef  = useRef<Chart | null>(null)
  const [slider, setSlider] = useState(3)

  const mTot  = lastInvest / avgDesp
  const mFixa = lastInvest / DESP_FIXA_MIN
  const meta  = avgDesp * slider
  const atingido = lastInvest >= meta
  const diff  = Math.abs(meta - lastInvest)
  const pctA  = Math.min(100, lastInvest / meta * 100)

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy()
    if (!refInvest.current) return
    const gc = 'rgba(0,0,0,0.05)', tc = '#aaa'
    chartRef.current = new Chart(refInvest.current, {
      type: 'bar',
      data: { labels: MESES, datasets: [{ data: meses.map(m => m.investimentos), backgroundColor: meses.map(m => m.investimentos > 0 ? '#4a9de8aa' : 'transparent'), borderColor: '#4a9de8', borderWidth: 1, borderRadius: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend:{display:false}, tooltip:{callbacks:{label:(ctx)=>fmt(ctx.parsed.y)}}},
        scales: { x:{grid:{color:gc},ticks:{color:tc,font:{size:11,family:"'DM Sans'"}}}, y:{grid:{color:gc},ticks:{color:tc,font:{size:11,family:"'DM Sans'"},callback:(v)=>'R$'+((+v)/1000).toFixed(0)+'k'}} }
      }
    })
    return () => { chartRef.current?.destroy() }
  }, [meses])

  const statusColor = (v: number) => v >= 3 ? 'var(--green)' : v >= 1 ? 'var(--amber)' : 'var(--red)'
  const statusLabel = (v: number) => v >= 6 ? '✓ Excelente' : v >= 3 ? '▲ Adequado' : v >= 1 ? '⚠ Atenção' : '✕ Crítico'

  return (
    <div>
      {/* Hero */}
      <div className="rounded-xl p-7 mb-6 border relative overflow-hidden" style={{background:'#fff7f0',borderColor:'#f0c896'}}>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-[0.07] select-none">⚡</div>
        <h2 className="text-xl font-semibold mb-2" style={{color:'#7a3800'}}>Reserva de Emergência</h2>
        <p className="text-sm leading-relaxed max-w-2xl" style={{color:'#a05020'}}>
          Análise de quanto tempo a empresa opera com os recursos disponíveis caso o Imob Líquido pare de entrar. Base: <strong>média real das despesas mensais de 2026</strong> e investimentos de junho.
        </p>
      </div>

      {/* Meters */}
      <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{color:'var(--text-faint)'}}>
        Situação atual — Investimentos Jun/26: {fmt(lastInvest)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          {label:'Cobertura (despesa média)', val: mTot, base:`Base: ${fmt(Math.round(avgDesp))}/mês`},
          {label:'Só estrutura fixa', val: mFixa, base:`Base: ${fmt(DESP_FIXA_MIN)}/mês (sem marketing)`},
          {label:'Reserva disponível', val: null as number|null, display: fmt(lastInvest), base:'Sicredi + C6 (jun/26)'},
        ].map(m => (
          <div key={m.label} className="rounded-xl p-5 shadow-sm border" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-faint)'}}>{m.label}</div>
            <div className="text-4xl font-bold tracking-tight leading-none mb-1" style={{color: m.val !== null ? statusColor(m.val) : '#4a9de8'}}>
              {m.val !== null ? m.val.toFixed(1) : m.display}
              {m.val !== null && <span className="text-sm font-normal ml-1" style={{color:'var(--text-muted)'}}>meses</span>}
            </div>
            {m.val !== null && <>
              <div className="h-2 rounded-full overflow-hidden my-2.5" style={{background:'var(--surface2)'}}>
                <div className="h-full rounded-full" style={{width:`${Math.min(100,m.val/6*100)}%`, background: statusColor(m.val)}} />
              </div>
              <div className="text-xs font-semibold" style={{color: statusColor(m.val)}}>{statusLabel(m.val)}</div>
            </>}
            <div className="text-xs mt-2" style={{color:'var(--text-faint)'}}>{m.base}</div>
          </div>
        ))}
      </div>

      {/* Scenarios */}
      <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{color:'var(--text-faint)'}}>Cenários</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          {type:'info', label:'Situação atual (Jun/26)', months:mTot.toFixed(1), desc:`${fmt(lastInvest)} ÷ ${fmt(Math.round(avgDesp))}/mês`},
          {type: mFixa>=3?'good':mFixa>=1?'warn':'bad', label:'Só estrutura fixa', months:mFixa.toFixed(1), desc:`${fmt(DESP_FIXA_MIN)}/mês (sem marketing)`},
          {type:'warn', label:'Meta 3 meses', months:'3.0', desc: lastInvest >= avgDesp*3 ? '✓ Já atingido!' : `Faltam ${fmt(Math.round(avgDesp*3-lastInvest))}`},
          {type:'good', label:'Meta 6 meses', months:'6.0', desc: lastInvest >= avgDesp*6 ? '✓ Já atingido!' : `Faltam ${fmt(Math.round(avgDesp*6-lastInvest))}`},
        ].map(s => {
          const colorMap: Record<string,string> = {good:'#1a7a55',warn:'#8a5a00',bad:'#b83030',info:'#1a5fa8'}
          const borderMap: Record<string,string> = {good:'#2ea870',warn:'#d4930a',bad:'#e05050',info:'#4a9de8'}
          return (
            <div key={s.label} className="rounded-xl p-4 shadow-sm border-l-4" style={{background:'var(--surface)', borderLeftColor: borderMap[s.type]}}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color: colorMap[s.type]}}>{s.label}</div>
              <div className="text-2xl font-bold tracking-tight" style={{color: colorMap[s.type]}}>{s.months}<span className="text-xs font-normal ml-1">meses</span></div>
              <div className="text-xs mt-1.5 leading-relaxed" style={{color:'var(--text-muted)'}}>{s.desc}</div>
            </div>
          )
        })}
      </div>

      {/* Simulator */}
      <div className="rounded-xl p-6 shadow-sm border mb-6" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:'var(--text-muted)'}}>Simulador de Reserva</div>
        <p className="text-sm mb-5" style={{color:'var(--text-muted)'}}>Defina quantos meses de reserva você quer ter e veja quanto falta guardar.</p>
        <div className="flex items-center gap-4 flex-wrap mb-5">
          <label className="text-sm" style={{color:'var(--text-muted)'}}>Meses desejados:</label>
          <input type="range" min={1} max={12} step={1} value={slider} onChange={e=>setSlider(+e.target.value)} className="flex-1 min-w-32" />
          <span className="text-base font-semibold font-mono min-w-20" style={{color:'var(--text)'}}>{slider} {slider===1?'mês':'meses'}</span>
        </div>
        <div className="rounded-lg p-5" style={{background:'var(--surface2)'}}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              {label:`Meta (${slider} ${slider===1?'mês':'meses'})`, val:fmt(Math.round(meta)), color:'var(--blue)'},
              {label:'Disponível agora', val:fmt(lastInvest), color: atingido?'var(--green)':'var(--amber)'},
              {label: atingido?'Excedente':'Falta guardar', val:fmt(Math.round(diff)), color: atingido?'var(--green)':'var(--red)'},
            ].map(s => (
              <div key={s.label}>
                <div className="text-xs mb-1" style={{color:'var(--text-faint)'}}>{s.label}</div>
                <div className="text-lg font-semibold tracking-tight" style={{color:s.color}}>{s.val}</div>
              </div>
            ))}
          </div>
          <div className="text-xs mb-1.5" style={{color:'var(--text-muted)'}}>Progresso: {pctA.toFixed(0)}% da meta</div>
          <div className="h-3 rounded-full overflow-hidden mb-2" style={{background:'var(--surface)'}}>
            <div className="h-full rounded-full transition-all duration-300" style={{width:`${pctA}%`, background: atingido?'#2ea870':'#d4930a'}} />
          </div>
          <div className="text-xs" style={{color: atingido?'var(--green)':'var(--text-muted)'}}>
            {atingido ? `✓ Meta de ${slider} ${slider===1?'mês':'meses'} atingida!`
              : `💡 Guardando ${fmt(Math.round(diff/6))}/mês você atinge a meta em 6 meses`}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {[
          {icon:'🎯',title:'Meta: 3 a 6 meses de despesas',desc:'Recomendação padrão para empresas. Cobre imprevistos, meses sem fechamento de imóvel e janelas de baixa receita.'},
          {icon:'📉',title:'Sazonalidade é o risco principal',desc:'Com Imob Líquido zerado em vários meses, a empresa depende da reserva para pagar a estrutura fixa. Jan e Fev foram os meses mais fortes.'},
          {icon:'💰',title:'Separar reserva de investimento',desc:'Mantenha a reserva em conta separada dos investimentos produtivos para não confundir capital de giro com patrimônio.'},
          {icon:'📊',title:`Despesa fixa mínima: ${fmt(DESP_FIXA_MIN)}/mês`,desc:'Mesmo zerando marketing e campanhas, essa é a estrutura mínima (aluguel, sistemas, equipe, empréstimo, INSS, limpeza).'},
        ].map(r => (
          <div key={r.title} className="rounded-xl p-5 shadow-sm border" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
            <div className="text-xl mb-2">{r.icon}</div>
            <div className="font-semibold text-sm mb-1.5">{r.title}</div>
            <div className="text-xs leading-relaxed" style={{color:'var(--text-muted)'}}>{r.desc}</div>
          </div>
        ))}
      </div>

      {/* Invest chart */}
      <div className="rounded-xl p-6 shadow-sm border" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{color:'var(--text-muted)'}}>Evolução dos Investimentos Registrados</div>
        <div className="relative h-48"><canvas ref={refInvest} /></div>
      </div>
    </div>
  )
}
