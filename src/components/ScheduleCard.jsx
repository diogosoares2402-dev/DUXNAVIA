import React from 'react'
import { motion } from 'framer-motion'

export default function ScheduleCard({day, time, platform, status}){
  return (
    <motion.div whileHover={{ scale:1.01 }} className="glass p-5 rounded-2xl border border-white/5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white">{day} · {time}</div>
          <div className="text-sm text-gray-300 mt-1">Plataforma: <span className="text-dux-yellow font-semibold">{platform}</span></div>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${status==='Ao Vivo' ? 'bg-red-600 text-white' : 'bg-white/6 text-gray-200'}`}>{status}</div>
      </div>
    </motion.div>
  )
}
