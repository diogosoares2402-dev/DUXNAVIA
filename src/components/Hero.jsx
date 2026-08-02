import React from 'react'
import { motion } from 'framer-motion'
import Button from './Button'

export default function Hero(){
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, ease: 'easeOut' } }
  }
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  return (
    <header className="min-h-[78vh] flex items-center justify-center px-6">
      <motion.div variants={container} initial="hidden" animate="show" className="text-center max-w-4xl w-full z-20">
        <motion.p variants={item} className="mb-4 text-sm md:text-base tracking-wide text-gray-300">BEM-VINDO AO MELHOR SITE DA TUGA</motion.p>
        <motion.h1 variants={item} className="text-5xl md:text-8xl font-black leading-tight neon-title">DUXNAVIA</motion.h1>
        <motion.p variants={item} className="mt-6 text-lg md:text-2xl text-gray-200">Streamer de Casino • Slots • Promoções • Lives</motion.p>

        <motion.div variants={item} className="mt-8 flex items-center justify-center gap-6">
          <Button variant="primary" onClick={() => {
            const el = document.getElementById('redes')
            if(el) el.scrollIntoView({behavior:'smooth', block:'start'})
          }}>
            ENTRAR
          </Button>

          <div className="hidden md:flex gap-4">
            <Button variant="outline">Ver Redes</Button>
            <Button variant="ghost">Ver Parcerias</Button>
          </div>
        </motion.div>
      </motion.div>
    </header>
  )
}
