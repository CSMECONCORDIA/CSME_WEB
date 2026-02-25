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

  const cx = 50
  const cy = 50
  const outerR = 44
  const innerR = 35
  const teeth = 12
  const toothTopHalf = 6
  const toothBaseHalf = 9
  const angleStep = 360 / teeth

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const px = (r: number, deg: number) => (cx + r * Math.sin(toRad(deg))).toFixed(1)
  const py = (r: number, deg: number) => (cy - r * Math.cos(toRad(deg))).toFixed(1)

  let d = ''
  for (let i = 0; i < teeth; i++) {
    const base = i * angleStep
    if (i === 0) {
      d += `M${px(innerR, base - toothBaseHalf)} ${py(innerR, base - toothBaseHalf)}`
    }
    d += ` L${px(outerR, base - toothTopHalf)} ${py(outerR, base - toothTopHalf)}`
    d += ` L${px(outerR, base + toothTopHalf)} ${py(outerR, base + toothTopHalf)}`
    d += ` L${px(innerR, base + toothBaseHalf)} ${py(innerR, base + toothBaseHalf)}`
    const nextBase = (i + 1) * angleStep
    d += ` L${px(innerR, nextBase - toothBaseHalf)} ${py(innerR, nextBase - toothBaseHalf)}`
  }
  d += ' Z'

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
        d={d}
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
