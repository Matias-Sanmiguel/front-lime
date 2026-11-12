import { useId } from 'react'

export function BrandMark({ className = 'h-8 w-8' }) {
  const maskId = useId()

  return (
    <svg viewBox="0 0 48 48" fill="none" className={`shrink-0 ${className}`} aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
          <rect width="48" height="48" fill="#fff" />
          <path d="M0 0h48v26.5L24 5 0 26.5z" fill="#000" />
          <path
            d="M3 27 24 8l21 19"
            stroke="#000"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 27h37M24 27 37.08 40.08M24 27v18M24 27 10.92 40.08"
            stroke="#000"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <circle cx="24" cy="27" r="19.25" className="stroke-brand-rind" strokeWidth="2.5" />
        <circle cx="24" cy="27" r="16.5" className="fill-brand-lime" />
      </g>
      <path
        d="M3 27 24 8l21 19"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Brand() {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Lime">
      <BrandMark />
      <span className="text-[1.6rem] font-semibold leading-none tracking-[-0.04em]">lime</span>
    </span>
  )
}
