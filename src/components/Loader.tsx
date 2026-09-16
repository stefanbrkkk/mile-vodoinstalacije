// STUB: replaced by the real implementation.
import { useEffect } from 'react'
export function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    onDone()
  }, [onDone])
  return null
}
