'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface TopBarProps {
  email?: string
  isAdmin?: boolean
}

export default function TopBar({ email, isAdmin }: TopBarProps) {
  const router = useRouter()

  async function handleLogout() {
    const sb = createClient()
    await sb.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-6 border-b" style={{
      background: 'var(--surface)', borderColor: 'var(--border)', height: '58px'
    }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--text)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/></svg>
        </div>
        <div>
          <span className="text-sm font-semibold tracking-tight" style={{color:'var(--text)'}}>FLY Imob</span>
          <span className="text-sm ml-1" style={{color:'var(--text-muted)'}}>· Controle Financeiro 2026</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isAdmin && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{background:'var(--amber-bg)', color:'var(--amber)'}}>
            Admin
          </span>
        )}
        <span className="text-xs hidden sm:block" style={{color:'var(--text-faint)'}}>{email}</span>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:opacity-70"
          style={{borderColor:'var(--border)', color:'var(--text-muted)'}}
        >
          Sair
        </button>
      </div>
    </div>
  )
}
