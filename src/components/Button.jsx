export default function Button({ href = '#book', variant = 'solid', className = '', children }) {
  return <a href={href} className={`btn ${variant} ${className}`}>{children}</a>
}
