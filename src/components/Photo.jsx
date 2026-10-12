import { useState } from 'react'
const files = import.meta.glob('../assets/images/*.jpg', { eager: true, import: 'default' })
export default function Photo({ name, alt, className = '', loading = 'lazy' }) {
  const src = files[`../assets/images/${name}.jpg`]; const [bad, setBad] = useState(false)
  if (!src || bad) return <div className={'photo ph ' + className} role="img" aria-label={alt}><span>{alt}</span></div>
  return <img className={'photo ' + className} src={src} alt={alt} loading={loading} onError={() => setBad(true)} />
}
