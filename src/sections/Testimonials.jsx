import Reveal from '../components/Reveal'
const T = [
["Counselling helped me manage work-related stress and anxiety, and make sense of the emotions I was carrying. It also helped me consider how those difficulties were affecting my personal relationships. I appreciated being able to talk through these parts of my wellbeing together.","A."],
["I sought support because my child's mobile use and screen-time habits had become a concern. The guidance helped us address the behaviour and work towards healthier screen-time routines. I appreciated having support that took my child's needs into account.","R."],
["Dr. Anuradha Soni listens patiently and without judgment. She understands what I’m feeling and creates a comfortable space where I can express myself openly. I’m grateful for the warmth and care she brings to our conversations.","Hina Srivastava, Jaipur"],
["I appreciated Manovichar’s person-centred approach. My circumstances, emotions, personality, and needs were considered before support was suggested. It felt thoughtful and holistic, with support shaped around the individual rather than a one-size-fits-all approach to mental wellness.","M. and K."]]
export default function Testimonials() {
  return (<section id="stories" className="stories"><div className="wrap"><Reveal><h2>Being heard can change how you carry things.</h2></Reveal>
    <div className="t-grid">{T.map(([q, n], i) => <Reveal key={n} delay={i * 120} className={'tcard t' + i}><blockquote>"{q}"</blockquote><cite>{n}</cite></Reveal>)}</div>
    <p className="note">Names are shown as shared.</p></div></section>)
}
