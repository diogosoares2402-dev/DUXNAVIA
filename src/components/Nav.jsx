import React from 'react'

export default function Nav(){
  const links = [
    {id:'home', label:'Home'},
    {id:'redes', label:'Redes'},
    {id:'parcerias', label:'Parcerias'},
    {id:'promocoes', label:'Promoções'},
    {id:'lives', label:'Lives'},
    {id:'comunidade', label:'Comunidade'}
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-40 bg-black/30 backdrop-blur-sm glass border-b border-white/3">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-extrabold tracking-widest text-dux-yellow">DUXNAVIA</div>
        <ul className="hidden md:flex items-center gap-6 text-sm text-gray-200">
          {links.map(l => (
            <li key={l.id}><a className="hover:text-dux-yellow transition" href={`#${l.id}`}>{l.label}</a></li>
          ))}
        </ul>

        <div className="md:hidden text-gray-200">{/* mobile menu placeholder */}
          <button aria-label="Abrir menu" className="p-2 rounded-md border border-white/6">☰</button>
        </div>
      </div>
    </nav>
  )
}
