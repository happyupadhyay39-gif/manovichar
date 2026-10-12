import Photo from '../components/Photo'
import Button from '../components/Button'
import Sketch from '../components/Sketch'
export default function Hero() {
  return (<section id="home" className="hero">
    <div className="hero-frame"><Photo name="hero-image" alt="A welcoming space for mental wellness and support" className="hero-img" loading="eager" /><div className="hero-shade" />
      <div className="hero-copy">
        <Sketch kind="wave" className="hero-line" />
        <p className="label">A space to feel understood</p>
        <h1>A calmer mind begins with a conversation.</h1>
        <p>You don't have to understand everything you're feeling before you ask for support.</p>
        <div className="row"><Button>Book a Session</Button><Button href="#about" variant="ghost">Explore Manovichar</Button></div>
      </div></div></section>)
}
