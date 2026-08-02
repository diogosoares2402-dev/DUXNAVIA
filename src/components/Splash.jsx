import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playAudioFile, stopAudioInstance } from '../utils/audio'

// Premium inline SVGs (kept unchanged)
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
function SvgCherry({ size=64 }){ return (
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
)}
function SvgStar({ size=64 }){ return (
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
)}
function SvgSeven({ size=64 }){ return (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="52" height="52" rx="10" fill="#0f0f0f" stroke="#ffd400" strokeOpacity="0.08" />
    <text x="32" y="42" textAnchor="middle" fontSize="36" fontWeight="900" fill="#ffd400">7</text>
  </svg>
)}
function SvgMoney({ size=64 }){ return (
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
)}

const SYMBOLS = ['diamond','cherry','star','seven','money']
const FINAL = ['D','U','X']

export default function Splash(){
  const [show, setShow] = useState(() => { try{ return !sessionStorage.getItem('dux_splash_shown') }catch(e){ return true } })
  const [reels, setReels] = useState([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]])
  const [stopped, setStopped] = useState([false,false,false])
  const [showJackpot, setShowJackpot] = useState(false)
  const [flash, setFlash] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const timeouts = useRef([])
  const intervals = useRef([])
  const audioInstances = useRef({ spin:null, stop: null, jackpot: null })

  useEffect(()=>{
    setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 640)
    try{
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(media.matches)
    }catch(e){ setPrefersReducedMotion(false) }
  },[])

  useEffect(()=>{
    if(!show) return

    // Lazy load audio only on non-mobile and when not in reduced motion
    if(!isMobile && !prefersReducedMotion){
      playAudioFile('/audio/spin.ogg').then(a=>audioInstances.current.spin=a).catch(()=>{})
      playAudioFile('/audio/stop.ogg').then(a=>audioInstances.current.stop=a).catch(()=>{})
      playAudioFile('/audio/jackpot.ogg').then(a=>audioInstances.current.jackpot=a).catch(()=>{})
    }

    // Timings tuned for balance: faster on mobile, slightly longer on desktop for visual richness
    const stopTimes = isMobile ? [1200,1450,1700] : [1400,1750,2050]
    const spinInterval = isMobile ? 90 : 70
    intervals.current[0] = setInterval(()=> randomizeReels(), spinInterval)

    stopTimes.forEach((st, idx)=>{
      const t = setTimeout(()=> decelerateReel(idx, isMobile ? 420 : 600, FINAL[idx]), st)
      timeouts.current.push(t)
    })

    return ()=>{
      timeouts.current.forEach(t=>clearTimeout(t)); timeouts.current=[]
      intervals.current.forEach(i=>clearInterval(i)); intervals.current=[]
      try{ Object.values(audioInstances.current).forEach(ai=>{ if(ai){ stopAudioInstance(ai) } }) }catch(e){}
    }
  },[show, isMobile, prefersReducedMotion])

  function randomizeReels(){
    setReels([SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]])
  }

  function decelerateReel(index, duration = 600, finalVal){
    // shorter duration on mobile; progressive delay for more realistic deceleration
    let elapsed = 0
    let delay = 40
    function step(){
      if(elapsed >= duration){
        setReels(prev => { const next = [...prev]; next[index] = finalVal; return next })
        setStopped(s => { const ns = [...s]; ns[index] = true; return ns })
        // play stop audio if available
        try{ if(audioInstances.current.stop){ audioInstances.current.stop.currentTime = 0; audioInstances.current.stop.play().catch(()=>{}) } }catch(e){}
        triggerVibration(index)
        // check if all stopped after small timeout
        setTimeout(()=>{
          const all = stopped.map((v,i)=> i===index ? true : v).every(Boolean)
          if(all){ launchJackpotSequence() }
        }, 40)
        return
      }
      setReels(prev => { const next=[...prev]; next[index] = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]; return next })
      elapsed += delay
      // increase delay but with smaller multiplier on mobile for snappier feel
      delay = Math.min(220, delay * (isMobile ? 1.14 : 1.22) + (isMobile ? 4 : 6))
      const t = setTimeout(step, delay)
      timeouts.current.push(t)
    }
    step()
  }

  function triggerVibration(i){
    try{ const el = document.querySelectorAll('.reel')[i]; if(el){ el.animate([{ transform: 'translateY(0)' }, { transform:'translateY(-6px) rotate(-1deg)' }, { transform:'translateY(3px) rotate(1deg)' }, { transform:'translateY(0)' }], { duration: 320 }) } }catch(e){}
    try{ if(audioInstances.current.stop){ audioInstances.current.stop.currentTime = 0; audioInstances.current.stop.play().catch(()=>{}) } }catch(e){}
  }

  function launchJackpotSequence(){
    setShowJackpot(true)
    setFlash(true)
    try{ if(audioInstances.current.jackpot){ audioInstances.current.jackpot.currentTime = 0; audioInstances.current.jackpot.play().catch(()=>{}) } }catch(e){}
    // small global vib, subtle on mobile
    try{ document.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(3px)' }, { transform: 'translateY(0)' }], { duration: isMobile?300:420 }) }catch(e){}

    setTimeout(()=>{
      setShowJackpot(false)
      setFlash(false)
      try{ sessionStorage.setItem('dux_splash_shown','1') }catch(e){}
      setTimeout(()=> setShow(false), 520)
    }, 800)
  }

  function skipSplash(){
    try{ sessionStorage.setItem('dux_splash_shown','1') }catch(e){}
    timeouts.current.forEach(t=>clearTimeout(t)); timeouts.current=[]
    intervals.current.forEach(i=>clearInterval(i)); intervals.current=[]
    try{ Object.values(audioInstances.current).forEach(ai=>{ if(ai){ stopAudioInstance(ai) } }) }catch(e){}
    setShow(false)
  }

  if(!show) return null

  // adapt counts for balanced perf
  const particleCount = prefersReducedMotion ? 0 : (isMobile ? 8 : 36)
  const coinCount = prefersReducedMotion ? 0 : (isMobile ? 6 : 20)
  const chipCount = prefersReducedMotion ? 0 : (isMobile ? 4 : 16)

  const particles = new Array(particleCount).fill(0).map((_,i)=> ({id:i, left: Math.random()*100, top: Math.random()*100, size: 2+Math.random()*3}))
  const coins = new Array(coinCount).fill(0).map((_,i)=> ({id:i, left: Math.random()*100, top: 60 + Math.random()*30}))
  const chips = new Array(chipCount).fill(0).map((_,i)=> ({id:i, left: Math.random()*100, top: 60 + Math.random()*30}))

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-60 flex items-center justify-center bg-dux-black" initial={{ opacity:1 }} animate={{ opacity:1 }} exit={{ opacity:0, transition:{ duration:0.35 } }}>
        {flash && <motion.div initial={{ opacity:0 }} animate={{ opacity: isMobile ? 0.6 : 0.98 }} exit={{ opacity:0 }} className="absolute inset-0 bg-[rgba(255,212,0,0.08)] pointer-events-none flash-intense" />}

        <div className="relative flex flex-col items-center gap-6 px-4">
          <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:isMobile?0.32:0.38, ease:'backOut' }} className={`slot-machine w-[320px] ${isMobile? 'sm:w-[420px]' : 'sm:w-[460px]'} p-6 rounded-3xl bg-gradient-to-b from-[#3b2b00] to-[#090400] shadow-[0_14px_80px_rgba(255,212,0,0.14)] border border-[rgba(255,212,0,0.12)]`}>
            <div className="slot-top flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,60,60,0.8)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,200,0,0.7)]" />
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_8px_rgba(60,255,120,0.5)]" />
            </div>

            <div className="reels bg-[rgba(0,0,0,0.45)] p-4 rounded-xl flex items-center justify-center gap-3 border border-[rgba(255,255,255,0.03)]">
              {reels.map((r, i)=> (
                <motion.div key={i} animate={stopped[i] ? { x: [0, -6, 3, 0], transition: { duration:0.36 } } : {}} className="reel min-w-[84px] sm:min-w-[120px] h-[96px] sm:h-[140px] flex items-center justify-center rounded-lg bg-gradient-to-b from-black/40 to-black/20 text-3xl sm:text-5xl font-extrabold text-white shadow-inner">
                  <motion.div key={String(r)+i} initial={{ y:-18, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.12 }} className={`reel-symbol ${FINAL.includes(r)? 'final-symbol' : ''}`}>
                    {r === 'diamond' && <SvgDiamond size={isMobile?60:72} />}
                    {r === 'cherry' && <SvgCherry size={isMobile?60:72} />}
                    {r === 'star' && <SvgStar size={isMobile?60:72} />}
                    {r === 'seven' && <SvgSeven size={isMobile?60:72} />}
                    {r === 'money' && <SvgMoney size={isMobile?60:72} />}
                    {FINAL.includes(r) && <div className="absolute text-4xl sm:text-6xl font-extrabold">{r}</div>}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <div className="slot-base mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-200/70">Efeito sonoro: WebAudio ou ficheiros em /public/audio (lazy)</div>
              <div className="px-3 py-1 rounded-full bg-white/6 text-sm text-white">Spin</div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showJackpot && (
              <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ opacity:0 }} className="absolute z-70 flex items-center justify-center pointer-events-none">
                <div className="jackpot bg-gradient-to-r from-yellow-400 to-white/90 text-black px-8 py-4 rounded-3xl text-3xl font-extrabold shadow-[0_10px_100px_rgba(255,212,0,0.85)] flash-intense jackpot-vibe">JACKPOT</div>
                <div className="absolute inset-0 pointer-events-none">
                  {coins.map(c=> (
                    <motion.div key={`coin-${c.id}`} initial={{ y: 0, x: 0, opacity:1, scale:1 }} animate={{ y: -220 - Math.random()*60, x: `${c.left - 50 + Math.random()*80}%`, rotate: Math.random()*360, opacity: [1,1,0], scale: [1, 1.08] }} transition={{ duration:isMobile?0.7:0.95, ease:'easeOut' }} className="coin rounded-full w-3 h-3" style={{ left: `${c.left}%`, top: `${c.top}%`, position:'absolute' }} />
                  ))}
                  {chips.map(ch=> (
                    <motion.div key={`chip-${ch.id}`} initial={{ y: 0, x: 0, opacity:1, scale:1 }} animate={{ y: -200 - Math.random()*60, x: `${ch.left - 50 + Math.random()*100}%`, rotate: [0, 360 + Math.random()*360], opacity: [1,1,0], scale: [1, 1.03] }} transition={{ duration:isMobile?0.8:1.05, ease:'easeOut' }} className="chip rounded-full w-5 h-5" style={{ left: `${ch.left}%`, top: `${ch.top}%`, position:'absolute' }} />
                  ))}
                  {particles.map(p=> (
                    <motion.div key={`p-${p.id}`} initial={{ y: 0, opacity:1, scale:1 }} animate={{ y: -140 - Math.random()*140, x: `${p.left - 50 + Math.random()*80}%`, opacity: [1, 0.9, 0], scale: [1, 1.2, 0.8] }} transition={{ duration: isMobile?0.6:0.9 + Math.random()*0.6, ease:'easeOut' }} className="particle rounded-full" style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, position:'absolute' }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.6 }} className="text-center mt-2">
            <div className="flex items-center justify-center gap-3 text-sm md:text-base">🎰 <span className="text-gray-300">BEM-VINDO AO MELHOR SITE DA TUGA</span> 🎰</div>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: [0.96, 1.06, 1], opacity: [0,1,1] }} transition={{ duration: isMobile?0.8:0.9, ease: 'easeInOut' }} className="mt-2 neon-intro flash-intense">
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.08)]">DUXNAVIA</h2>
            </motion.div>
          </motion.div>

          <button aria-label="Pular Intro" onClick={skipSplash} className="skip-intro fixed bottom-6 right-6 z-80 px-3 py-2 rounded-full bg-white/6 text-sm text-white backdrop-blur-sm border border-white/6">Pular Intro</button>

          <div className="absolute inset-0 pointer-events-none">
            {particles.slice(0, isMobile?Math.min(4, particles.length):10).map(p=> (
              <div key={`bgp-${p.id}`} className="particle rounded-full" style={{ left:`${p.left}%`, top:`${p.top}%`, width:p.size, height:p.size, position:'absolute', opacity:0.6 }} />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
