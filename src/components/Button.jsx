import React from 'react'
import { motion } from 'framer-motion'

export default function Button({children, variant='primary', onClick}){
  const base = 'inline-flex items-center gap-3 rounded-full px-5 py-3 font-semibold text-sm transition transform'
  const variants = {
    primary: 'bg-gradient-to-r from-dux-yellow/95 to-dux-yellow/65 text-black shadow-glow-yellow',
    outline: 'border border-dux-yellow text-dux-yellow bg-black/20 hover:bg-black/10',
    ghost: 'text-white/90 bg-transparent border border-white/4'
  }

  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`${base} ${variants[variant]}`} onClick={onClick}>{children}</motion.button>
  )
}
