'use client'
import { MotionConfig } from 'framer-motion'

/**
 * `reducedMotion="user"` makes every framer-motion animation in the tree honour
 * prefers-reduced-motion: transform and layout animations are skipped, opacity is
 * still allowed — so scroll-reveal sections fade in rather than being stranded
 * at opacity 0. A CSS `animation: none` override would not work here, because
 * framer-motion drives these through inline styles rather than CSS animations.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
