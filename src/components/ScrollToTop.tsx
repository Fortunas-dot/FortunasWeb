import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Without this a route change keeps the previous scroll position, which lands you
// halfway down a long page like the privacy policy. Anchor links keep their behaviour.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}

export default ScrollToTop
