const WORDS = ['Strength', 'Mobility', 'Conditioning', 'Movement', 'Power', 'Endurance', 'Recovery', 'Discipline']

export default function Marquee() {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="diag relative overflow-hidden border-y border-ink/20 bg-volt py-4">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-2xl uppercase tracking-wide text-ink">{w}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink" fill="currentColor" aria-hidden>
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
