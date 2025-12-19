import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Navigation = () => {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/about', label: 'About' },
    { path: '/what-we-do', label: 'What We Do' },
    { path: '/technology', label: 'Technology' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-morphism border-b border-white/20 shadow-lg shadow-fortunas-accent/5' : 'bg-transparent'
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
              <Link
                key={link.path}
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
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation
