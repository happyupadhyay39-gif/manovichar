import { useEffect, useRef, useState } from 'react'
import { fetchBlogs } from '../api/blogs'
import './BlogPages.css'

function getText(value) {
  return typeof value === 'string' ? value : ''
}

function getPublishedDate(blog) {
  const published = getText(blog.created_at)
    || getText(blog.published_at)
    || getText(blog.publishedAt)
    || getText(blog.date)
  if (!published || Number.isNaN(Date.parse(published))) return null

  return {
    value: published,
    label: new Date(published).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }
}

function getBlogImage(blog) {
  return getText(blog.image_url) || getText(blog.imageUrl) || getText(blog.image)
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [showWakeUpMessage, setShowWakeUpMessage] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    const wakeUpTimer = window.setTimeout(() => {
      setShowWakeUpMessage(true)
    }, 2500)

    setLoading(true)
    setError('')
    setShowWakeUpMessage(false)

    fetchBlogs(controller.signal)
      .then(data => {
        const records = Array.isArray(data) ? data : data?.blogs
        if (!Array.isArray(records)) {
          throw new Error('The blog service returned an unexpected response.')
        }
        setBlogs(records.filter(blog => blog && typeof blog === 'object'))
      })
      .catch(reason => {
        if (reason?.name !== 'AbortError') {
          setError('unavailable')
        }
      })
      .finally(() => {
        window.clearTimeout(wakeUpTimer)
        if (!controller.signal.aborted) {
          setLoading(false)
          setShowWakeUpMessage(false)
        }
      })

    return () => {
      window.clearTimeout(wakeUpTimer)
      controller.abort()
    }
  }, [retryCount])

  useEffect(() => {
    if (!selectedBlog) return undefined

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = event => {
      if (event.key === 'Escape') setSelectedBlog(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      triggerRef.current?.focus()
    }
  }, [selectedBlog])

  const selectedBlogDate = selectedBlog ? getPublishedDate(selectedBlog) : null
  const selectedBlogImage = selectedBlog ? getBlogImage(selectedBlog) : ''

  return (
    <main className="blogs-page">
      <header className="blog-heading">
        <p className="blog-eyebrow">Manovichar Journal</p>
        <h1>Thoughts for a more mindful life.</h1>
        <p className="blog-intro">Reflections and practical guidance for your journey toward emotional wellbeing.</p>
      </header>

      {loading && (
        <p className="blog-feedback" role="status">
          {showWakeUpMessage
            ? 'Our stories are waking up. This can take up to 30 seconds on the first visit.'
            : 'Loading stories…'}
        </p>
      )}
      {!loading && error && (
        <section className="blog-feedback blog-feedback--error" role="alert" aria-live="assertive">
          <h2 className="blog-feedback__title">Stories are temporarily unavailable.</h2>
          <p>Unable to load stories right now. Please check back shortly or refresh.</p>
          <button
            className="blog-retry"
            type="button"
            onClick={() => setRetryCount(count => count + 1)}
          >
            Retry
          </button>
        </section>
      )}
      {!loading && !error && blogs.length === 0 && (
        <p className="blog-feedback">There are no stories to read just yet. Please check back soon.</p>
      )}

      {!loading && !error && blogs.length > 0 && (
        <section className="blog-grid" aria-label="Blog posts">
          {blogs.map((blog, index) => {
            const title = getText(blog.title) || 'Untitled'
            const image = getBlogImage(blog)
            const author = getText(blog.author)
            const content = getText(blog.content)
            const date = getPublishedDate(blog)

            return (
              <button
                className="blog-card"
                key={blog.id ?? `${title}-${index}`}
                type="button"
                aria-label={`Read full article: ${title}`}
                onClick={event => {
                  triggerRef.current = event.currentTarget
                  setSelectedBlog(blog)
                }}
              >
                <div className="blog-card__image">
                  {image
                    ? <img src={image} alt="" loading="lazy" onError={event => { event.currentTarget.style.display = 'none' }} />
                    : <span>Manovichar Journal</span>}
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    {author && <span>By {author}</span>}
                    {date && <time dateTime={date.value}>{date.label}</time>}
                  </div>
                  <h2>{title}</h2>
                  {content && <p>{content}</p>}
                </div>
              </button>
            )
          })}
        </section>
      )}

      {selectedBlog && (
        <div
          className="blog-modal-backdrop"
          onClick={event => {
            if (event.target === event.currentTarget) setSelectedBlog(null)
          }}
        >
          <section
            className="blog-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-modal-title"
          >
            <button
              ref={closeButtonRef}
              className="blog-modal__close"
              type="button"
              aria-label="Close article"
              onClick={() => setSelectedBlog(null)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            {selectedBlogImage && (
              <img
                className="blog-modal__image"
                src={selectedBlogImage}
                alt=""
                onError={event => { event.currentTarget.style.display = 'none' }}
              />
            )}
            <article className="blog-modal__article">
              <p className="blog-eyebrow">Manovichar Journal</p>
              <h2 id="blog-modal-title">{getText(selectedBlog.title) || 'Untitled'}</h2>
              <div className="blog-modal__meta">
                {getText(selectedBlog.author) && <span>By {getText(selectedBlog.author)}</span>}
                {selectedBlogDate && (
                  <time dateTime={selectedBlogDate.value}>{selectedBlogDate.label}</time>
                )}
              </div>
              <div className="blog-modal__content">
                {getText(selectedBlog.content)}
              </div>
            </article>
          </section>
        </div>
      )}
    </main>
  )
}
