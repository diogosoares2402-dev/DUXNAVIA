import React from 'react'
import { motion } from 'framer-motion'

function IconSymbol({type='chip', size=48}){
  // simple svg variations for different types
  if(type==='chip') return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#FFD400" />
      <circle cx="32" cy="32" r="18" fill="#050505" />
    </svg>
  )
  if(type==='card') return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="52" height="44" rx="6" fill="#111" stroke="#FFD400" strokeOpacity="0.12" />
      <text x="32" y="38" textAnchor="middle" fontSize="16" fontWeight="700" fill="#FFD400">A♠</text>
    </svg>
  )
  if(type==='dice') return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="48" height="48" rx="8" fill="#111" stroke="#FFD400" strokeOpacity="0.08"/>
      <circle cx="32" cy="32" r="4" fill="#FFD400" />
    </svg>
  )
  if(type==='coin') return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" fill="#FFD400" />
      <circle cx="32" cy="32" r="12" fill="#050505" />
    </svg>
  )
  if(type==='slot') return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="52" height="52" rx="10" fill="#111" stroke="#FFD400" strokeOpacity="0.08"/>
      <text x="32" y="40" textAnchor="middle" fontSize="24" fontWeight="900" fill="#FFD400">7</text>
    </svg>
  )
  return null
}

function floating(i){
  const dur = 28 + (i%5)*6
  const delay = (i%7)*0.7
  return { y: [0, -28, 0], rotate: [0, 6, -6, 0], transition: { duration: dur, repeat: Infinity, ease: 'linear', delay } }
}

export default function AnimatedBackground(){
  const elements = []
  const types = ['chip','card','dice','coin','slot']
  for(let i=0;i<14;i++) elements.push({id:i, type: types[i%types.length], left: (i*11)%100, top: (5 + i*9)%100, size: 36 + (i%4)*12})

  return (
    <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90" />

      {/* floating symbols */}
      {elements.map((el, idx) => (
        <motion.div key={el.id}
          className="absolute opacity-80"
          style={{left:`${el.left}%`, top:`${el.top}%`, width: el.size, height: el.size}}
          animate={floating(idx)}
        >
          <IconSymbol type={el.type} size={el.size} />
        </motion.div>
      ))}

      {/* edge glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-48 bg-gradient-to-r from-transparent to-[rgba(255,212,0,0.03)] blur-3xl" />
        <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-transparent to-[rgba(255,212,0,0.03)] blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[rgba(255,212,0,0.02)] to-transparent" />
      </div>

      {/* subtle golden particles */}
      <div className="absolute inset-0 pointer-events-none">
        {new Array(26).fill(0).map((_,i)=> (
          <motion.div key={i} className="particle rounded-full" style={{width:4+(i%3), height:4+(i%3), left:`${(i*17)%100}%`, top:`${(i*11)%100}%`, position:'absolute', opacity:0.6}}
            animate={{ y:[0,-8,0], opacity:[0.2,0.9,0.2], transition:{ duration: 12 + (i%6)*2, repeat: Infinity, ease:'easeInOut' } }} />
        ))}
      </div>
    </div>
  )
}
