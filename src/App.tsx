import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import WhatWeDo from './pages/WhatWeDo'
import Technology from './pages/Technology'
import Apps from './pages/Apps'
import TimeWellPrivacy from './pages/TimeWellPrivacy'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/timewell/privacy" element={<TimeWellPrivacy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
