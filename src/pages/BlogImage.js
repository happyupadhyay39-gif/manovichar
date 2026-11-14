import Image from '@tiptap/extension-image'

const IMAGE_LAYOUTS = new Set([
  'full-width',
  'half-width',
  'left-wrap',
  'right-wrap',
  'centered',
  'compact',
])

function toDimension(value, fallback) {
  const dimension = Number.parseInt(value, 10)
  return Number.isFinite(dimension) && dimension > 0 ? Math.min(dimension, 2400) : fallback
}

function toPercentage(value, fallback = 50) {
  const percentage = Number(value)
  return Number.isFinite(percentage) ? Math.min(100, Math.max(0, percentage)) : fallback
}

function getNormalizedSize(attributes) {
  const sourceWidth = Number.parseInt(attributes.width, 10)
  const sourceHeight = Number.parseInt(attributes.height, 10)
  if (!Number.isFinite(sourceWidth) || !Number.isFinite(sourceHeight) || sourceWidth <= 0 || sourceHeight <= 0) {
    return null
  }

  const scale = Math.min(1, 2400 / Math.max(sourceWidth, sourceHeight))
  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale),
  }
}

function getImageWrapperStyle(attributes) {
  const size = getNormalizedSize(attributes)
  const width = size?.width || 720
  const height = size?.height || 480
  const layout = IMAGE_LAYOUTS.has(attributes.layout) ? attributes.layout : 'centered'
  const base = `${size ? `aspect-ratio:${width} / ${height};` : ''}overflow:hidden;`

  if (layout === 'full-width') {
    return `${base}display:block;width:100%;max-width:${width}px;margin:1.5rem auto;`
  }
  if (layout === 'half-width') {
    return `${base}display:block;width:50%;max-width:${width}px;margin:1.5rem auto;`
  }
  if (layout === 'left-wrap') {
    return `${base}display:block;float:left;width:min(48%, ${width}px);margin:.35rem 1.25rem 1rem 0;`
  }
  if (layout === 'right-wrap') {
    return `${base}display:block;float:right;width:min(48%, ${width}px);margin:.35rem 0 1rem 1.25rem;`
  }
  if (layout === 'compact') {
    return `${base}display:block;width:min(35%, ${width}px);margin:1rem auto;`
  }
  return `${base}display:block;width:min(100%, ${width}px);margin:1.5rem auto;`
}

function getImageStyle(attributes) {
  const zoom = Math.min(300, Math.max(100, Number(attributes.zoom) || 100)) / 100
  const fit = attributes.crop ? 'cover' : 'contain'
  const positionX = toPercentage(attributes.positionX)
  const positionY = toPercentage(attributes.positionY)
  return `display:block;width:100%;height:100%;object-fit:${fit};object-position:${positionX}% ${positionY}%;transform:scale(${zoom});`
}

function getImageAttributes(element, container = element) {
  const image = container.matches?.('img') ? container : container.querySelector('img')
  if (!image) return false

  const layout = container.getAttribute('data-image-layout')
  const crop = container.getAttribute('data-image-crop') === 'true'
  return {
    src: image.getAttribute('src'),
    alt: image.getAttribute('alt'),
    title: image.getAttribute('title'),
    width: toDimension(image.getAttribute('width'), null),
    height: toDimension(image.getAttribute('height'), null),
    layout: IMAGE_LAYOUTS.has(layout) ? layout : 'centered',
    crop,
    zoom: toPercentage(container.getAttribute('data-image-zoom'), 100),
    positionX: toPercentage(container.getAttribute('data-image-position-x')),
    positionY: toPercentage(container.getAttribute('data-image-position-y')),
  }
}

const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      layout: { default: 'centered' },
      crop: { default: false },
      zoom: { default: 100 },
      positionX: { default: 50 },
      positionY: { default: 50 },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-blog-image]',
        getAttrs: element => getImageAttributes(element, element),
      },
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: element => getImageAttributes(element),
      },
    ]
  },

  renderHTML({ node }) {
    const attributes = node.attrs
    const size = getNormalizedSize(attributes)

    return [
      'figure',
      {
        'data-blog-image': 'true',
        'data-image-layout': IMAGE_LAYOUTS.has(attributes.layout) ? attributes.layout : 'centered',
        'data-image-crop': attributes.crop ? 'true' : 'false',
        'data-image-zoom': toPercentage(attributes.zoom),
        'data-image-position-x': toPercentage(attributes.positionX),
        'data-image-position-y': toPercentage(attributes.positionY),
        style: getImageWrapperStyle(attributes),
      },
      [
        'img',
        {
          src: attributes.src,
          alt: attributes.alt,
          title: attributes.title,
          ...(size ? { width: size.width, height: size.height } : {}),
          style: getImageStyle(attributes),
        },
      ],
    ]
  },
})

export default BlogImage
