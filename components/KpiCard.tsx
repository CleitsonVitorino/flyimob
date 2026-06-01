interface KpiCardProps {
  label: string
  value: string
  sub?: string
  accent: 'green' | 'red' | 'blue' | 'amber' | 'orange'
  valueColor?: string
}

export default function KpiCard({ label, value, sub, accent, valueColor }: KpiCardProps) {
  const colors: Record<string, string> = {
    green: 'var(--green)', red: 'var(--red)', blue: 'var(--blue)',
    amber: 'var(--amber)', orange: 'var(--orange)'
  }
  return (
    <div className={`kpi-card kpi-${accent} rounded-xl p-5 shadow-sm border`}
      style={{background:'var(--surface)', borderColor:'var(--border)'}}>
      <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>{label}</div>
      <div className="text-2xl font-semibold tracking-tight leading-none" style={{color: valueColor || colors[accent]}}>{value}</div>
      {sub && <div className="text-xs mt-1.5" style={{color:'var(--text-faint)'}}>{sub}</div>}
    </div>
  )
}
