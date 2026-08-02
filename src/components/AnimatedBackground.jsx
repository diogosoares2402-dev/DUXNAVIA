import React from 'react'
import { motion } from 'framer-motion'

function IconChip({className}){
  return (
    <svg className={className} viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#FFD400" />
      <circle cx="32" cy="32" r="20" fill="#050505" />
      <text x="32" y="38" textAnchor="middle" fontSize="16" fontWeight="700" fill="#FFD400">10</text>
    </svg>
  )
}

function slowAnim(i){
  const dur = 30 + (i%7)*6
  return { y: [0, -30, 0], transition: { duration: dur, repeat: Infinity, ease: 'linear' } }
}

export default function AnimatedBackground(){
  const items = new Array(10).fill(0).map((_,i)=>({id:i, left: (i*11)%100, top: (10+i*7)%100, size: 36 + (i%5)*10}))

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* soft radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />

      {items.map((it, idx) => (
        <motion.div key={it.id}
          className="absolute opacity-80"
          style={{left:`${it.left}%`, top:`${it.top}%`, width: it.size, height: it.size}}
          animate={slowAnim(idx)}
        >
          <IconChip />
        </motion.div>
      ))}

      {/* Decorative floating slot symbols and particles */}
      <motion.div className="absolute right-4 top-8 opacity-60" animate={{ y:[0,-18,0], rotate:[0,6,-6,0], transition:{ duration: 40, repeat: Infinity, ease:'linear' } }}>
        <svg width="86" height="86" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="6" width="88" height="88" rx="14" fill="#111" stroke="#FFD400" strokeOpacity="0.08"/>
          <text x="50" y="60" fontSize="36" fontWeight="900" textAnchor="middle" fill="#FFD400">7</text>
        </svg>
      </motion.div>

      {/* gentle golden particles */}
      <div className="absolute inset-0 pointer-events-none">
        {new Array(20).fill(0).map((_,i)=> (
          <motion.div key={i} className="particle rounded-full" style={{width:6, height:6, left:`${(i*13)%100}%`, top:`${(i*7)%100}%`, position:'absolute', opacity:0.7}}
            animate={{ y:[0,-10,0], opacity:[0.2,0.8,0.2], transition:{ duration: 15 + (i%5)*3, repeat: Infinity, ease:'easeInOut' } }} />
        ))}
      </div>
    </div>
  )
}
