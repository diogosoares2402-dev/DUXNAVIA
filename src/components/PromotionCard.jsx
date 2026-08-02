import React from 'react'
import { motion } from 'framer-motion'

export default function PromotionCard({title, subtitle}){
  return (
    <motion.div whileHover={{ y:-6 }} className="glass p-6 rounded-2xl border border-white/5 text-center">
      <div className="text-2xl font-extrabold text-dux-yellow">{title}</div>
      <div className="text-sm text-gray-200 mt-2">{subtitle}</div>
      <div className="mt-4">
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-dux-yellow/95 to-dux-yellow/70 text-black font-semibold">Saber Mais</button>
      </div>
    </motion.div>
  )
}
