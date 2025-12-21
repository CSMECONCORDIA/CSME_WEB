export function GearDecoration({
  className = '',
  size = 200,
  spin = false,
  reverse = false
}: {
  className?: string
  size?: number
  spin?: boolean
  reverse?: boolean
}) {
  const spinClass = spin ? (reverse ? 'gear-spin-reverse' : 'gear-spin') : ''

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={`${className} ${spinClass}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 15
           L53 15 L55 10 L60 10 L62 15 L65 16
           L68 12 L73 14 L73 19 L70 22
           L74 25 L78 22 L82 26 L80 31 L76 32
           L78 36 L84 36 L86 42 L81 45 L78 44
           L79 49 L84 52 L83 58 L77 58 L75 55
           L75 60 L80 65 L77 70 L71 68 L70 64
           L68 68 L72 74 L67 78 L62 74 L62 70
           L58 72 L59 79 L53 81 L50 76 L50 72
           L46 73 L44 80 L38 80 L37 74 L40 70
           L35 70 L31 76 L26 73 L29 67 L33 65
           L29 62 L23 65 L20 60 L25 55 L30 55
           L27 51 L20 52 L19 46 L25 44 L30 46
           L29 41 L22 39 L23 33 L30 33 L33 37
           L35 32 L29 27 L33 22 L40 26 L41 31
           L45 28 L43 21 L49 18 L53 23 L51 28
           L50 15 Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      <circle
        cx="50"
        cy="50"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
    </svg>
  )
}
