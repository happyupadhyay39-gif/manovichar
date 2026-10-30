import { useEffect, useState } from 'react'
import { createBlog, deleteBlog, fetchBlogs } from '../api/blogs'
import './BlogPages.css'

export default function AdminBlogsPage() {
  const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
  const [adminToken, setAdminToken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showWakeUpMessage, setShowWakeUpMessage] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [blogsLoading, setBlogsLoading] = useState(true)
  const [blogsError, setBlogsError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteFeedback, setDeleteFeedback] = useState(null)
  const [pendingDeleteBlog, setPendingDeleteBlog] = useState(null)
  const [deleteToken, setDeleteToken] = useState('')

  async function refreshBlogs(signal) {
    try {
      const data = await fetchBlogs(signal)
      const records = Array.isArray(data) ? data : data?.blogs
      if (!Array.isArray(records)) {
        throw new Error('The blog service returned an unexpected response.')
      }
      setBlogs(records.filter(blog => blog && typeof blog === 'object'))
      setBlogsError('')
    } catch (error) {
      if (error.name !== 'AbortError') {
        setBlogsError(error.message || 'Unable to load blog posts.')
      }
    } finally {
      if (!signal?.aborted) setBlogsLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    refreshBlogs(controller.signal)
    return () => controller.abort()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setShowWakeUpMessage(false)
    setFeedback(null)
    const wakeUpTimer = window.setTimeout(() => {
      setShowWakeUpMessage(true)
    }, 2500)

    const form = event.currentTarget
    const values = new FormData(form)

    try {
      await createBlog({
        title: values.get('title'),
        author: values.get('author'),
        image_url: values.get('image_url'),
        content: values.get('content'),
      }, isLocalHost ? '' : adminToken)
      form.reset()
      setAdminToken('')
      setFeedback({ type: 'success', message: 'Your blog post has been published.' })
      await refreshBlogs()
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Unable to publish the blog post. Please try again.' })
    } finally {
      window.clearTimeout(wakeUpTimer)
      setSubmitting(false)
      setShowWakeUpMessage(false)
    }
  }

  function handleDelete(blog) {
    setPendingDeleteBlog(blog)
    setDeleteToken(adminToken)
    setDeleteFeedback(null)
  }

  async function handleConfirmDelete(event) {
    event.preventDefault()
    if (!pendingDeleteBlog) return
    setDeletingId(pendingDeleteBlog.id)
    setDeleteFeedback(null)
    try {
      await deleteBlog(pendingDeleteBlog.id, deleteToken)
      setBlogs(currentBlogs => currentBlogs.filter(item => item.id !== pendingDeleteBlog.id))
      setPendingDeleteBlog(null)
      setDeleteToken('')
      setDeleteFeedback({ type: 'success', message: 'The blog post was deleted.' })
    } catch (error) {
      setDeleteFeedback({ type: 'error', message: error.message || 'Unable to delete the blog post.' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="admin-blogs-page">
      <div className="admin-blog-panel">
        <header className="admin-blog-heading">
          <p className="blog-eyebrow">Manovichar Journal</p>
          <h1>Publish a story</h1>
          <p>Share a thoughtful resource with the Manovichar community.</p>
        </header>

        <form className="admin-blog-form" onSubmit={handleSubmit}>
          {!isLocalHost && (
            <label>
              Admin token
              <input
                type="password"
                name="adminToken"
                autoComplete="current-password"
                value={adminToken}
                onChange={event => setAdminToken(event.target.value)}
                required
              />
            </label>
          )}

          <label>
            Title
            <input type="text" name="title" autoComplete="off" maxLength="200" required />
          </label>

          <label>
            Author
            <input type="text" name="author" autoComplete="name" maxLength="120" required />
          </label>

          <label>
            Image URL
            <input type="url" name="image_url" placeholder="https://example.com/image.jpg" required />
          </label>

          <label>
            Content
            <textarea name="content" rows="9" required />
          </label>

          {feedback && (
            <p className={`admin-blog-feedback admin-blog-feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
              {feedback.message}
            </p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting
              ? showWakeUpMessage ? 'Waking up server and publishing…' : 'Publishing…'
              : 'Publish blog post'}
          </button>
        </form>

        <section className="admin-blog-list" aria-labelledby="admin-blog-list-title">
          <h2 id="admin-blog-list-title">Manage blog posts</h2>
          {blogsLoading && <p role="status">Loading blog posts…</p>}
          {!blogsLoading && blogsError && <p className="blog-feedback--error" role="alert">{blogsError}</p>}
          {!blogsLoading && !blogsError && blogs.length === 0 && <p>No published posts to manage.</p>}
          {deleteFeedback && (
            <p className={`admin-blog-feedback admin-blog-feedback--${deleteFeedback.type}`} role={deleteFeedback.type === 'error' ? 'alert' : 'status'}>
              {deleteFeedback.message}
            </p>
          )}
          {!blogsLoading && !blogsError && blogs.length > 0 && (
            <ul className="admin-blog-list__items">
              {blogs.map(blog => (
                <li key={blog.id} className="admin-blog-list__item">
                  <span>{blog.title || 'Untitled'}</span>
                  <button
                    className="admin-blog-delete"
                    type="button"
                    disabled={deletingId !== null}
                    onClick={() => handleDelete(blog)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {pendingDeleteBlog && (
        <div className="admin-delete-backdrop">
          <section
            className="admin-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-delete-title"
          >
            <p className="blog-eyebrow">Admin confirmation</p>
            <h2 id="admin-delete-title">Delete this post?</h2>
            <p className="admin-delete-dialog__description">
              “{pendingDeleteBlog.title || 'Untitled'}” will be permanently deleted.
            </p>
            <form className="admin-delete-form" onSubmit={handleConfirmDelete}>
              <label>
                Admin token
                <input
                  type="password"
                  name="deleteToken"
                  autoComplete="current-password"
                  value={deleteToken}
                  onChange={event => setDeleteToken(event.target.value)}
                  required
                  autoFocus
                />
              </label>
              {deleteFeedback?.type === 'error' && (
                <p className="admin-blog-feedback admin-blog-feedback--error" role="alert">
                  {deleteFeedback.message}
                </p>
              )}
              <div className="admin-delete-form__actions">
                <button
                  className="admin-delete-cancel"
                  type="button"
                  disabled={deletingId !== null}
                  onClick={() => {
                    setPendingDeleteBlog(null)
                    setDeleteToken('')
                    setDeleteFeedback(null)
                  }}
                >
                  Cancel
                </button>
                <button className="admin-blog-delete" type="submit" disabled={deletingId !== null}>
                  {deletingId !== null ? 'Deleting…' : 'Confirm delete'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}
