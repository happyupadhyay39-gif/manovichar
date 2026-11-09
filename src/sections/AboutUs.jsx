import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import Sketch from '../components/Sketch'
const P = [['Guidance','Helping you understand what you\'re experiencing.','#17345F','#FFFFFF'],['Compassion','Creating a space where you can speak without judgment.','#F4C542','#17345F'],['Alignment','Helping you reconnect with yourself and what matters.','#D7E8F7','#17345F']]
export default function AboutUs() {
  return (<section id="about" className="about wrap">
    <div className="about-photo"><Photo name="about-image" alt="A quiet counselling room with soft daylight" /></div>
    <div className="about-text">
      <Sketch kind="circle" color="#F4C542" className="about-sketch" />
      <Reveal><p className="label">About Manovichar</p><h2>A space where you don't have to pretend you're okay.</h2></Reveal>
      <Reveal delay={150}><p>Manovichar began with a simple belief: most people don't need to be fixed, they need to be heard. Our sessions are unhurried. We listen first, then work with you to make sense of what you carry, at a pace that feels bearable.</p><p>Whether you arrive with a clear concern or only a heaviness you can't name, you're welcome here.</p></Reveal>
      <div className="circles">{P.map(([t, d, bg, fg], i) => <Reveal key={t} delay={i * 180} className="circ"><div className="disc" style={{ background: bg, color: fg }}>{t}</div><p>{d}</p></Reveal>)}</div>
    </div></section>)
}
