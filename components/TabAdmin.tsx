'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { MesData, MESES, fmt } from '@/lib/data'

interface Props { meses: MesData[]; onSaved: () => Promise<void> }

export default function TabAdmin({ meses, onSaved }: Props) {
  const [rows, setRows] = useState<MesData[]>(meses.map(m => ({...m})))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notas, setNotas] = useState('')

  function update(i: number, field: keyof MesData, val: string) {
    const next = [...rows]
    next[i] = { ...next[i], [field]: parseFloat(val) || 0 }
    setRows(next)
  }

  async function handleSave() {
    setSaving(true)
    const sb = createClient()
    for (const row of rows) {
      const payload = { ano: 2026, mes: row.mes, imob_liquido: row.imob_liquido, despesas: row.despesas, investimentos: row.investimentos, notas: row.notas || '' }
      if (row.id) {
        await sb.from('financeiro_2026').update(payload).eq('id', row.id)
      } else {
        await sb.from('financeiro_2026').upsert({ ...payload }, { onConflict: 'ano,mes' })
      }
    }
    await onSaved()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="rounded-xl p-6 shadow-sm border mb-4" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:'var(--text-muted)'}}>Lançar Dados Mensais</div>
        <p className="text-sm mb-5 leading-relaxed" style={{color:'var(--text-muted)'}}>
          Preencha o <strong>Imob Líquido</strong> de cada mês conforme os negócios fecham. Os sócios verão os dados atualizados em tempo real após salvar.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{borderBottom:'1px solid var(--border)'}}>
                {['Mês','Imob Líquido — Receita da Empresa (R$)','Despesas (R$)','Investimentos (R$)'].map((h,i) => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{color:'var(--text-faint)', textAlign: i===0?'left':'right'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const hasImob = row.imob_liquido > 0
                return (
                  <tr key={i} className="border-b" style={{borderColor:'var(--border)'}}>
                    <td className="px-3 py-2 font-medium whitespace-nowrap">
                      {MESES[i]}
                      {!hasImob && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{background:'var(--amber-bg)',color:'var(--amber)'}}>pendente</span>}
                    </td>
                    {(['imob_liquido','despesas','investimentos'] as const).map(field => (
                      <td key={field} className="px-3 py-2">
                        <input
                          type="number" min={0} step={100}
                          value={row[field] || ''}
                          placeholder={field==='imob_liquido' ? 'Lançar...' : '0'}
                          onChange={e => update(i, field, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-sm text-right border outline-none focus:ring-2 focus:ring-black/10 font-mono"
                          style={{
                            background: field==='imob_liquido' && !hasImob ? '#fffbf0' : 'var(--surface2)',
                            borderColor: 'var(--border)', color: 'var(--text)'
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 mt-5 flex-wrap">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-opacity"
            style={{background:'var(--text)', color:'white', opacity: saving ? 0.6 : 1}}>
            {saving ? 'Salvando...' : 'Salvar e publicar para os sócios'}
          </button>
          {saved && <span className="text-sm" style={{color:'var(--green)'}}>✓ Dados publicados com sucesso!</span>}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl p-6 shadow-sm border" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color:'var(--text-muted)'}}>Notas &amp; Observações para os Sócios</div>
        <textarea
          value={notas} onChange={e=>setNotas(e.target.value)}
          placeholder="Escreva observações que aparecerão no dashboard para os sócios..."
          className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-black/10 resize-y min-h-28 leading-relaxed"
          style={{background:'var(--surface2)', borderColor:'var(--border)', color:'var(--text)', fontFamily:'inherit'}}
        />
        <p className="text-xs mt-2" style={{color:'var(--text-faint)'}}>
          Funcionalidade de notas em desenvolvimento — salve no campo acima e atualize o banco manualmente se necessário.
        </p>
      </div>
    </div>
  )
}
