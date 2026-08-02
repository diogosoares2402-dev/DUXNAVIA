import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Lightweight SVG symbols (inline, optimized)
function SvgDiamond({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff9d8" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffd400" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d="M32 6 L58 32 L32 58 L6 32 Z" fill="url(#g1)" stroke="#fff2b8" strokeOpacity="0.08" />
    </svg>
  )
}
function SvgCherry({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff5b7f" />
          <stop offset="100%" stopColor="#ff1f4b" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="36" r="10" fill="url(#g2)" />
      <circle cx="40" cy="36" r="10" fill="url(#g2)" />
      <path d="M32 24 C34 18, 38 16, 42 18" stroke="#90ee90" strokeWidth="2" fill="none" strokeOpacity="0.9" />
    </svg>
  )
}
function SvgStar({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g3" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff8d6" />
          <stop offset="100%" stopColor="#ffd400" />
        </linearGradient>
      </defs>
      <path d="M32 8 L39 28 L60 28 L42 40 L48 60 L32 48 L16 60 L22 40 L4 28 L25 28 Z" fill="url(#g3)" />
    </svg>
  )
}
function SvgSeven({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="52" height="52" rx="10" fill="#111" stroke="#ffd400" strokeOpacity="0.08" />
      <text x="32" y="42" textAnchor="middle" fontSize="36" fontWeight="900" fill="#ffd400">7</text>
    </svg>
  )
}
function SvgMoney({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g4" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff5d6" />
          <stop offset="100%" stopColor="#ffd400" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="20" fill="url(#g4)" />
      <text x="32" y="38" textAnchor="middle" fontSize="16" fontWeight="700" fill="#050505">€</text>
    </svg>
  )
}

const SYMBOLS = ['diamond','cherry','star','seven','money']
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
  const audioCtxRef = useRef(null)
  const oscillatorRefs = useRef([])

  useEffect(()=>{
    if(!show) return

    // initialize AudioContext lazily
    try{
      if(!audioCtxRef.current && typeof window !== 'undefined'){
        const AudioContextClass = window.AudioContext || window.webkitAudioContext
        if(AudioContextClass) audioCtxRef.current = new AudioContextClass()
      }
    }catch(e){
      audioCtxRef.current = null
    }

    const spinDuration = 1800 // ms, adjusted to keep total 2-3s
    const spinInterval = 80

    intervalRef.current = setInterval(()=>{
      setReels([SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]])
      // play small click sound if audio available
      try{ playClick() }catch(e){}
    }, spinInterval)

    const t = setTimeout(()=>{
      clearInterval(intervalRef.current)
      setReels(FINAL)

      // mark shown in session and hide after a short glow
      const afterFinal = setTimeout(()=>{
        try{ sessionStorage.setItem('dux_splash_shown','1') }catch(e){}
        // smooth exit
        setShow(false)
      }, 600) // keep final + glow for 600ms

      return ()=>clearTimeout(afterFinal)
    }, spinDuration)

    return ()=>{
      clearInterval(intervalRef.current)
      clearTimeout(t)
      stopAllOscillators()
    }
  },[show])

  function playClick(){
    const ctx = audioCtxRef.current
    if(!ctx) return
    try{
      // short click / metallic sound using oscillator and filter
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      const f = ctx.createBiquadFilter()
      o.type = 'triangle'
      o.frequency.setValueAtTime(600, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.06)
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
      f.type = 'highpass'
      f.frequency.setValueAtTime(400, ctx.currentTime)
      o.connect(f); f.connect(g); g.connect(ctx.destination)
      o.start(); o.stop(ctx.currentTime + 0.12)
      oscillatorRefs.current.push(o)
      // cleanup after
      setTimeout(()=>{ try{ o.disconnect(); g.disconnect(); f.disconnect() }catch(e){} }, 400)
    }catch(e){/* ignore audio errors (autoplay policies) */}
  }
  function stopAllOscillators(){
    try{
      oscillatorRefs.current.forEach(o=>{ try{o.stop(); o.disconnect()}catch(e){} })
      oscillatorRefs.current = []
    }catch(e){}
  }

  if(!show) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-dux-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: 'easeInOut' } }}
        aria-hidden
      >
        <div className="relative flex flex-col items-center gap-6 px-4">
          {/* Slot machine visual */}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: 'backOut' }} className="slot-machine w-[320px] sm:w-[420px] p-6 rounded-3xl bg-gradient-to-b from-[#3b2b00] to-[#120900] shadow-[0_10px_60px_rgba(255,212,0,0.16)] border border-[rgba(255,212,0,0.12)]">
            <div className="slot-top flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,60,60,0.8)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,200,0,0.7)]" />
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(60,255,120,0.5)]" />
            </div>

            <div className="reels bg-[rgba(0,0,0,0.45)] p-4 rounded-xl flex items-center justify-center gap-3 border border-[rgba(255,255,255,0.03)]">
              {reels.map((r, i)=> (
                <div key={i} className="reel min-w-[72px] sm:min-w-[96px] h-[96px] sm:h-[120px] flex items-center justify-center rounded-lg bg-gradient-to-b from-black/40 to-black/20 text-3xl sm:text-5xl font-extrabold text-white shadow-inner">
                  <motion.div key={String(r)+i} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.12 }} className={`reel-symbol ${FINAL.includes(r)? 'final-symbol' : ''}`}>
                    {r === 'diamond' && <SvgDiamond size={64} />}
                    {r === 'cherry' && <SvgCherry size={64} />}
                    {r === 'star' && <SvgStar size={64} />}
                    {r === 'seven' && <SvgSeven size={64} />}
                    {r === 'money' && <SvgMoney size={64} />}
                    {FINAL.includes(r) && <div className="text-4xl sm:text-6xl font-extrabold">{r}</div>}
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="slot-base mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-200/70">Efeito sonoro: reproduzido via WebAudio (otimizado)</div>
              <div className="px-3 py-1 rounded-full bg-white/6 text-sm text-white">Spin</div>
            </div>
          </motion.div>

          {/* Welcome texts */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="text-center mt-2">
            <div className="flex items-center justify-center gap-3 text-sm md:text-base">🎰 <span className="text-gray-300">BEM-VINDO AO MELHOR SITE DA TUGA</span> 🎰</div>
            <motion.div initial={{ scale: 0.98 }} animate={{ scale: [1,1.02,1], boxShadow: ['0 0 0 rgba(255,212,0,0)', '0 0 40px rgba(255,212,0,0.55)', '0 0 0 rgba(255,212,0,0)'] }} transition={{ duration: 0.9, ease: 'easeInOut', repeat: 0 }} className="mt-2 neon-intro">
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
