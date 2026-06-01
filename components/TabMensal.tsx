'use client'
import { useState } from 'react'
import { MesData, MESES, fmt, pct } from '@/lib/data'

const DETALHE: Record<number, {cat:string,itens:[string,number][]}[]> = {
  1:[{cat:'Habitação',itens:[['Aluguel',4500],['Energia',2238],['Internet',131],['Seguro sala',103],['Condomínio',70]]},{cat:'Operacional',itens:[['Contabilidade',516],['INSS',500],['CRECI PJ',367],['ADV Contratos',500]]},{cat:'Sistemas',itens:[['Checkout',428],['Emmovel',450],['Site',339],['C2S',500],['Bolsão',150],['Chaves na Mão',696]]},{cat:'Marketing',itens:[['Campanhas',5518],['CRM',597]]},{cat:'Financeiro',itens:[['Empréstimo Sicredi',3783],['Imposto',13116],['Cartão C6',3874]]},{cat:'Operação',itens:[['Limpeza',800]]}],
  2:[{cat:'Habitação',itens:[['Aluguel',4500],['Energia',1591],['Internet',131],['Vaga',350],['Seguro sala',103]]},{cat:'Operacional',itens:[['Contabilidade',550],['INSS',534],['CRECI PJ',367],['ADV Contratos',500]]},{cat:'Sistemas',itens:[['Checkout',399],['Emmovel',450],['Site',339],['C2S',500],['Bolsão',150],['Chaves na Mão',696]]},{cat:'Marketing',itens:[['Campanhas',4257]]},{cat:'Financeiro',itens:[['Empréstimo Sicredi',3783],['Imposto',32839],['Cartão C6',140]]},{cat:'Operação',itens:[['Limpeza',800]]}],
  3:[{cat:'Habitação',itens:[['Aluguel',4500],['Energia',1584],['Internet',131],['Vaga',350],['Seguro sala',103]]},{cat:'Operacional',itens:[['Contabilidade',550],['INSS',534],['CRECI PJ',367],['ADV Contratos',812],['Alvará',922]]},{cat:'Sistemas',itens:[['Checkout',399],['Emmovel',450],['Site',269],['C2S',500],['Bolsão',150],['Chaves na Mão',696],['CRM',147],['Videomaker',600]]},{cat:'Marketing',itens:[['Campanhas',3645]]},{cat:'Financeiro',itens:[['Empréstimo Sicredi',3783],['Imposto',4694],['Sicredi',2135],['Cartão C6',130]]},{cat:'Operação',itens:[['Limpeza',800],['Ede Gestor',3000]]}],
  4:[{cat:'Habitação',itens:[['Aluguel',4500],['Energia',1372],['Internet',38],['Vaga',350],['Seguro sala',103]]},{cat:'Operacional',itens:[['Contabilidade',550],['INSS',542],['CRECI PJ',367],['ADV Contratos',747]]},{cat:'Sistemas',itens:[['Checkout',399],['Emmovel',450],['Site',269],['C2S',500],['Bolsão',150],['Chaves na Mão',696],['CRM',147]]},{cat:'Marketing',itens:[['Campanhas',4419]]},{cat:'Financeiro',itens:[['Empréstimo Sicredi',3783],['Imposto',2386],['Sicredi',812],['Cartão C6',130]]},{cat:'Operação',itens:[['Limpeza',800],['Ede Gestor',3000]]}],
  5:[{cat:'Habitação',itens:[['Aluguel',4500],['Energia',1330],['Internet',200],['Vaga',350],['Seguro sala',103]]},{cat:'Operacional',itens:[['Contabilidade',550],['INSS',536],['CRECI PJ',367],['ADV Contratos',500]]},{cat:'Sistemas',itens:[['Checkout',654],['Emmovel',450],['Site',269],['C2S',500],['Bolsão',150],['Chaves na Mão',696],['CRM',147]]},{cat:'Marketing',itens:[['Campanhas',3730]]},{cat:'Financeiro',itens:[['Empréstimo Sicredi',3783],['Imposto',1338],['Sicredi',1884],['Eventos',2018],['Cartão C6',130]]},{cat:'Operação',itens:[['Limpeza',800],['Ede Gestor',3000]]}],
  6:[{cat:'Habitação',itens:[['Aluguel',4500],['Energia',578],['Internet',131],['Vaga',350],['Seguro sala',103]]},{cat:'Operacional',itens:[['Contabilidade',550],['INSS',500],['ADV Contratos',500]]},{cat:'Sistemas',itens:[['Checkout',399],['Emmovel',450],['Site',339],['C2S',525],['Bolsão',157],['Chaves na Mão',696],['CRM',147]]},{cat:'Financeiro',itens:[['Empréstimo Sicredi',3783],['Sicredi',1473]]},{cat:'Operação',itens:[['Limpeza',800],['Ede Gestor',3000]]}],
}

export default function TabMensal({ meses }: { meses: MesData[] }) {
  const [sel, setSel] = useState(0)
  const m = meses[sel]
  const hasImob = m?.imob_liquido > 0
  const saldo = hasImob ? m.imob_liquido - m.despesas : null
  const mg = hasImob && m.imob_liquido > 0 ? (saldo! / m.imob_liquido * 100) : null
  const det = DETALHE[sel + 1]

  return (
    <div>
      {/* Month nav */}
      <div className="flex flex-wrap gap-2 mb-5">
        {MESES.map((mes, i) => {
          const has = meses[i]?.imob_liquido > 0
          return (
            <button key={i} onClick={() => setSel(i)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${sel === i ? 'border-transparent' : ''} ${!has ? 'opacity-50' : ''}`}
              style={{
                background: sel === i ? 'var(--text)' : 'transparent',
                color: sel === i ? 'white' : 'var(--text-muted)',
                borderColor: sel === i ? 'var(--text)' : 'var(--border)'
              }}>
              {mes}{!has ? ' ○' : ''}
            </button>
          )
        })}
        <span className="text-xs self-center" style={{color:'var(--text-faint)'}}>○ = pendente</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          {label:'Imob Líquido', val: hasImob ? fmt(m.imob_liquido) : 'Não lançado', color: hasImob ? 'var(--green)' : 'var(--text-faint)'},
          {label:'Despesas', val: fmt(m?.despesas), color: 'var(--red)'},
          {label:'Saldo', val: saldo !== null ? fmt(saldo) : '—', color: saldo === null ? 'var(--text-faint)' : saldo >= 0 ? 'var(--green)' : 'var(--red)'},
        ].map(s => (
          <div key={s.label} className="rounded-lg p-3 sm:p-4" style={{background:'var(--surface2)'}}>
            <div className="text-xs mb-1" style={{color:'var(--text-faint)'}}>{s.label}</div>
            <div className="text-base sm:text-lg font-semibold tracking-tight" style={{color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Margin bar */}
      {mg !== null && (
        <div className="rounded-xl p-5 shadow-sm border mb-4" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
          <div className="flex justify-between text-xs mb-1.5" style={{color:'var(--text-muted)'}}>
            <span>Margem operacional</span><span className="font-semibold">{pct(mg)}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{background:'var(--surface2)'}}>
            <div className="h-full rounded-full transition-all" style={{width:`${Math.min(100,Math.max(0,mg))}%`, background: mg>=60?'#2ea870':mg>=20?'#d4930a':'#e05050'}} />
          </div>
        </div>
      )}

      {/* Detail */}
      {!hasImob && (
        <div className="rounded-lg px-4 py-3 mb-4 text-xs border" style={{background:'var(--amber-bg)',borderColor:'#f0d090',color:'var(--amber)'}}>
          ⚠️ Imob líquido de {MESES[sel]} não lançado. Despesas registradas: <strong>{fmt(m?.despesas)}</strong>. Esse valor está sendo coberto pela reserva.
        </div>
      )}

      {det ? (
        <div className="rounded-xl shadow-sm border overflow-hidden" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
          <div className="px-6 pt-5 pb-3 text-xs font-semibold uppercase tracking-wider" style={{color:'var(--text-muted)'}}>Despesas de {MESES[sel]}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{borderBottom:'1px solid var(--border)'}}>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{color:'var(--text-faint)'}}>Item</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide" style={{color:'var(--text-faint)'}}>Valor</th>
              </tr></thead>
              <tbody>
                {det.map(cat => {
                  const ct = cat.itens.filter(([,v])=>v>0).reduce((s,[,v])=>s+v,0)
                  if (!ct) return null
                  return [
                    <tr key={`s-${cat.cat}`} style={{background:'var(--surface2)'}}>
                      <td colSpan={2} className="px-4 py-2 text-xs font-semibold uppercase tracking-wide" style={{color:'var(--text-faint)'}}>{cat.cat} — {fmt(ct)}</td>
                    </tr>,
                    ...cat.itens.filter(([,v])=>v>0).map(([nome,val]) => (
                      <tr key={nome} className="border-b hover:bg-gray-50/50" style={{borderColor:'var(--border)'}}>
                        <td className="px-4 py-2 pl-8" style={{color:'var(--text-muted)'}}>{nome}</td>
                        <td className="px-4 py-2 text-right font-mono text-xs">{fmt(val)}</td>
                      </tr>
                    ))
                  ]
                })}
                <tr style={{background:'var(--surface2)'}}>
                  <td className="px-4 py-2.5 font-semibold">Total despesas</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold" style={{color:'var(--red)'}}>{fmt(m?.despesas)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-8 text-center text-sm border" style={{background:'var(--surface)',borderColor:'var(--border)',color:'var(--text-faint)'}}>
          Detalhamento item a item não disponível para {MESES[sel]}.
        </div>
      )}
    </div>
  )
}
