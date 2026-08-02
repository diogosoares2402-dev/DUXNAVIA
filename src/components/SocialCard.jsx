import React from 'react'
import { motion } from 'framer-motion'

export default function SocialCard({icon, name, desc, href}){
  return (
    <motion.article whileHover={{ y:-6 }} className="glass p-6 rounded-2xl shadow-md border border-white/4 flex flex-col justify-between">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-md bg-white/6 flex items-center justify-center text-dux-yellow font-bold">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-dux-yellow">{name}</h3>
          <p className="text-sm text-gray-200 mt-1">{desc}</p>
        </div>
      </div>

      <div className="mt-6">
        <a href={href} className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-dux-yellow/95 to-dux-yellow/70 text-black font-semibold text-sm">Visitar</a>
      </div>
    </motion.article>
  )
}
