import React, { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import AnimatedBackground from './components/AnimatedBackground'
import Section from './components/Section'
import Footer from './components/Footer'
import Splash from './components/Splash'

import SocialCard from './components/SocialCard'
import PartnershipCard from './components/PartnershipCard'
import PromotionCard from './components/PromotionCard'
import ScheduleCard from './components/ScheduleCard'
import CommunityForm from './components/CommunityForm'

export default function App(){
  useEffect(()=>{
    // ensure body background color is set early for splash visual
    document.body.style.backgroundColor = 'var(--dux-black)'
  },[])

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-dux-black">
      <AnimatedBackground />
      <Splash />
      <Nav />
      <main className="relative z-30 pb-24">
        <Hero />

        <Section id="redes" title="Redes Sociais">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SocialCard icon="DC" name="Discord" desc="Canal oficial da comunidade DUXNAVIA" href="#" />
            <SocialCard icon="TW" name="Twitch" desc="Segui as streams em direto" href="#" />
            <SocialCard icon="IG" name="Instagram" desc="Moments e destaques" href="#" />
            <SocialCard icon="OF" name="OnlyFans" desc="Conteúdo premium (placeholder)" href="#" />
          </div>
        </Section>

        <Section id="parcerias" title="Parcerias">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PartnershipCard logo="C1" name="Casino Sagrado" promo="Bónus de boas-vindas: 100% até 200€" />
            <PartnershipCard logo="C2" name="Royal Slots" promo="50 Free Spins em slots selecionados" />
            <PartnershipCard logo="C3" name="Atlantic Bet" promo="Cashback semanal até 10%" />
            <PartnershipCard logo="C4" name="LusoGames" promo="Promoções especiais para a comunidade" />
          </div>
        </Section>

        <Section id="promocoes" title="Promoções em Destaque">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PromotionCard title="100 Free Spins" subtitle="Exemplo de promoção — apenas demo" />
            <PromotionCard title="500€ de Bónus" subtitle="Bónus ilustrativo para apresentação" />
            <PromotionCard title="Cashback" subtitle="Recupera parte das tuas perdas — exemplo" />
          </div>
        </Section>

        <Section id="lives" title="Próximas Lives">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScheduleCard day="Sáb" time="21:00" platform="Twitch" status="Ao Vivo" />
            <ScheduleCard day="Dom" time="18:00" platform="YouTube" status="Agendado" />
            <ScheduleCard day="Qua" time="20:30" platform="Twitch" status="Agendado" />
          </div>
        </Section>

        <Section id="comunidade" title="Sugestões da Comunidade">
          <CommunityForm />
        </Section>

        <Footer />
      </main>
    </div>
  )
}
