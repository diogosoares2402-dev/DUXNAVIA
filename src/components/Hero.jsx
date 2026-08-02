import React from 'react'
import { motion } from 'framer-motion'
import Button from './Button'

export default function Hero(){
  const container = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.09, ease: 'easeOut' } }
  }
  const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }

  return (
    <header className="min-h-[88vh] flex items-center justify-center px-6 relative">
      <motion.div variants={container} initial="hidden" animate="show" className="text-center max-w-5xl w-full z-20">
        <motion.p variants={item} className="mb-4 text-sm md:text-base tracking-widest text-gray-300 uppercase">BEM-VINDO AO MELHOR SITE DA TUGA</motion.p>
        <motion.h1 variants={item} className="text-6xl md:text-[7.5rem] font-extrabold leading-tight neon-title drop-shadow-2xl">DUXNAVIA</motion.h1>
        <motion.p variants={item} className="mt-6 text-lg md:text-2xl text-gray-200">Streamer de Casino • Slots • Bónus • Comunidade</motion.p>

        <motion.div variants={item} className="mt-10 flex items-center justify-center gap-6">
          <Button variant="primary" onClick={() => {
            const el = document.getElementById('redes')
            if(el) el.scrollIntoView({behavior:'smooth', block:'start'})
          }}>
            COMEÇAR
          </Button>

          <a href="#parcerias" className="hidden md:inline-flex items-center px-5 py-3 rounded-full border border-white/6 text-sm text-gray-200 hover:text-dux-yellow transition">Ver Parcerias</a>
        </motion.div>
      </motion.div>

      {/* subtle vignette glow edges */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
      </div>
    </header>
  )
}
