import { useState } from 'react'
import './Services.css'

const imageFiles = import.meta.glob('../assets/services/*.jpg', {
  eager: true,
  import: 'default',
})

const services = [
  {
    category: 'Core Specialties',
    title: 'Mental Health Guidance',
    image: imageFiles['../assets/services/mental-health.jpg'],
    imageAlt: 'A one-to-one conversation in a calm setting',
    label: 'Individual Support',
    description:
      'Personalized support for emotional wellbeing, stress, anxiety, confidence, and personal growth.',
    tags: ['Emotional wellbeing', 'Personal growth'],
  },
  {
    category: 'Core Specialties',
    title: 'Relationship & Marriage Therapy',
    image: imageFiles['../assets/services/relationship.jpg'],
    imageAlt: 'Two people talking together in a supportive setting',
    label: 'Relationships',
    description:
      'A supportive space to understand communication, emotional connection, conflict, and relationship challenges.',
    tags: ['Communication', 'Connection'],
  },
  {
    category: 'Core Specialties',
    title: 'Family Guidance',
    image: imageFiles['../assets/services/family.jpg'],
    imageAlt: 'Family members sharing a thoughtful conversation',
    label: 'Family Support',
    description:
      'Helping families build healthier communication, stronger understanding, and supportive relationships.',
    tags: ['Family relationships', 'Understanding'],
  },
  {
    category: 'Core Specialties',
    title: 'Career & Vocational Pathing',
    image: imageFiles['../assets/services/Career.jpg'],
    imageAlt: 'A thoughtful conversation about career and future plans',
    label: 'Career Guidance',
    description:
      'Guidance for career decisions, academic choices, professional growth, and finding a meaningful direction.',
    tags: ['Career decisions', 'Life direction'],
  },
  {
    category: 'Core Specialties',
    title: 'Educational & School Counseling',
    image: imageFiles['../assets/services/School.jpg'],
    imageAlt: 'A student receiving guidance in a supportive setting',
    label: 'Educational Support',
    description:
      'Support for students navigating academic pressure, learning challenges, school transitions, and wellbeing.',
    tags: ['Academic wellbeing', 'School transitions'],
  },
  {
    category: 'Core Specialties',
    title: 'Substance & Behavioral Support',
    image: imageFiles['../assets/services/substance.jpg'],
    imageAlt: 'A supportive counselling conversation',
    label: 'Wellbeing Support',
    description:
      'Compassionate guidance to understand substance use and difficult behavioral patterns and work toward lasting change.',
    tags: ['Behavioral change', 'Recovery'],
  },
  {
    category: 'Core Specialties',
    title: 'Grief & Bereavement Support',
    image: imageFiles['../assets/services/grief.jpg'],
    imageAlt: 'A quiet moment of reflection',
    label: 'Grief Support',
    description:
      'A caring space to process loss, make sense of grief, and find support at your own pace.',
    tags: ['Processing loss', 'Emotional support'],
  },
  {
    category: 'Core Specialties',
    title: 'Rehabilitation Counseling',
    image: imageFiles['../assets/services/rehab.jpg'],
    imageAlt: 'A counselling session focused on recovery and progress',
    label: 'Rehabilitation',
    description:
      'Individualized support for building confidence, coping skills, and meaningful participation through life changes.',
    tags: ['Coping skills', 'Confidence'],
  },
  {
    category: 'Modern Individual Issues',
    title: 'Digital & Social Media Fatigue',
    image: imageFiles['../assets/services/digital-fatigue.jpg'],
    imageAlt: 'A person taking a quiet break from digital devices',
    label: 'Digital Wellbeing',
    description:
      'Explore the effects of constant connectivity and create healthier boundaries with screens and social media.',
    tags: ['Digital balance', 'Healthy boundaries'],
  },
  {
    category: 'Modern Individual Issues',
    title: 'Chronic Loneliness',
    image: imageFiles['../assets/services/loneliness.jpg'],
    imageAlt: 'A person reflecting in a peaceful space',
    label: 'Personal Wellbeing',
    description:
      'Support to understand persistent loneliness, strengthen connection, and build a greater sense of belonging.',
    tags: ['Connection', 'Belonging'],
  },
  {
    category: 'Modern Individual Issues',
    title: 'AI & Future Job Anxiety',
    image: imageFiles['../assets/services/ai-anxiety.jpg'],
    imageAlt: 'A person considering their future work options',
    label: 'Future Readiness',
    description:
      'Navigate uncertainty about automation and changing careers while identifying practical, values-led next steps.',
    tags: ['Career uncertainty', 'Resilience'],
  },
  {
    category: 'Modern Individual Issues',
    title: 'Adolescent Mental Health Crisis',
    image: imageFiles['../assets/services/youth.jpg'],
    imageAlt: 'A young person speaking with a supportive adult',
    label: 'Youth Support',
    description:
      'Age-appropriate support for adolescents experiencing intense emotions, stress, or challenges in daily life.',
    tags: ['Adolescent wellbeing', 'Coping skills'],
  },
  {
    category: 'Modern Individual Issues',
    title: 'Eco Anxiety',
    image: imageFiles['../assets/services/eco-anxiety.jpg'],
    imageAlt: 'A calm natural landscape',
    label: 'Emotional Wellbeing',
    description:
      'Make space for climate-related worry and develop grounded ways to care for yourself and stay engaged.',
    tags: ['Climate concerns', 'Grounding'],
  },
  {
    category: 'Gender-Specific',
    title: "Men's Mental Health",
    image: imageFiles['../assets/services/mens-health.jpg'],
    imageAlt: 'A man reflecting in a calm setting',
    label: 'Men’s Wellbeing',
    description:
      'A confidential space to explore emotional wellbeing, stress, relationships, and expectations around masculinity.',
    tags: ['Emotional wellbeing', 'Stress support'],
  },
  {
    category: 'Gender-Specific',
    title: "Women's Wellness & Burnout",
    image: imageFiles['../assets/services/women-wellness.jpg'],
    imageAlt: 'A woman taking a moment for herself',
    label: 'Women’s Wellbeing',
    description:
      'Support for burnout, competing demands, and the pressures that can affect women’s emotional health.',
    tags: ['Burnout', 'Self-care'],
  },
  {
    category: 'Gender-Specific',
    title: 'Hormonal & Reproductive Transitions',
    image: imageFiles['../assets/services/harmonal.jpg'],
    imageAlt: 'A woman reflecting during a period of change',
    label: 'Life Transitions',
    description:
      'Navigate the emotional impact of hormonal and reproductive changes with understanding and practical support.',
    tags: ['Life transitions', 'Emotional support'],
  },
  {
    category: 'Gender-Specific',
    title: 'Gender-Based Safety Anxiety',
    image: imageFiles['../assets/services/safety-anxiety.jpg'],
    imageAlt: 'A person finding a moment of calm',
    label: 'Safety & Wellbeing',
    description:
      'A supportive space to address anxiety related to safety, boundaries, and navigating everyday environments.',
    tags: ['Safety concerns', 'Boundaries'],
  },
  {
    category: 'LGBTQIA+ & Transgender',
    title: 'Minority Stress & Rejection',
    image: imageFiles['../assets/services/minority.jpg'],
    imageAlt: 'A supportive conversation in an affirming space',
    label: 'Affirming Support',
    description:
      'Affirming support for the effects of stigma, rejection, and minority stress on wellbeing and relationships.',
    tags: ['Minority stress', 'Affirming care'],
  },
  {
    category: 'LGBTQIA+ & Transgender',
    title: 'Gender Dysphoria & Identity',
    image: imageFiles['../assets/services/stress1.jpg'],
    imageAlt: 'A person reflecting on identity in a supportive setting',
    label: 'Identity Support',
    description:
      'A respectful, affirming space to explore gender identity and address distress related to gender dysphoria.',
    tags: ['Gender identity', 'Affirming care'],
  },
]

const categories = [
  'Core Specialties',
  'Modern Individual Issues',
  'Gender-Specific',
  'LGBTQIA+ & Transgender',
]

function ServiceCard({ service }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="service-item">
      <a className="service-link" href="#book" aria-label={`Explore ${service.title}`}>
        <div className="service-image">
          {service.image && !imageFailed ? (
            <img
              src={service.image}
              alt={service.imageAlt}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="service-image-placeholder" role="img" aria-label={service.imageAlt}>
              <span>Image will appear here</span>
            </div>
          )}
        </div>
        <div className="service-copy">
          <p className="service-label">{service.label}</p>
          <h3>{service.title}</h3>
          <p className="service-description">{service.description}</p>
          <ul className="service-tags" aria-label={`${service.title} topics`}>
            {service.tags.map((tag) => (
              <li className="service-tag" key={tag}>{tag}</li>
            ))}
          </ul>
          <span className="service-more">Explore service <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </article>
  )
}

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('Core Specialties')
  const visibleServices = services.filter(({ category }) => category === activeCategory)

  return (
    <section className="services" id="services" aria-labelledby="services-heading">
      <div className="services-inner">
        <header className="services-header">
          <p className="services-eyebrow">Thoughtful care, at your pace</p>
          <h2 id="services-heading">A little support can make room for change.</h2>
          <p className="services-intro">
            Explore a supportive path for the things on your mind, your relationships,
            and the life you want to build.
          </p>
        </header>

        <nav className="services-filters" aria-label="Filter services">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="services-filter"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>

        <div className="services-grid" aria-live="polite">
          {visibleServices.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
