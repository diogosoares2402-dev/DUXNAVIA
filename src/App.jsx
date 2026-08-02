import React from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import AnimatedBackground from './components/AnimatedBackground'
import Section from './components/Section'
import Footer from './components/Footer'

export default function App(){
  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-dux-black">
      <AnimatedBackground />
      <Nav />
      <main className="relative z-30">
        <Hero />

        <Section id="redes" title="Redes Sociais">
          <p>Conteúdo de exemplo — links serão adicionados depois.</p>
        </Section>

        <Section id="parcerias" title="Parcerias">
          <p>Espaço para parcerias premium (exemplo).</p>
        </Section>

        <Section id="promocoes" title="Promoções">
          <p>Promoções de exemplo serão colocadas aqui.</p>
        </Section>

        <Section id="lives" title="Agenda das Lives">
          <p>Agenda de lives — conteúdo de exemplo.</p>
        </Section>

        <Section id="comunidade" title="Sugestões da Comunidade">
          <p>Espaço para sugestões.</p>
        </Section>

        <Footer />
      </main>
    </div>
  )
}
