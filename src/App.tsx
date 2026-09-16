import { useCallback, useState } from 'react'
import { ScrollProvider } from '@/lib/ScrollProvider'
import { Loader } from '@/components/Loader'
import { introAlreadySeen } from '@/lib/intro'
import { Nav } from '@/components/Nav'
import { Pipe } from '@/components/Pipe'
import { Hero } from '@/components/sections/Hero'
import { Trust } from '@/components/sections/Trust'
import { Anatomy } from '@/components/sections/Anatomy'
import { Services } from '@/components/sections/Services'
import { Process } from '@/components/sections/Process'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { Testimonials } from '@/components/sections/Testimonials'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

export default function App() {
  // Hero entrance waits for the intro loader; when the loader is skipped it starts at once.
  const [introDone, setIntroDone] = useState(() => introAlreadySeen())
  const onIntroDone = useCallback(() => setIntroDone(true), [])

  return (
    <ScrollProvider>
      <a className="skip-link" href="#main">
        Preskoči na sadržaj
      </a>
      <Loader onDone={onIntroDone} />
      <Nav />
      <Pipe />
      <main id="main" className="relative z-10">
        <Hero introDone={introDone} />
        <Trust />
        <Anatomy />
        <Services />
        <Process />
        <BeforeAfter />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </ScrollProvider>
  )
}
