import React, { useState } from 'react'

export default function CommunityForm(){
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e){
    e.preventDefault()
    // for now, store in localStorage as requested
    const entries = JSON.parse(localStorage.getItem('dux_suggestions') || '[]')
    entries.unshift({name: name || 'Anónimo', message: msg, date: new Date().toISOString()})
    localStorage.setItem('dux_suggestions', JSON.stringify(entries))
    setName('')
    setMsg('')
    setSent(true)
    setTimeout(()=>setSent(false), 2800)
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/6 text-white" />
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Mensagem" rows={5} className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/6 text-white" />
        <div className="flex items-center justify-end gap-3">
          <button type="submit" className="px-4 py-2 rounded-full bg-gradient-to-r from-dux-yellow/95 to-dux-yellow/70 text-black font-semibold">Enviar</button>
        </div>
        {sent && <div className="text-sm text-dux-yellow">Sugestão guardada localmente — obrigado!</div>}
      </div>
    </form>
  )
}
