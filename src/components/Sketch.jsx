const d = {
  wave: 'M2 60c40-50 70 40 110 0s70-40 110 5 70 30 110-10',
  loop: 'M20 70c-20-40 30-60 60-40s10 60-30 55-40-40-10-60 70-10 80 20',
  leaf: 'M10 90C10 40 60 10 110 10c0 50-30 90-100 80zM10 90C40 60 70 40 100 20',
  circle: 'M60 8c30-2 52 20 50 50s-24 52-54 50S6 84 8 54 32 12 62 10'
}
export default function Sketch({ kind = 'wave', color = '#0F334F', className = '' }) {
  return <svg className={'sketch ' + className} viewBox="0 0 340 120" aria-hidden="true" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round"><path d={d[kind]} /></svg>
}
