import { useEffect, useRef, useState } from 'react'
import { createBlog, deleteBlog, fetchBlogs, updateBlog, uploadBlogImage } from '../api/blogs'
import RichTextEditor from './RichTextEditor'
import './BlogPages.css'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const IMAGE_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

export default function AdminBlogsPage() {
  const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
  const fileInputRef = useRef(null)
  const [adminToken, setAdminToken] = useState('')
  const [editor, setEditor] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [editingBlog, setEditingBlog] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [contentImageUploading, setContentImageUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFeedback, setUploadFeedback] = useState(null)
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

  function handleEditorReady(nextEditor, destroyedEditor) {
    if (nextEditor) {
      setEditor(nextEditor)
    } else {
      setEditor(currentEditor => currentEditor === destroyedEditor ? null : currentEditor)
    }
  }

  useEffect(() => {
    if (!selectedImage) return undefined
    return () => URL.revokeObjectURL(selectedImage.previewUrl)
  }, [selectedImage])

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
    if (contentImageUploading) {
      setFeedback({ type: 'error', message: 'Please wait for the article image to finish uploading.' })
      return
    }
    if (!editor || editor.isEmpty) {
      setFeedback({ type: 'error', message: 'Please write some content before publishing.' })
      return
    }
    if (!title.trim() || !author.trim()) {
      setFeedback({ type: 'error', message: 'Enter a blog title and author name before publishing.' })
      return
    }

    setSubmitting(true)
    setShowWakeUpMessage(false)
    setFeedback(null)
    const wakeUpTimer = window.setTimeout(() => {
      setShowWakeUpMessage(true)
    }, 2500)

    try {
      let imageUrl = uploadedImageUrl
      if (selectedImage && !imageUrl) {
        if (!isLocalHost && !adminToken.trim()) {
          throw new Error('Enter the admin token before uploading an image.')
        }
        setUploading(true)
        setUploadProgress(0)
        imageUrl = await uploadBlogImage(
          selectedImage.file,
          isLocalHost ? '' : adminToken,
          setUploadProgress
        )
        setUploadedImageUrl(imageUrl)
        setUploadFeedback({ type: 'success', message: 'Image uploaded securely.' })
        setUploading(false)
      }

      const blog = {
        title: title.trim(),
        author: author.trim(),
        image_url: imageUrl || null,
        content: editor.getHTML(),
      }
      if (editingBlog) {
        await updateBlog(editingBlog.id, blog, isLocalHost ? '' : adminToken)
      } else {
        await createBlog(blog, isLocalHost ? '' : adminToken)
      }
      editor.commands.clearContent()
      setTitle('')
      setAuthor('')
      setEditingBlog(null)
      setSelectedImage(null)
      setUploadedImageUrl('')
      setUploadProgress(0)
      setUploadFeedback(null)
      setAdminToken('')
      setFeedback({
        type: 'success',
        message: editingBlog ? 'Your blog post has been updated.' : 'Your blog post has been published.',
      })
      await refreshBlogs()
    } catch (error) {
      setUploading(false)
      setFeedback({ type: 'error', message: error.message || 'Unable to publish the blog post. Please try again.' })
    } finally {
      window.clearTimeout(wakeUpTimer)
      setSubmitting(false)
      setShowWakeUpMessage(false)
    }
  }

  async function handleUploadImage() {
    if (!selectedImage || uploading) return
    if (!isLocalHost && !adminToken.trim()) {
      setUploadFeedback({ type: 'error', message: 'Enter the admin token before uploading an image.' })
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadFeedback(null)
    try {
      const imageUrl = await uploadBlogImage(
        selectedImage.file,
        isLocalHost ? '' : adminToken,
        setUploadProgress
      )
      setUploadedImageUrl(imageUrl)
      setUploadFeedback({ type: 'success', message: 'Image uploaded securely.' })
    } catch (error) {
      setUploadFeedback({ type: 'error', message: error.message || 'Unable to upload the image. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  async function handleContentImageUpload(file) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !IMAGE_TYPES[extension] || (file.type && IMAGE_TYPES[extension] !== file.type)) {
      throw new Error('Choose a JPG, JPEG, PNG, or WebP image.')
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('Choose an image smaller than 10 MB.')
    }
    if (!isLocalHost && !adminToken.trim()) {
      throw new Error('Enter the admin token before uploading an image.')
    }

    setContentImageUploading(true)
    try {
      return await uploadBlogImage(file, isLocalHost ? '' : adminToken)
    } finally {
      setContentImageUploading(false)
    }
  }

  function handleImageSelection(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !IMAGE_TYPES[extension] || (file.type && IMAGE_TYPES[extension] !== file.type)) {
      setUploadFeedback({ type: 'error', message: 'Choose a JPG, JPEG, PNG, or WebP image. The current selection has not changed.' })
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setUploadFeedback({ type: 'error', message: 'Choose an image smaller than 10 MB. The current selection has not changed.' })
      return
    }

    setSelectedImage({ file, previewUrl: URL.createObjectURL(file) })
    setUploadedImageUrl('')
    setUploadProgress(0)
    setUploadFeedback(null)
  }

  function handleRemoveImage() {
    if (uploading) return
    setSelectedImage(null)
    setUploadedImageUrl('')
    setUploadProgress(0)
    setUploadFeedback(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleEdit(blog) {
    setEditingBlog(blog)
    setTitle(typeof blog.title === 'string' ? blog.title : '')
    setAuthor(typeof blog.author === 'string' ? blog.author : '')
    setSelectedImage(null)
    setUploadedImageUrl(blog.image_url || blog.imageUrl || blog.image || '')
    setUploadProgress(0)
    setUploadFeedback(null)
    setFeedback(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingBlog(null)
    setTitle('')
    setAuthor('')
    setSelectedImage(null)
    setUploadedImageUrl('')
    setUploadProgress(0)
    setUploadFeedback(null)
    setFeedback(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
          <h1>{editingBlog ? 'Edit your story' : 'Publish a story'}</h1>
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

          <label className="admin-blog-field">
            Blog title
            <input
              type="text"
              name="title"
              autoComplete="off"
              maxLength="200"
              required
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </label>

          <label className="admin-blog-field">
            Author name
            <input
              type="text"
              name="author"
              autoComplete="name"
              maxLength="120"
              required
              value={author}
              onChange={event => setAuthor(event.target.value)}
            />
          </label>

          <section className="admin-image-field" aria-labelledby="admin-image-title">
            <div className="admin-image-field__heading">
              <span id="admin-image-title">Blog image <span className="admin-blog-hint">(optional)</span></span>
              <span className="admin-blog-hint">JPG, PNG or WebP · up to 10 MB</span>
            </div>
            <input
              ref={fileInputRef}
              className="admin-image-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageSelection}
              disabled={uploading}
              aria-label="Choose a blog image"
            />
            <div className="admin-image-controls">
              <button
                className="admin-image-choose"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Choose Image
              </button>
              {selectedImage && (
                <button
                  className="admin-image-remove"
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                >
                  Remove image
                </button>
              )}
              {uploadedImageUrl && !selectedImage && (
                <span className="admin-blog-hint">Current image is saved. Choose a new image to replace it.</span>
              )}
              {uploadedImageUrl && !selectedImage && (
                <button
                  className="admin-image-remove"
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                >
                  Remove image
                </button>
              )}
            </div>
            {(selectedImage || uploadedImageUrl) && (
              <div className="admin-image-preview">
                <img
                  src={selectedImage?.previewUrl || uploadedImageUrl}
                  alt={selectedImage ? 'Preview of the selected blog image' : 'Current blog image'}
                />
                <div className="admin-image-preview__details">
                  {selectedImage
                    ? <>
                      <span>{selectedImage.file.name}</span>
                      <span>{(selectedImage.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                    </>
                    : <span>Current published image</span>}
                </div>
              </div>
            )}
            {selectedImage && !uploadedImageUrl && (
              <button
                className="admin-image-upload"
                type="button"
                onClick={handleUploadImage}
                disabled={uploading}
              >
                {uploading ? `Uploading… ${uploadProgress}%` : 'Upload image'}
              </button>
            )}
            {uploading && (
              <progress className="admin-image-progress" max="100" value={uploadProgress}>
                {uploadProgress}%
              </progress>
            )}
            {uploadFeedback && (
              <p
                className={`admin-blog-feedback admin-blog-feedback--${uploadFeedback.type}`}
                role={uploadFeedback.type === 'error' ? 'alert' : 'status'}
              >
                {uploadFeedback.message}
              </p>
            )}
          </section>

          <div className="admin-blog-field">
            <span>Content</span>
            <RichTextEditor
              key={editingBlog?.id || 'new-blog'}
              onEditorReady={handleEditorReady}
              onImageUpload={handleContentImageUpload}
              initialContent={editingBlog ? editingBlog.content || '' : ''}
            />
            <span className="admin-blog-hint">Format your article using the toolbar above.</span>
          </div>

          {feedback && (
            <p className={`admin-blog-feedback admin-blog-feedback--${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
              {feedback.message}
            </p>
          )}

          <div className="admin-blog-submit-actions">
            {editingBlog && (
              <button
                type="button"
                className="admin-blog-cancel-edit"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel editing
              </button>
            )}
            <button type="submit" disabled={submitting || uploading || contentImageUploading}>
              {submitting
                ? uploading
                  ? `Uploading image… ${uploadProgress}%`
                  : showWakeUpMessage ? 'Waking up server and publishing…' : 'Publishing…'
                : editingBlog ? 'Save blog changes' : 'Publish blog post'}
            </button>
          </div>
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
                  <div className="admin-blog-list__actions">
                    <button className="admin-blog-edit" type="button" onClick={() => handleEdit(blog)}>
                      Edit
                    </button>
                    <button
                      className="admin-blog-delete"
                      type="button"
                      disabled={deletingId !== null}
                      onClick={() => handleDelete(blog)}
                    >
                      Delete
                    </button>
                  </div>
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
