
import { useState } from 'react'
import emailjs from '@emailjs/browser'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'

export default function BookSession() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    const form = e.currentTarget

    try {
      await emailjs.sendForm(
        'service_1is3n02',
        'template_vnhgcsn',
        form,
        {
          publicKey: '20J45tMHrfw-sGaWm',
        }
      )

      setSent(true)
    } catch (err) {
      console.error('Email sending failed:', err)
      setError(
        'Your request could not be sent. Please try again or contact us by email.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="book" className="book">
      <Photo
        name="book-room"
        alt="A beautifully lit counselling room"
        className="book-bg"
      />
      <div className="book-shade" />

      <div className="wrap book-in">
        <Reveal>
          <h2>Maybe this is your first step.</h2>
          <p>
            You don't need to have all the answers before you begin.
          </p>
        </Reveal>

        <Reveal delay={150}>
          {sent ? (
            <div className="form done">
              <h3>Thank you.</h3>
              <p>
                Your request has been sent successfully.
                We'll reply within one working day.
              </p>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <label>
                Name
                <input name="name" required autoComplete="name" />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                />
              </label>

              <label>
                Phone
                <input type="tel" name="phone" autoComplete="tel" />
              </label>

              <label>
                Session type
                <select name="type">
                  <option>Individual Counselling</option>
                  <option>Anxiety &amp; Stress</option>
                  <option>Relationship Support</option>
                  <option>Self-Esteem &amp; Confidence</option>
                  <option>Student &amp; Young Adult Support</option>
                  <option>Emotional Wellbeing</option>
                  <option>Not sure yet</option>
                </select>
              </label>

              <label>
                Preferred date
                <input type="date" name="date" />
              </label>

              <label className="full">
                Message
                <textarea name="message" rows="3" />
              </label>

              {error && (
                <p className="full" role="alert">
                  {error}
                </p>
              )}

              <button
                className="btn solid gold full"
                type="submit"
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Book a Session'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
