import React from 'react'

export default function Footer(){
  return (
    <footer className="mt-12 border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-2xl font-bold text-dux-yellow">DUXNAVIA</div>
          <div className="text-sm text-gray-300 mt-2">+18 · Jogo Responsável</div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="text-sm text-gray-400">Copyright © {new Date().getFullYear()} DUXNAVIA</div>
          <div className="text-sm text-gray-400 mt-2">Redes: IG · TW · YT · DC (placeholders)</div>
        </div>

        <div className="flex gap-3">
          <div className="w-9 h-9 bg-white/6 rounded-full flex items-center justify-center">IG</div>
          <div className="w-9 h-9 bg-white/6 rounded-full flex items-center justify-center">TW</div>
          <div className="w-9 h-9 bg-white/6 rounded-full flex items-center justify-center">YT</div>
        </div>
      </div>
    </footer>
  )
}
