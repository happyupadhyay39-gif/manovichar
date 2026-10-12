import therapistPhoto from '../assets/therapist/therapist-image.png'
import Reveal from '../components/Reveal'
import Sketch from '../components/Sketch'
import Button from '../components/Button'
export default function Therapist() {
  return (<section id="therapist" className="therapist" aria-labelledby="therapist-name"><div className="wrap thr">
    <Reveal className="thr-photo">
      <div className="sage-shape" aria-hidden="true" />
      <div className="gold-dot" aria-hidden="true" />
      <Sketch kind="loop" className="thr-sketch" />
      <img className="photo" src={therapistPhoto} alt="Portrait of Dr. Anuradha Soni" loading="lazy" />
    </Reveal>
    <div className="thr-content">
      <Reveal>
        <p className="thr-eyebrow">Meet Your Therapist</p>
        <h2 className="thr-name" id="therapist-name">Dr. Anuradha Soni</h2>
        <p className="thr-role">Psychologist &amp; Counselling Professional</p>
        <p className="thr-intro">With an M.A. and M.Phil. in Psychology and a Master’s in Clinical Psychology, Dr. Soni brings a strong academic foundation to her work. She supports emotional wellbeing through counselling and psychotherapy, with expertise in emotional intelligence and behavioural transformation.</p>
      </Reveal>
      <Reveal delay={120}>
        <div className="thr-detail">
          <h3>Credentials</h3>
          <ul className="thr-credentials">
            <li>M.A. &amp; M.Phil. in Psychology</li>
            <li>Gold Medalist</li>
            <li>Master’s in Clinical Psychology</li>
            <li>PG Diploma in Guidance &amp; Counselling</li>
          </ul>
        </div>
        <div className="thr-detail">
          <h3>Therapeutic Expertise</h3>
          <ul className="thr-tags" aria-label="Therapeutic approaches">
            <li>CBT</li>
            <li>ACT</li>
            <li>SFBT</li>
            <li>REBT</li>
            <li>Relationship Counselling</li>
            <li>School Counselling</li>
          </ul>
        </div>
        <p className="thr-credibility">Specialized in emotional wellbeing, counselling, psychotherapy, and behavioural transformation.</p>
        <Button href="#book" className="thr-cta">Book a Consultation</Button>
      </Reveal>
    </div>
  </div></section>)
}
