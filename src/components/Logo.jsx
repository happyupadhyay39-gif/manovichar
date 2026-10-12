export default function Logo({ light }) {
  return (<span className={'logo' + (light ? ' light' : '')} aria-label="Manovichar">
    <svg viewBox="0 0 60 64" width="34" height="36" aria-hidden="true" fill="none" strokeLinecap="round">
      <circle cx="30" cy="32" r="17" stroke={light ? '#F7F7F7' : '#0F334F'} strokeWidth="2.4"/>
      <path d="M30 15c-9 8-9 26 0 34" stroke="#ABCAC0" strokeWidth="2.4"/>
      <circle cx="43" cy="22" r="5" fill="#C9A24D"/><path d="M13 40c8 6 20 6 28-2" stroke="#C9A24D" strokeWidth="2"/>
    </svg><span>MANOVICHAR</span></span>)
}
