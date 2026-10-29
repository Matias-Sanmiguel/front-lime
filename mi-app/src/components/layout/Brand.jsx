export function Brand() {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Lime">
      <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8 shrink-0" aria-hidden="true">
        <path
          d="M9 8v18a6 6 0 0 0 6 6h17"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25 8h7v7"
          className="text-accent-ink"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[1.6rem] font-semibold leading-none tracking-[-0.04em]">lime</span>
    </span>
  )
}
