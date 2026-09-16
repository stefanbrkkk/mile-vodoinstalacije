export const INTRO_KEY = 'mile-intro-seen'

/** True when the intro loader already ran in this browser session (or storage is unavailable). */
export function introAlreadySeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return true
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* storage unavailable: loader simply plays again next time */
  }
}

/** Time after navigation start past which the app counts as mounted late (slow network). */
const LATE_MOUNT_MS = 700

/** True when the bundle arrived late: the intro and the hero entrance are skipped so content shows at once. */
export function appMountedLate(): boolean {
  return typeof performance !== 'undefined' && performance.now() > LATE_MOUNT_MS
}

export function shouldSkipIntro(): boolean {
  return introAlreadySeen() || appMountedLate()
}
