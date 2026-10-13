import { useEffect, useState } from 'react'
import Logo from './Logo'
import Button from './Button'
const links = [['Home','#home'],['About','#about'],['Services','#services'],['Therapist','#therapist'],['FAQ','#faq'],['Testimonials','#stories']]
export default function Navbar() {
  const [s, setS] = useState(false), [o, setO] = useState(false)
  useEffect(() => {
    const updateScroll = () => setS(window.scrollY > 40)
    const closeOnEscape = event => { if (event.key === 'Escape') setO(false) }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])
  return (<header className={'nav' + (s ? ' scrolled' : '') + (o ? ' open' : '')}>
    <a href="#home" aria-label="Manovichar home"><Logo /></a>
    <nav id="primary-navigation" className="nav-links" aria-label="Primary navigation" onClick={() => setO(false)}>{links.map(([t, h]) => <a key={t} href={h}>{t}</a>)}<Button href="#book" className="nav-cta-m">Book a Session</Button></nav>
    <Button href="#book" className="nav-cta">Book a Session</Button>
    <button className="burger" aria-label={o ? 'Close menu' : 'Open menu'} aria-controls="primary-navigation" aria-expanded={o} onClick={() => setO(!o)}><i/><i/><i/></button>
  </header>)
}
