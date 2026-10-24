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
        <h2 className="thr-name" id="therapist-name">Dr. AR. Soni</h2>
        <p className="thr-role"> Counsultant Psychologist &amp; and Social Scientist</p>
        <p className="thr-intro">Dr. Anuradha Soni is a Counsultant psychologist and counselling professional with five years of experience in child and adolescent psychology. Her work includes counselling, psychotherapy, emotional intelligence, and behavioural transformation.</p>
      </Reveal>
      <Reveal delay={120}>
        <div className="thr-detail">
          <h3>Credentials</h3>
          <ul className="thr-credentials">
            <li> Master’s in Clinical Psychology</li>
            <li>M.Phil.(Gold Medalist) Sociology</li>
            <li>Ph.D. in Sociology</li>
            <li>PG Diploma in Guidance &amp; Counselling</li>
            <li>Certified Emotional Intelligence Expert; trainer and coach in Behavioural Transformation</li>
          </ul>
        </div>
        <div className="thr-detail">
          <h3>Therapeutic Approaches &amp; Areas</h3>
          <ul className="thr-tags" aria-label="Therapeutic approaches">
            <li>CBT</li>
            <li>REBT</li>
            <li>SFBT</li>
            <li>ACT</li>
            <li>Counselling Skills &amp; Process</li>
            <li>Hypnotherapy</li>
            <li>Relationship Counselling</li>
            <li>Geriatric Counselling</li>
            <li>School Counselling</li>
            
          </ul>
        </div>
        <div className="thr-detail">
          <h3>Experience, Research &amp; Publications</h3>
          <p className="thr-credibility">She currently works in child and geriatric psychology and doing research on genetic issues. She also runs social support groups for child-related and relationship concerns, has published research papers, and authored <em>Educated Working Women with Role Conflict: A Socio-Psychological Perspective</em>.</p>
        </div>
        <div className="thr-detail">
          <h3>Additional Certifications</h3>
          <ul className="thr-tags" aria-label="Additional certifications">
            <li>Expertise in Trans-personal Psychology</li>
            <li>Certified Reiki Healing Expert</li>
            <li>Certified Lal Kitab Astrology Expert</li>
            <li>Certified Vedic Astrology Expert</li>

          </ul>
        </div>
        <Button href="#book" className="thr-cta">Book a Consultation</Button>
      </Reveal>
    </div>
  </div></section>)
}
