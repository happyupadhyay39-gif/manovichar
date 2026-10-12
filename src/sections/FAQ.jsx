import { useState } from 'react'
import faqImage from '../assets/images/faq-image.png'
import Reveal from '../components/Reveal'
const Q = [
["Can I come even if I don't know exactly what's wrong?","Yes. Many people begin with only a feeling. We'll work out the rest together."],
["What happens during the first session?","We talk about what brought you here, what you hope for, and how we might work. There's no pressure to share more than you want."],
["Is counselling confidential?","Yes. What you share stays between us, with the limited legal exceptions we explain before we begin."],
["How do I know which service is right for me?","Choose what feels closest. If it isn't quite right, we'll adjust after your first conversation."],
["Can I take an online session?","Yes. Online sessions are available and work well from a quiet, private space."],
["What if I'm nervous about talking?","That's very common. We'll go slowly, and silence is fine."]]
export default function FAQ() {
  const [o, setO] = useState(0)
  return (<section id="faq" className="faq wrap"><div>
    <Reveal><h2>You can ask before you begin.</h2></Reveal>
    <ul>{Q.map(([q, a], i) => <li key={q} className={o === i ? 'on' : ''}><button aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}><span>{q}</span><em>{o === i ? '–' : '+'}</em></button><div className="ans"><p>{a}</p></div></li>)}</ul></div>
    <Reveal className="faq-photo"><img className="photo" src={faqImage} alt="A peaceful counselling space" loading="lazy" /></Reveal></section>)
}
