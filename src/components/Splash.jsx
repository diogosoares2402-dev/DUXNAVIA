import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SYMBOLS = ['💎','🍒','⭐','7️⃣','💰']
const FINAL = ['D','U','X']

export default function Splash(){
  const [show, setShow] = useState(() => {
    try{
      return !sessionStorage.getItem('dux_splash_shown')
    }catch(e){
      return true
    }
  })
  const [reels, setReels] = useState(['','',''])
  const intervalRef = useRef(null)

  useEffect(()=>{
    if(!show) return

    // Start fast symbol cycling
    let start = performance.now()
    const spinDuration = 2000 // ms

    intervalRef.current = setInterval(()=>{
      setReels([SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]])
    }, 80)

    // After spinDuration set final D U X
    const t = setTimeout(()=>{
      clearInterval(intervalRef.current)
      setReels(FINAL)

      // small golden flash and then show welcome text; then hide overlay
      const afterFinal = setTimeout(()=>{
        // mark as shown for this session
        try{ sessionStorage.setItem('dux_splash_shown','1') }catch(e){}
        // hide after a smooth transition
        setShow(false)
      }, 1200) // Keep final + glow for 1.2s

      return ()=>clearTimeout(afterFinal)
    }, spinDuration)

    return ()=>{
      clearInterval(intervalRef.current)
      clearTimeout(t)
    }
  },[show])

  if(!show) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.9, ease: 'easeInOut' } }}
        aria-hidden
      >
        <div className="relative flex flex-col items-center gap-6 px-4">
          {/* Slot machine */}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: 'backOut' }} className="slot-machine w-[340px] sm:w-[420px] p-6 rounded-3xl bg-gradient-to-b from-[#3b2b00] to-[#1a1200] shadow-[0_10px_60px_rgba(255,212,0,0.16)] border border-[rgba(255,212,0,0.12)]">
            <div className="slot-top flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,60,60,0.8)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,200,0,0.7)]" />
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(60,255,120,0.5)]" />
            </div>

            <div className="reels bg-[rgba(0,0,0,0.45)] p-4 rounded-xl flex items-center justify-center gap-3 border border-[rgba(255,255,255,0.03)]">
              {reels.map((r, i)=> (
                <div key={i} className="reel min-w-[72px] sm:min-w-[96px] h-[96px] sm:h-[120px] flex items-center justify-center rounded-lg bg-gradient-to-b from-black/40 to-black/20 text-4xl sm:text-5xl font-extrabold text-white shadow-inner" aria-hidden>
                  <motion.div key={r} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18 }} className={`reel-symbol ${FINAL.includes(r)? 'final-symbol' : ''}`}>
                    {r}
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="slot-base mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-200/70">Preparar som: efeito slot (adicionar depois)</div>
              <div className="px-3 py-1 rounded-full bg-white/6 text-sm text-white">Spin</div>
            </div>
          </motion.div>

          {/* Welcome texts that appear when final letters show — visible because we keep overlay until 1.2s after final */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="text-center mt-2">
            <div className="flex items-center justify-center gap-3 text-sm md:text-base">🎰 <span className="text-gray-300">BEM-VINDO AO MELHOR SITE DA TUGA</span> 🎰</div>
            <motion.div initial={{ scale: 0.98 }} animate={{ scale: [1,1.02,1], boxShadow: ['0 0 0 rgba(255,212,0,0)', '0 0 40px rgba(255,212,0,0.55)', '0 0 0 rgba(255,212,0,0)'] }} transition={{ duration: 1.1, ease: 'easeInOut', repeat: 0 }} className="mt-2 neon-intro">
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.06)]">DUXNAVIA</h2>
            </motion.div>
          </motion.div>

          {/* decorative particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="particle top-6 left-8 w-2 h-2 rounded-full opacity-80" style={{position:'absolute', transform:'translateZ(0)'}} />
            <div className="particle top-16 right-12 w-3 h-3 rounded-full opacity-70" style={{position:'absolute'}} />
            <div className="particle bottom-12 left-20 w-2 h-2 rounded-full opacity-60" style={{position:'absolute'}} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
