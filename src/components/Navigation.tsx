import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef, Fragment } from 'react'

const navLinks = [
  { path: '/about', label: 'About' },
  { path: '/what-we-do', label: 'What We Do' },
  { path: '/apps', label: 'Apps' },
  { path: '/technology', label: 'Technology' },
  { path: '/contact', label: 'Contact' },
]

// Listed under "Quizzes", which sits right after the link below. Each quiz is a static
// page in public/ (not a router route), so it is linked with a plain <a>. Add new ones here.
const quizzes = [{ href: '/timewell/quiz', app: 'TimeWell', label: 'Scroll check' }]
const QUIZZES_AFTER = '/apps'

const Navigation = () => {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const quizRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the menu on navigation, so tapping a link does not leave it hanging open.
  useEffect(() => {
    setMenuOpen(false)
    setQuizOpen(false)
  }, [location.pathname])

  // The panel covers the page, so stop the page behind it from scrolling with it.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // The desktop dropdown closes on a click anywhere else, and on Escape.
  useEffect(() => {
    if (!quizOpen) return
    const onDown = (e: MouseEvent) => {
      if (quizRef.current && !quizRef.current.contains(e.target as Node)) setQuizOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuizOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [quizOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'glass-morphism border-b border-white/20 shadow-lg shadow-fortunas-accent/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-fortunas-dark via-fortunas-accent to-fortunas-dark bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Fortunas
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Fragment key={link.path}>
                <Link
                  to={link.path}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    location.pathname === link.path
                      ? 'text-fortunas-accent'
                      : 'text-fortunas-gray hover:text-fortunas-accent'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-[29px] left-0 right-0 h-[2px] bg-gradient-to-r from-fortunas-accent to-fortunas-purple"
                    />
                  )}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="absolute inset-0 blur-md bg-fortunas-accent/10"></span>
                  </span>
                </Link>

                {link.path === QUIZZES_AFTER && (
                  <div
                    ref={quizRef}
                    className="relative"
                    onMouseEnter={() => setQuizOpen(true)}
                    onMouseLeave={() => setQuizOpen(false)}
                  >
                    <button
                      type="button"
                      // Opens only: with a mouse, hovering has already opened it, and a
                      // toggle here would shut it again on the same click. It closes on
                      // leaving it, on a click elsewhere, or on Escape.
                      onClick={() => setQuizOpen(true)}
                      aria-expanded={quizOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                        quizOpen ? 'text-fortunas-accent' : 'text-fortunas-gray hover:text-fortunas-accent'
                      }`}
                    >
                      Quizzes
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${quizOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {quizOpen && (
                      // pt-3 bridges the gap under the button, so moving the mouse down to
                      // the panel never leaves the hover area and closes it on the way.
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3">
                        <div className="min-w-[230px] p-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-xl shadow-fortunas-accent/10 animate-slide-down">
                          {quizzes.map((quiz) => (
                            <a
                              key={quiz.href}
                              href={quiz.href}
                              className="flex flex-col px-4 py-3 rounded-xl hover:bg-fortunas-accent/5 transition-colors"
                            >
                              <span className="text-sm font-semibold text-fortunas-dark">{quiz.app}</span>
                              <span className="text-xs text-fortunas-gray">{quiz.label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden -mr-2 p-2 rounded-xl text-fortunas-dark hover:text-fortunas-accent transition-colors"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <motion.path
                d="M4 7h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={menuOpen ? { d: 'M6 6l12 12' } : { d: 'M4 7h16' }}
                transition={{ duration: 0.2 }}
              />
              <motion.path
                d="M4 12h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ opacity: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.path
                d="M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={menuOpen ? { d: 'M6 18l12 -12' } : { d: 'M4 17h16' }}
                transition={{ duration: 0.2 }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Plain render with a CSS animation rather than an animated height: the menu is the
          only way to navigate on a phone, so it must never depend on a measurement step. */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/20 glass-morphism animate-slide-down">
          <div className="px-6 py-4 flex flex-col">
            {navLinks.map((link) => (
              <Fragment key={link.path}>
                <Link
                  to={link.path}
                  className={`py-4 text-base font-medium border-b border-white/10 transition-colors ${
                    location.pathname === link.path
                      ? 'text-fortunas-accent'
                      : 'text-fortunas-gray hover:text-fortunas-accent'
                  }`}
                >
                  {link.label}
                </Link>
                {/* On a phone the quizzes are listed in place, under their heading. */}
                {link.path === QUIZZES_AFTER && (
                  <div className="py-4 border-b border-white/10">
                    <span className="text-base font-medium text-fortunas-gray">Quizzes</span>
                    <div className="mt-1 flex flex-col">
                      {quizzes.map((quiz) => (
                        <a
                          key={quiz.href}
                          href={quiz.href}
                          className="pl-4 py-2 text-base text-fortunas-gray hover:text-fortunas-accent transition-colors"
                        >
                          {quiz.app} <span className="text-sm opacity-70">— {quiz.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </motion.nav>
  )
}

export default Navigation
