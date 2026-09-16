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
