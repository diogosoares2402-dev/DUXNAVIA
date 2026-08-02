import React from 'react'

export default function Section({id, title, children}){
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-20">
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-dux-yellow mb-4">{title}</h2>
        <div className="text-sm text-gray-200">{children}</div>
      </div>
    </section>
  )
}
