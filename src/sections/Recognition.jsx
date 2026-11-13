import Reveal from '../components/Reveal'
import rankingImage from '../assets/images/peekwire-ranking-comparison.jpeg'
import articleImage from '../assets/images/peekwire-feature-article.jpeg'
import './Recognition.css'

const articleUrl = 'https://peekwire.com/article/5-counseling-practices-worth-knowing-idaho-falls'

export default function Recognition() {
  return (
    <section className="recognition" aria-labelledby="recognition-title">
      <div className="recognition-inner">
        <Reveal className="recognition-copy">
          <p className="recognition-eyebrow">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 2.5 14.8 8l6.1.9-4.4 4.3 1 6.1-5.5-2.9-5.5 2.9 1-6.1-4.4-4.3L9.2 8 12 2.5Z" />
            </svg>
            A moment worth celebrating
          </p>
          <h2 id="recognition-title">A Proud Moment for <span>MANOVICHAR</span></h2>
          <h3>Recognition Beyond Boundaries</h3>
          <p className="recognition-description">
            We are delighted to share a special milestone in Manovichar&apos;s journey.
            Manovichar has been featured among five counseling practices worth knowing
            in Idaho Falls, Idaho, in an article published by Peekwire.
          </p>
          <p className="recognition-description">
            Being featured in this recognition is an encouraging step forward and a
            reminder of our commitment to making mental well-being, compassionate
            guidance, and accessible psychological support matter.
          </p>

          <div className="recognition-award" aria-label="Ranked number two among five counseling practices">
            <span className="recognition-medal" aria-hidden="true">
              <svg viewBox="0 0 40 48">
                <path d="M9 2h9l5 13-7 5L9 2Zm22 0h-9l-5 13 7 5 7-18Z" />
                <circle cx="20" cy="29" r="13" />
                <path d="m20 20 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.8 2.6.9-5.5-4-3.9 5.5-.8L20 20Z" />
              </svg>
            </span>
            <span className="recognition-award-copy">
              <strong>#2 Featured Position</strong>
              <span>Among Five Counseling Practices in Idaho Falls, Idaho</span>
            </span>
          </div>

          <div className="recognition-publication">
            <span><b>Publication</b>Peekwire</span>
            <span><b>Article</b>5 Counseling Practices Worth Knowing in Idaho Falls</span>
          </div>

          <a
            className="recognition-link"
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Full Feature <span aria-hidden="true">→</span>
          </a>
        </Reveal>

        <Reveal className="recognition-gallery" delay={160}>
          <figure className="recognition-image recognition-image-primary">
            <img
              src={rankingImage}
              alt="Manovichar featured at number two in Peekwire's comparison of five counseling practices in Idaho Falls"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Our place among five counseling practices</figcaption>
          </figure>
          <figure className="recognition-image recognition-image-secondary">
            <img
              src={articleImage}
              alt="Peekwire article, 5 Counseling Practices Worth Knowing in Idaho Falls"
              loading="lazy"
              decoding="async"
            />
            <figcaption>The Peekwire feature</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
