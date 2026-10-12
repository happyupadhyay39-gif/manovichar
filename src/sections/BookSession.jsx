import { useState } from 'react'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
export default function BookSession() {
  const [sent, setSent] = useState(false)
  const submit = e => { e.preventDefault(); setSent(true) /* TODO: send to your backend or email service */ }
  return (<section id="book" className="book"><Photo name="book-room" alt="A beautifully lit counselling room" className="book-bg" /><div className="book-shade"/>
    <div className="wrap book-in"><Reveal><h2>Maybe this is your first step.</h2><p>You don't need to have all the answers before you begin.</p></Reveal>
    <Reveal delay={150}>{sent ? <div className="form done"><h3>Thank you.</h3><p>We've received your request and will reply within one working day.</p></div> :
      <form className="form" onSubmit={submit}>
        <label>Name<input name="name" required autoComplete="name"/></label>
        <label>Email<input type="email" name="email" required autoComplete="email"/></label>
        <label>Phone<input type="tel" name="phone" autoComplete="tel"/></label>
        <label>Session type<select name="type"><option>Individual Counselling</option><option>Anxiety &amp; Stress</option><option>Relationship Support</option><option>Self-Esteem &amp; Confidence</option><option>Student &amp; Young Adult Support</option><option>Emotional Wellbeing</option><option>Not sure yet</option></select></label>
        <label>Preferred date<input type="date" name="date"/></label>
        <label className="full">Message<textarea name="message" rows="3"/></label>
        <button className="btn solid gold full" type="submit">Book a Session</button></form>}</Reveal></div></section>)
}
