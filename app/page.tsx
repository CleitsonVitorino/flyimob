'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const sb = createClient()
    sb.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
      else router.replace('/login')
    })
  }, [router])
  return <div className="min-h-screen flex items-center justify-center" style={{background:'var(--bg)'}}>
    <div className="text-sm" style={{color:'var(--text-faint)'}}>Carregando...</div>
  </div>
}
