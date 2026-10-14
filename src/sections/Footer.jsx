import Logo from '../components/Logo'
import Button from '../components/Button'
export default function Footer() {
  return (<footer className="footer"><div className="wrap f-grid">
    <div><Logo /><p>A quiet space for conversation, understanding and personal growth.</p><Button>Book a Session</Button></div>
    <div><h4>Explore</h4><a href="#about">About</a><a href="#services">Services</a><a href="#therapist">Therapist</a><a href="#faq">FAQ</a></div>
    <div><h4>Contact</h4><a href="mailto:info@manovichar.com">info@manovichar.com</a><a href="tel:+917568711512">+91 75687 11512</a><span>Jaipur, Rajasthan</span></div>
    <div><h4>Follow</h4><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">YouTube</a></div></div>
    <p className="copy">© {new Date().getFullYear()} Manovichar. Counselling is not a substitute for emergency care.</p></footer>)
}
