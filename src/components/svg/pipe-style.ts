/**
 * Shared geometry + palette for every copper tube drawn on the page
 * (page pipe, anatomy assembly, faucet). Values are plain numbers/strings so
 * they can be used both in SVG attributes and in runtime path building.
 */

export type Point = { x: number; y: number }

export const TUBE = {
  /** Outer shadow edge of the tube. */
  shadow: '#4A2711',
  copper: '#D9823B',
  copperDeep: '#8A4B1E',
  highlight: '#FFD2A6',
  water: '#3FC5F0',
  guide: '#1E3A52',
  cavity: '#0B1B28',
} as const

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

/** Point `d` units away from `from` in the direction of `to`. */
function along(from: Point, to: Point, d: number): Point {
  const len = distance(from, to) || 1
  return { x: from.x + ((to.x - from.x) * d) / len, y: from.y + ((to.y - from.y) * d) / len }
}

/**
 * Polyline with quadratic elbows. The radius at every corner is clamped to half
 * of the shorter adjacent segment so tight jogs never fold over themselves.
 */
export function roundedPolyline(points: Point[], radius = 14): string {
  const pts: Point[] = []
  for (const p of points) {
    const prev = pts[pts.length - 1]
    if (!prev || distance(prev, p) > 0.5) pts.push(p)
  }
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
  for (let i = 1; i < pts.length - 1; i += 1) {
    const prev = pts[i - 1]
    const cur = pts[i]
    const next = pts[i + 1]
    const r = Math.min(radius, distance(prev, cur) / 2, distance(cur, next) / 2)
    const a = along(cur, prev, r)
    const b = along(cur, next, r)
    d += ` L ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${cur.x.toFixed(2)} ${cur.y.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
  }
  const last = pts[pts.length - 1]
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`
  return d
}

/** One path holding a ring per point — used for the small fittings at elbows. */
export function ringsPath(points: Point[], r = 8): string {
  return points
    .map((p) => {
      const y = p.y.toFixed(2)
      const right = (p.x + r).toFixed(2)
      const left = (p.x - r).toFixed(2)
      return `M ${right} ${y} A ${r} ${r} 0 1 0 ${left} ${y} A ${r} ${r} 0 1 0 ${right} ${y}`
    })
    .join(' ')
}

/** Drawing space of the faucet; the page pipe aligns to these user units. */
export const FAUCET_VIEW = { width: 320, height: 220 } as const
/** Where the page pipe enters the faucet (top of its supply stub). */
export const FAUCET_INLET = { x: 40, y: 4 } as const
/** Tip of the spout, where the drop is born. */
export const FAUCET_SPOUT = { x: 248, y: 108 } as const
/** Pivot of the lever handle, in faucet user units. */
export const FAUCET_PIVOT = '150 94'
