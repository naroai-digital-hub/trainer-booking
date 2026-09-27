import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Services from '../components/Services'
import About from '../components/About'
import Booking from '../components/Booking'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import type { Service, TrainerSettings } from '../lib/types'

export default function Home() {
  const [settings, setSettings] = useState<TrainerSettings | null>(null)
  const [preselected, setPreselected] = useState<Service | null>(null)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    supabase
      .from('trainer_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setSettings(data as TrainerSettings | null))
  }, [])

  const handleBook = (s: Service) => {
    setPreselected(s)
    setResetKey((k) => k + 1)
    requestAnimationFrame(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services onBook={handleBook} />
        <About settings={settings} />
        <Booking preselected={preselected} resetKey={resetKey} settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  )
}
