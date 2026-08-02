import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Premium inline SVGs (more detailed but optimized)
function SvgDiamond({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd1" x1="0" x2="1">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="60%" stopColor="#ffe08a" />
          <stop offset="100%" stopColor="#ffd400" />
        </linearGradient>
        <filter id="s1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g filter="url(#s1)">
        <path d="M32 4 L60 28 L32 60 L4 28 Z" fill="url(#gd1)" stroke="#fff1b2" strokeOpacity="0.12" strokeWidth="0.8" />
        <path d="M32 10 L52 30 L32 50 L12 30 Z" fill="rgba(255,255,255,0.06)" />
      </g>
    </svg>
  )
}
function SvgCherry({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gc1" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff7aa3" />
          <stop offset="100%" stopColor="#ff214f" />
        </linearGradient>
      </defs>
      <g>
        <circle cx="24" cy="36" r="11" fill="url(#gc1)" stroke="#fff3" strokeOpacity="0.06" strokeWidth="0.8" />
        <circle cx="40" cy="36" r="11" fill="url(#gc1)" stroke="#fff3" strokeOpacity="0.06" strokeWidth="0.8" />
        <path d="M32 24 C34 18, 38 16, 42 18" stroke="#8ef08a" strokeWidth="1.4" fill="none" strokeOpacity="0.95" />
      </g>
    </svg>
  )
}
function SvgStar({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gs1" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff8d6" />
          <stop offset="100%" stopColor="#ffd400" />
        </linearGradient>
      </defs>
      <g>
        <path d="M32 8 L40 28 L60 28 L44 40 L50 60 L32 50 L14 60 L20 40 L4 28 L24 28 Z" fill="url(#gs1)" stroke="#fff2" strokeOpacity="0.06" strokeWidth="0.8" />
      </g>
    </svg>
  )
}
function SvgSeven({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="52" height="52" rx="10" fill="#0f0f0f" stroke="#ffd400" strokeOpacity="0.08" />
      <text x="32" y="42" textAnchor="middle" fontSize="36" fontWeight="900" fill="#ffd400">7</text>
    </svg>
  )
}
function SvgMoney({ size=64 }){
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gm1" x1="0" x2="1">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="100%" stopColor="#ffd400" />
        </linearGradient>
      </defs>
      <g>
        <circle cx="32" cy="32" r="20" fill="url(#gm1)" stroke="#fff2" strokeOpacity="0.05" />
        <text x="32" y="38" textAnchor="middle" fontSize="16" fontWeight="700" fill="#050505">€</text>
      </g>
    </svg>
  )
}

const SYMBOLS = ['diamond','cherry','star','seven','money']
const FINAL = ['D','U','X']

export default function Splash(){
  const [show, setShow] = useState(() => {
    try{ return !sessionStorage.getItem('dux_splash_shown') }catch(e){ return true }
  })

  // reels can be either symbol keys or final letters
  const [reels, setReels] = useState([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]])
  const [stopped, setStopped] = useState([false,false,false])
  const [showJackpot, setShowJackpot] = useState(false)
  const [flash, setFlash] = useState(false)

  const timeouts = useRef([])
  const intervals = useRef([])
  const audioCtxRef = useRef(null)
  const oscillatorRefs = useRef([])

  useEffect(()=>{
    if(!show) return

    // init audio context lazily
    try{
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if(AudioContextClass && !audioCtxRef.current) audioCtxRef.current = new AudioContextClass()
    }catch(e){ audioCtxRef.current = null }

    // spinning behavior: reels stop at slightly different times with easing
    const base = performance.now()
    const stopTimes = [1600, 1950, 2300] // ms after start - keeps total 2-3s

    // start fast interval for visual cycling
    const spinInterval = 70
    intervals.current[0] = setInterval(()=> randomizeReels(), spinInterval)

    // Schedule stops with gradual slowing per reel
    stopTimes.forEach((st, idx)=>{
      const t = setTimeout(()=>{
        // begin deceleration: replace interval with increasing-delay loop
        decelerateReel(idx, 500, FINAL[idx])
      }, st)
      timeouts.current.push(t)
    })

    // cleanup
    return ()=>{
      timeouts.current.forEach(t=>clearTimeout(t)); timeouts.current=[]
      intervals.current.forEach(i=>clearInterval(i)); intervals.current=[]
      stopAllOscillators()
    }
  },[show])

  function randomizeReels(){
    setReels(r => [SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]])
  }

  function decelerateReel(index, duration = 600, finalVal){
    // progressively increase delay between symbol changes to emulate deceleration
    let elapsed = 0
    let delay = 40
    function step(){
      if(elapsed >= duration){
        // set final
        setReels(prev => { const next = [...prev]; next[index] = finalVal; return next })
        setStopped(s => { const ns = [...s]; ns[index] = true; return ns })
        // small vibration sound + animation trigger
        triggerVibration(index)

        // if all stopped, show jackpot sequence
        setTimeout(()=>{
          const allStopped = stopped.map((v,i)=> i===index ? true : v).every(Boolean)
          if(allStopped){
            launchJackpotSequence()
          }
        }, 40)
        return
      }
      // change symbol
      setReels(prev => { const next=[...prev]; next[index] = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]; return next })
      // increase delay
      elapsed += delay
      delay = Math.min(200, delay * 1.22 + 6)
      const t = setTimeout(step, delay)
      timeouts.current.push(t)
    }
    step()
  }

  function triggerVibration(i){
    // play a short click/vibration via WebAudio and rely on CSS animation for visual vibration
    const ctx = audioCtxRef.current
    if(!ctx) return
    try{
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'square'
      o.frequency.setValueAtTime(400 + i*80, ctx.currentTime)
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
      o.connect(g); g.connect(ctx.destination)
      o.start(); o.stop(ctx.currentTime + 0.12)
      oscillatorRefs.current.push(o)
      setTimeout(()=>{ try{ o.disconnect() }catch(e){} }, 300)
    }catch(e){}
  }

  function stopAllOscillators(){
    try{ oscillatorRefs.current.forEach(o=>{ try{o.stop(); o.disconnect()}catch(e){} }) }catch(e){}
    oscillatorRefs.current=[]
  }

  function launchJackpotSequence(){
    setShowJackpot(true)
    setFlash(true)
    // play a celebratory tone
    playJackpotTone()
    // coin/chip particle lifetime
    setTimeout(()=>{ setShowJackpot(false); setFlash(false)
      // mark splash as shown and hide overlay after slight delay
      try{ sessionStorage.setItem('dux_splash_shown','1') }catch(e){}
      setTimeout(()=> setShow(false), 600)
    }, 800) // jackpot duration 0.8s
  }

  function playJackpotTone(){
    const ctx = audioCtxRef.current
    if(!ctx) return
    try{
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(440, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.24)
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9)
      o.connect(g); g.connect(ctx.destination)
      o.start(); o.stop(ctx.currentTime + 0.9)
      oscillatorRefs.current.push(o)
    }catch(e){}
  }

  function skipSplash(){
    try{ sessionStorage.setItem('dux_splash_shown','1') }catch(e){}
    // clear timers and hide
    timeouts.current.forEach(t=>clearTimeout(t)); timeouts.current=[]
    intervals.current.forEach(i=>clearInterval(i)); intervals.current=[]
    stopAllOscillators()
    setShow(false)
  }

  if(!show) return null

  // particle counts adapt to mobile via CSS and conditional rendering
  const coins = new Array(12).fill(0).map((_,i)=> ({id:i, left: Math.random()*100, top: Math.random()*40 + 20}))
  const chips = new Array(10).fill(0).map((_,i)=> ({id:i, left: Math.random()*100, top: Math.random()*40 + 30}))

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-60 flex items-center justify-center bg-dux-black" initial={{ opacity:1 }} animate={{ opacity:1 }} exit={{ opacity:0, transition:{ duration:0.45 } }}>
        {/* neon flash */}
        {flash && <motion.div initial={{ opacity:0 }} animate={{ opacity:0.95 }} exit={{ opacity:0 }} className="absolute inset-0 bg-[rgba(255,212,0,0.06)] pointer-events-none" />}

        <div className="relative flex flex-col items-center gap-6 px-4">
          <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.38, ease:'backOut' }} className="slot-machine w-[320px] sm:w-[460px] p-6 rounded-3xl bg-gradient-to-b from-[#3b2b00] to-[#090400] shadow-[0_14px_80px_rgba(255,212,0,0.14)] border border-[rgba(255,212,0,0.12)]">
            <div className="slot-top flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,60,60,0.8)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,200,0,0.7)]" />
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(60,255,120,0.5)]" />
            </div>

            <div className="reels bg-[rgba(0,0,0,0.45)] p-4 rounded-xl flex items-center justify-center gap-3 border border-[rgba(255,255,255,0.03)]">
              {reels.map((r, i)=> (
                <motion.div key={i} animate={stopped[i] ? { x: [0, -6, 3, 0], transition: { duration:0.36 } } : {}} className="reel min-w-[84px] sm:min-w-[120px] h-[96px] sm:h-[140px] flex items-center justify-center rounded-lg bg-gradient-to-b from-black/40 to-black/20 text-3xl sm:text-5xl font-extrabold text-white shadow-inner">
                  <motion.div key={String(r)+i} initial={{ y:-18, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.14 }} className={`reel-symbol ${FINAL.includes(r)? 'final-symbol' : ''}`}>
                    {r === 'diamond' && <SvgDiamond size={72} />}
                    {r === 'cherry' && <SvgCherry size={72} />}
                    {r === 'star' && <SvgStar size={72} />}
                    {r === 'seven' && <SvgSeven size={72} />}
                    {r === 'money' && <SvgMoney size={72} />}
                    {FINAL.includes(r) && <div className="absolute text-4xl sm:text-6xl font-extrabold">{r}</div>}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <div className="slot-base mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-200/70">Efeito sonoro: WebAudio (otimizado)</div>
              <div className="px-3 py-1 rounded-full bg-white/6 text-sm text-white">Spin</div>
            </div>
          </motion.div>

          {/* JACKPOT overlay */}
          <AnimatePresence>
            {showJackpot && (
              <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ opacity:0 }} className="absolute z-70 flex items-center justify-center pointer-events-none">
                <div className="jackpot bg-gradient-to-r from-yellow-400 to-white/90 text-black px-8 py-4 rounded-3xl text-3xl font-extrabold shadow-[0_10px_60px_rgba(255,212,0,0.6)]">JACKPOT</div>

                {/* coins + chips particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {coins.map(c=> (
                    <motion.div key={`coin-${c.id}`} initial={{ y: 0, x: '0%', opacity:1 }} animate={{ y: [0, -220], x: [`${c.left}%`, `${c.left + (Math.random()*20-10)}%`], opacity: [1,1,0] }} transition={{ duration:0.9, ease:'easeOut' }} className="coin particle rounded-full w-4 h-4" style={{ left: `${c.left}%`, top: `${c.top}%`, position:'absolute' }} />
                  ))}
                  {chips.map(ch=> (
                    <motion.div key={`chip-${ch.id}`} initial={{ y: 0, x: '0%', rotate:0 }} animate={{ y: [0, -200], x: [`${ch.left}%`, `${ch.left + (Math.random()*30-15)}%`], rotate: [0, 360], opacity: [1,1,0] }} transition={{ duration:1.0, ease:'easeOut' }} className="chip bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-full w-6 h-6" style={{ left: `${ch.left}%`, top: `${ch.top}%`, position:'absolute' }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* welcome & title after jackpot (kept visible as part of sequence) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="text-center mt-2">
            <div className="flex items-center justify-center gap-3 text-sm md:text-base">🎰 <span className="text-gray-300">BEM-VINDO AO MELHOR SITE DA TUGA</span> 🎰</div>
            <motion.div initial={{ scale: 0.98 }} animate={{ scale: [1,1.03,1], boxShadow: ['0 0 0 rgba(255,212,0,0)','0 0 48px rgba(255,212,0,0.65)','0 0 0 rgba(255,212,0,0)'] }} transition={{ duration: 1.1, ease: 'easeInOut', repeat: 0 }} className="mt-2 neon-intro">
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.06)]">DUXNAVIA</h2>
            </motion.div>
          </motion.div>

          {/* Pular Intro button */}
          <button aria-label="Pular Intro" onClick={skipSplash} className="skip-intro fixed bottom-6 right-6 z-80 px-3 py-2 rounded-full bg-white/6 text-sm text-white backdrop-blur-sm border border-white/6">Pular Intro</button>

          {/* decorative particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="particle top-6 left-8 w-2 h-2 rounded-full opacity-80" style={{position:'absolute'}} />
            <div className="particle top-16 right-12 w-3 h-3 rounded-full opacity-70" style={{position:'absolute'}} />
            <div className="particle bottom-12 left-20 w-2 h-2 rounded-full opacity-60" style={{position:'absolute'}} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
