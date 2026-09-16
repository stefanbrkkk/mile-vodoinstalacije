import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Address-bar show/hide on mobile must not trigger full refreshes (jumps in pinned sections).
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
