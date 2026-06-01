'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:'var(--bg)'}}>
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{background:'var(--text)'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/></svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight" style={{color:'var(--text)'}}>FLY Imob</h1>
          <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Controle Financeiro 2026 — Sócios</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-sm border" style={{background:'var(--surface)', borderColor:'var(--border)'}}>
          <h2 className="text-base font-semibold mb-6" style={{color:'var(--text)'}}>Entrar na sua conta</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{color:'var(--text-faint)'}}>E-mail</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all focus:ring-2 focus:ring-black/10"
                style={{background:'var(--surface2)', borderColor:'var(--border)', color:'var(--text)'}}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{color:'var(--text-faint)'}}>Senha</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-all focus:ring-2 focus:ring-black/10"
                style={{background:'var(--surface2)', borderColor:'var(--border)', color:'var(--text)'}}
              />
            </div>

            {error && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{background:'var(--red-bg)', color:'var(--red)'}}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity"
              style={{background:'var(--text)', color:'white', opacity: loading ? 0.6 : 1}}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{color:'var(--text-faint)'}}>
          Acesso restrito aos sócios · FLY Imob 2026
        </p>
      </div>
    </div>
  )
}
