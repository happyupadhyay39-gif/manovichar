import { useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { Selection } from '@tiptap/pm/state'

function ToolbarButton({ label, pressed, disabled, onClick, children }) {
  return (
    <button
      className={`rich-text-editor__button${pressed ? ' is-active' : ''}`}
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onMouseDown={event => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function normalizeLink(value) {
  const trimmed = value.trim()
  if (!trimmed) return ''

  const candidate = /^(https?:|mailto:|tel:)/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  try {
    const url = new URL(candidate)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

export default function RichTextEditor({ onEditorReady, onContentChange, onImageUpload }) {
  const [linkError, setLinkError] = useState('')
  const [imageError, setImageError] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const imageInputRef = useRef(null)
  const imageSelectionRef = useRef(null)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          autolink: false,
          HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
    ],
    content: '',
    editorProps: {
      attributes: {
        'aria-label': 'Blog post content',
        class: 'rich-text-editor__surface',
      },
    },
    onCreate: ({ editor: currentEditor }) => onEditorReady(currentEditor),
    onDestroy: () => onEditorReady(null),
    onUpdate: ({ editor: currentEditor }) => onContentChange(currentEditor.getHTML()),
    immediatelyRender: false,
  })

  if (!editor) return <div className="rich-text-editor" aria-busy="true" />

  async function handleImageSelection(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    let bookmark = imageSelectionRef.current
    imageSelectionRef.current = null
    if (!bookmark) {
      setImageError('Place the cursor in the article before inserting an image.')
      return
    }

    const mapBookmark = ({ transaction }) => {
      bookmark = bookmark.map(transaction.mapping)
    }
    editor.on('transaction', mapBookmark)
    setImageError('')
    setImageUploading(true)
    try {
      const src = await onImageUpload(file)
      const selection = bookmark.resolve(editor.state.doc)
      editor.off('transaction', mapBookmark)
      const inserted = editor.chain()
        .focus()
        .setTextSelection(selection.head)
        .setImage({ src, alt: file.name })
        .run()
      if (inserted && editor.isActive('image')) {
        const { state, view } = editor
        view.dispatch(state.tr.setSelection(
          Selection.near(state.doc.resolve(state.selection.to), 1)
        ))
      }
    } catch (error) {
      setImageError(error.message || 'Unable to insert the image. Please try again.')
    } finally {
      editor.off('transaction', mapBookmark)
      setImageUploading(false)
    }
  }

  function chooseImage() {
    if (editor.isActive('image')) {
      const { state, view } = editor
      view.dispatch(state.tr.setSelection(
        Selection.near(state.doc.resolve(state.selection.to), 1)
      ))
    }
    imageSelectionRef.current = editor.state.selection.getBookmark()
    imageInputRef.current?.click()
  }

  function setLink() {
    setLinkError('')
    const currentHref = editor.getAttributes('link').href || ''
    const value = window.prompt('Enter a website address or email link', currentHref)
    if (value === null) return
    if (!value.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    const href = normalizeLink(value)
    if (href) {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    } else {
      setLinkError('Enter a valid website address, email link, or phone link.')
    }
  }

  const activeAlignment = editor.getAttributes('paragraph').textAlign
    || editor.getAttributes('heading').textAlign
    || 'left'

  return (
    <div className="rich-text-editor">
      <div className="rich-text-editor__toolbar" role="toolbar" aria-label="Text formatting">
        <label className="rich-text-editor__style">
          <span className="sr-only">Text style</span>
          <select
            aria-label="Text style"
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1'
                : editor.isActive('heading', { level: 2 }) ? 'h2'
                  : editor.isActive('heading', { level: 3 }) ? 'h3'
                    : 'paragraph'
            }
            onChange={event => {
              const { value } = event.target
              if (value === 'paragraph') editor.chain().focus().setParagraph().run()
              else editor.chain().focus().toggleHeading({ level: Number(value.slice(1)) }).run()
            }}
          >
            <option value="paragraph">Normal text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
        </label>

        <span className="rich-text-editor__divider" aria-hidden="true" />
        <ToolbarButton label="Bold" pressed={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton label="Italic" pressed={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton label="Underline" pressed={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="rich-text-editor__underlined">U</span>
        </ToolbarButton>

        <span className="rich-text-editor__divider" aria-hidden="true" />
        <ToolbarButton label="Bulleted list" pressed={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <span aria-hidden="true">•≡</span>
        </ToolbarButton>
        <ToolbarButton label="Numbered list" pressed={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <span aria-hidden="true">1≡</span>
        </ToolbarButton>

        <span className="rich-text-editor__divider" aria-hidden="true" />
        {[
          ['left', 'Align left', '☰'],
          ['center', 'Align center', '☷'],
          ['right', 'Align right', '☰'],
        ].map(([alignment, label, icon]) => (
          <ToolbarButton
            key={alignment}
            label={label}
            pressed={activeAlignment === alignment}
            onClick={() => editor.chain().focus().setTextAlign(alignment).run()}
          >
            <span className={`rich-text-editor__align rich-text-editor__align--${alignment}`} aria-hidden="true">{icon}</span>
          </ToolbarButton>
        ))}

        <span className="rich-text-editor__divider" aria-hidden="true" />
        <ToolbarButton label="Insert or edit link" pressed={editor.isActive('link')} onClick={setLink}>
          <span aria-hidden="true">↗</span>
        </ToolbarButton>
        <ToolbarButton
          label="Insert image"
          disabled={imageUploading}
          onClick={chooseImage}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2.5" y="3.5" width="15" height="13" rx="1.8" />
            <circle cx="7" cy="8" r="1.4" />
            <path d="m3.5 14 4.1-3.8 2.8 2.5 2.1-1.8 3.9 3.5" />
          </svg>
        </ToolbarButton>
        <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <span aria-hidden="true">↶</span>
        </ToolbarButton>
        <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <span aria-hidden="true">↷</span>
        </ToolbarButton>
      </div>
      <input
        ref={imageInputRef}
        className="admin-image-input"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleImageSelection}
        aria-label="Choose an image to insert into the article"
      />
      <EditorContent editor={editor} />
      {linkError && <p className="rich-text-editor__error" role="alert">{linkError}</p>}
      {imageError && <p className="rich-text-editor__error" role="alert">{imageError}</p>}
      {imageUploading && <p className="rich-text-editor__error" role="status">Uploading image…</p>}
    </div>
  )
}
