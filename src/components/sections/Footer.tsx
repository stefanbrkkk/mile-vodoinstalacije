import { useScroll } from '@/lib/scroll-context'
import { site } from '@/config/site'
import { Button } from '@/components/ui/button'

function UpArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" focusable="false">
      <path
        d="M12 19V6M6 11l6-6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Footer() {
  const { scrollTo } = useScroll()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div className="flex flex-col gap-1">
          <p className="font-display text-lg font-extrabold text-text">{site.name}</p>
          <p className="text-sm text-muted">{site.city}</p>
          <p className="text-sm text-muted">
            © {year} {site.footer.rights}
          </p>
        </div>

        <Button type="button" variant="outline" onClick={() => scrollTo(0)}>
          <UpArrowIcon />
          {site.footer.backToTop}
        </Button>
      </div>
    </footer>
  )
}
