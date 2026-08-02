import React from 'react'
import { motion } from 'framer-motion'

export default function PartnershipCard({logo, name, promo}){
  return (
    <motion.div whileHover={{ scale:1.02 }} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-white/6 flex items-center justify-center font-bold text-dux-yellow">{logo}</div>
        <div>
          <div className="text-lg font-semibold text-white">{name}</div>
          <div className="text-sm text-gray-300">{promo}</div>
        </div>
      </div>

      <div>
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-dux-yellow/95 to-dux-yellow/70 text-black font-semibold">Jogar Agora</button>
      </div>
    </motion.div>
  )
}
