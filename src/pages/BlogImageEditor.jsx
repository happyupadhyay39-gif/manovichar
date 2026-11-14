import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MIN_DIMENSION = 80
const MAX_DIMENSION = 2400

function clampDimension(value) {
  return Math.round(Math.min(MAX_DIMENSION, Math.max(MIN_DIMENSION, Number(value) || MIN_DIMENSION)))
}

function adjustDimensions(current, width, height) {
  const nextWidth = clampDimension(width)
  if (current.maintainAspectRatio) {
    const ratio = current.originalRatio || current.width / current.height
    return { width: nextWidth, height: clampDimension(nextWidth / ratio) }
  }
  return { width: nextWidth, height: clampDimension(height) }
}

const PRESETS = [
  { label: 'Small', width: 320, ratio: 'original' },
  { label: 'Medium', width: 560, ratio: 'original' },
  { label: 'Large', width: 720, ratio: 'original' },
  { label: 'Full Width', width: 1080, ratio: 'original' },
  { label: 'Landscape · 16:9', width: 720, height: 405 },
  { label: 'Wide · 21:9', width: 840, height: 360 },
  { label: 'Square · 1:1', width: 640, height: 640 },
  { label: 'Portrait · 4:5', width: 640, height: 800 },
]

function getInitialDraft(image) {
  const sourceWidth = Number(image.naturalWidth || image.width || 720)
  const sourceHeight = Number(image.naturalHeight || image.height || sourceWidth * .66)
  const originalScale = Math.min(1, MAX_DIMENSION / Math.max(sourceWidth, sourceHeight))
  const originalWidth = clampDimension(sourceWidth * originalScale)
  const originalHeight = clampDimension(sourceHeight * originalScale)
  const currentWidth = Number(image.width || originalWidth)
  const currentHeight = Number(image.height || originalHeight)
  const currentScale = Math.min(1, MAX_DIMENSION / Math.max(currentWidth, currentHeight))
  return {
    width: clampDimension(currentWidth * currentScale),
    height: clampDimension(currentHeight * currentScale),
    originalWidth,
    originalHeight,
    originalRatio: sourceWidth / sourceHeight,
    maintainAspectRatio: !image.crop,
    layout: image.layout || 'centered',
    crop: Boolean(image.crop),
    zoom: image.zoom || 100,
    positionX: image.positionX ?? 50,
    positionY: image.positionY ?? 50,
  }
}

export default function BlogImageEditor({ image, onApply, onCancel }) {
  const [draft, setDraft] = useState(() => getInitialDraft(image))
  const [widthInput, setWidthInput] = useState(() => String(getInitialDraft(image).width))
  const [heightInput, setHeightInput] = useState(() => String(getInitialDraft(image).height))
  const previewRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => setWidthInput(String(draft.width)), [draft.width])
  useEffect(() => setHeightInput(String(draft.height)), [draft.height])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  function setWidth(width) {
    setDraft(current => ({
      ...current,
      ...adjustDimensions(current, width, current.height),
    }))
  }

  function setHeight(height) {
    setDraft(current => {
      if (current.maintainAspectRatio) {
        return {
          ...current,
          height: clampDimension(height),
          width: clampDimension(Number(height) * current.originalRatio),
        }
      }
      return { ...current, height: clampDimension(height) }
    })
  }

  function selectPreset(preset) {
    if (preset.ratio === 'original') {
      setDraft(current => ({
        ...current,
        ...adjustDimensions(
          { ...current, maintainAspectRatio: true },
          preset.width,
          current.height
        ),
        maintainAspectRatio: true,
        crop: false,
      }))
      return
    }

    setDraft(current => ({
      ...current,
      width: preset.width,
      height: preset.height,
      maintainAspectRatio: false,
      crop: true,
    }))
  }

  function startResize(event, direction) {
    event.preventDefault()
    const bounds = previewRef.current?.getBoundingClientRect()
    if (!bounds) return

    dragRef.current = {
      direction,
      startX: event.clientX,
      startY: event.clientY,
      width: draft.width,
      height: draft.height,
      scaleX: bounds.width / draft.width,
      scaleY: bounds.height / draft.height,
    }

    function move(pointerEvent) {
      const drag = dragRef.current
      if (!drag) return
      const horizontal = drag.direction.includes('e') ? 1 : drag.direction.includes('w') ? -1 : 0
      const vertical = drag.direction.includes('s') ? 1 : drag.direction.includes('n') ? -1 : 0
      const width = drag.width + horizontal * (pointerEvent.clientX - drag.startX) / drag.scaleX
      const height = drag.height + vertical * (pointerEvent.clientY - drag.startY) / drag.scaleY

      setDraft(current => {
        if (current.maintainAspectRatio) {
          const widthChange = Math.abs(width - drag.width) / drag.width
          const heightChange = Math.abs(height - drag.height) / drag.height
          const nextWidth = horizontal && (!vertical || widthChange >= heightChange)
            ? clampDimension(width)
            : clampDimension(height * current.originalRatio)
          return {
            ...current,
            ...adjustDimensions(current, nextWidth, current.height),
          }
        }
        return {
          ...current,
          width: clampDimension(width),
          height: clampDimension(height),
        }
      })
    }

    function finish() {
      dragRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', finish)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', finish, { once: true })
  }

  function resetOriginal() {
    setDraft(current => ({
      ...current,
      width: current.originalWidth,
      height: current.originalHeight,
      maintainAspectRatio: true,
      crop: false,
      zoom: 100,
      positionX: 50,
      positionY: 50,
      layout: 'centered',
    }))
  }

  const previewWidth = Math.min(draft.width, 680)
  const layoutWidth = draft.layout === 'half-width'
    ? 50
    : draft.layout === 'left-wrap' || draft.layout === 'right-wrap'
      ? 48
      : draft.layout === 'compact'
        ? 35
        : 100
  const handles = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']

  return createPortal((
    <div
      className="blog-image-editor-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        className="blog-image-editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-image-editor-title"
      >
        <header className="blog-image-editor__header">
          <div>
            <p className="blog-eyebrow">Image settings</p>
            <h2 id="blog-image-editor-title">Shape your image</h2>
          </div>
          <button type="button" className="blog-image-editor__close" aria-label="Cancel image edits" onClick={onCancel}>×</button>
        </header>

        <div className={`blog-image-editor__preview blog-image-editor__preview--${draft.layout}`}>
          <p className="blog-image-editor__preview-copy">
            A thoughtful perspective can help make sense of the moments that shape our wellbeing.
          </p>
          <div
            ref={previewRef}
            className="blog-image-editor__frame"
            style={{
              width: `min(${layoutWidth}%, ${previewWidth}px)`,
              aspectRatio: `${draft.width} / ${draft.height}`,
            }}
          >
            <img
              src={image.src}
              alt={image.alt || 'Image preview'}
              style={{
                objectFit: draft.crop ? 'cover' : 'contain',
                objectPosition: `${draft.positionX}% ${draft.positionY}%`,
                transform: `scale(${draft.zoom / 100})`,
              }}
            />
            {handles.map(direction => (
              <button
                key={direction}
                className={`blog-image-editor__resize blog-image-editor__resize--${direction}`}
                type="button"
                aria-label={`Resize image from ${direction} edge`}
                onPointerDown={event => startResize(event, direction)}
              />
            ))}
          </div>
          <p className="blog-image-editor__preview-copy">
            Gentle guidance and practical ideas can support a more mindful way forward.
          </p>
        </div>

        <div className="blog-image-editor__body">
          <fieldset className="blog-image-editor__presets">
            <legend>Size presets</legend>
            {PRESETS.map(preset => (
              <button key={preset.label} type="button" onClick={() => selectPreset(preset)}>
                {preset.label}
              </button>
            ))}
            <button type="button" onClick={() => setDraft(current => ({ ...current, maintainAspectRatio: false, crop: true }))}>
              Custom Size
            </button>
          </fieldset>

          <div className="blog-image-editor__dimensions">
            <label>
              Width (px)
              <input
                type="number"
                min={MIN_DIMENSION}
                max={MAX_DIMENSION}
                value={widthInput}
                onChange={event => {
                  setWidthInput(event.target.value)
                  if (Number(event.target.value) >= MIN_DIMENSION) setWidth(event.target.value)
                }}
                onBlur={() => {
                  const value = clampDimension(widthInput)
                  setWidth(value)
                  setWidthInput(String(value))
                }}
              />
              <input
                aria-label="Image width"
                type="range"
                min={MIN_DIMENSION}
                max={MAX_DIMENSION}
                step="10"
                value={draft.width}
                onChange={event => setWidth(event.target.value)}
              />
            </label>
            <label>
              Height (px)
              <input
                type="number"
                min={MIN_DIMENSION}
                max={MAX_DIMENSION}
                value={heightInput}
                onChange={event => {
                  setHeightInput(event.target.value)
                  if (Number(event.target.value) >= MIN_DIMENSION) setHeight(event.target.value)
                }}
                onBlur={() => {
                  const value = clampDimension(heightInput)
                  setHeight(value)
                  setHeightInput(String(value))
                }}
              />
              <input
                aria-label="Image height"
                type="range"
                min={MIN_DIMENSION}
                max={MAX_DIMENSION}
                step="10"
                value={draft.height}
                onChange={event => setHeight(event.target.value)}
              />
            </label>
          </div>

          <label className="blog-image-editor__ratio">
            <input
              type="checkbox"
              checked={draft.maintainAspectRatio}
              onChange={event => {
                const maintainAspectRatio = event.target.checked
                setDraft(current => ({
                  ...current,
                  maintainAspectRatio,
                  ...(maintainAspectRatio
                    ? { height: clampDimension(current.width / current.originalRatio), crop: false }
                    : { crop: true }),
                }))
              }}
            />
            Maintain original aspect ratio
          </label>

          <label className="blog-image-editor__field">
            Image layout
            <select
              value={draft.layout}
              onChange={event => setDraft(current => ({ ...current, layout: event.target.value }))}
            >
              <option value="full-width">Full width</option>
              <option value="half-width">Half width</option>
              <option value="left-wrap">Left aligned, wrap text</option>
              <option value="right-wrap">Right aligned, wrap text</option>
              <option value="centered">Centred</option>
              <option value="compact">Compact</option>
            </select>
          </label>

          <div className="blog-image-editor__crop-controls">
            <label>
              Zoom · {draft.zoom}%
              <input
                type="range"
                min="100"
                max="300"
                step="5"
                value={draft.zoom}
                onChange={event => setDraft(current => ({ ...current, zoom: Number(event.target.value) }))}
              />
            </label>
            <label>
              Crop left — centre — right · {draft.positionX}%
              <input
                type="range"
                min="0"
                max="100"
                value={draft.positionX}
                onChange={event => setDraft(current => ({ ...current, positionX: Number(event.target.value) }))}
              />
            </label>
            <label>
              Crop top — centre — bottom · {draft.positionY}%
              <input
                type="range"
                min="0"
                max="100"
                value={draft.positionY}
                onChange={event => setDraft(current => ({ ...current, positionY: Number(event.target.value) }))}
              />
            </label>
          </div>
        </div>

        <footer className="blog-image-editor__actions">
          <button type="button" className="blog-image-editor__reset" onClick={resetOriginal}>Reset to Original Size</button>
          <div>
            <button type="button" className="blog-image-editor__cancel" onClick={onCancel}>Cancel Changes</button>
            <button
              type="button"
              className="blog-image-editor__apply"
              onClick={() => onApply({
                width: draft.width,
                height: draft.height,
                layout: draft.layout,
                crop: draft.crop,
                zoom: draft.zoom,
                positionX: draft.positionX,
                positionY: draft.positionY,
              })}
            >
              Apply Changes
            </button>
          </div>
        </footer>
      </section>
    </div>
  ), document.body)
}
