import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

type AppEntry = {
  id: string
  name: string
  tagline: string
  icon: string
  tags: string[]
  paragraphs: string[]
  screenshots: { src: string; label: string }[]
  highlights: { title: string; description: string }[]
  // Plain hrefs for external sites; `to` for pages inside this site.
  links: { label: string; href?: string; to?: string; primary?: boolean }[]
  // Aurora's screenshots are dark phone mock-ups, so their tiles get a dark ground.
  darkShots?: boolean
}

const apps: AppEntry[] = [
  {
    id: 'timewell',
    name: 'TimeWell',
    tagline: 'Social media without the slot machine',
    icon: '/timewell/icon.png',
    tags: ['iOS', 'Digital wellbeing', 'React Native', 'In development'],
    paragraphs: [
      'TimeWell isn’t another blocker. Blocking social media outright doesn’t work — you still need to message people, check a profile, see what your friends posted. So TimeWell removes only the parts engineered to keep you scrolling: Reels, Shorts, For You, Explore, suggested posts, ads, AI-generated slop, like counts.',
      'You open Instagram, YouTube, X or Facebook through TimeWell and everything you actually came for is still there. The endless part isn’t.',
    ],
    screenshots: [
      { src: '/timewell/shot-today.jpg', label: 'Today — screen time against a daily goal' },
      { src: '/timewell/shot-browse.jpg', label: 'Browse — platforms opened through the filter' },
      { src: '/timewell/shot-filter.jpg', label: 'Filter — choose exactly what disappears' },
      { src: '/timewell/shot-focus.jpg', label: 'Focus — sessions, sleep window, daily limits' },
    ],
    highlights: [
      {
        title: 'Strip the feed, keep the app',
        description:
          'Reels, Shorts, For You and Explore are gone before the page paints. The messages, the friends and the accounts you chose to follow are untouched.',
      },
      {
        title: 'No ads, no AI slop, no counts',
        description:
          'Global filters that work across every supported platform — sponsored posts, AI-generated content matched on platform disclosure labels, and like and follower counts.',
      },
      {
        title: 'Real screen time',
        description:
          'Per-app minutes, a daily goal, a weekly chart and a streak. Focus sessions with a live countdown, and a ceiling per app when you want one.',
      },
      {
        title: 'Private by design',
        description:
          'You sign in on each platform’s own website, so TimeWell never sees a password. Usage, filters and goals stay on the phone.',
      },
    ],
    links: [
      { label: 'Take the scroll check', href: '/timewell/quiz', primary: true },
      { label: 'Privacy policy', to: '/timewell/privacy' },
      { label: 'Contact support', href: 'mailto:support@timewell.app' },
    ],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    tagline: 'An AI companion and a community for your mental health',
    icon: '/aurora/icon.png',
    tags: ['iOS', 'Mental wellbeing', 'AI companion', 'On the App Store'],
    paragraphs: [
      'Aurora brings two kinds of support into one app: Aurora AI, a companion you can talk to by text or voice whenever you need to, and a community of people who share what they are going through — in a feed, in themed groups and in direct messages.',
      'Alongside them sit the personal tools: journals with mood tracking, insights drawn from your entries, and a calendar. Aurora is not a replacement for a therapist or emergency care, and the app is built with that in mind.',
    ],
    screenshots: [
      { src: '/aurora/shot-home.jpg', label: 'Aurora — streaks, quick actions and the AI hub' },
      { src: '/aurora/shot-ai.jpg', label: 'Aurora AI — a companion that listens' },
      { src: '/aurora/shot-feed.jpg', label: 'Feed — posts, questions and stories' },
      { src: '/aurora/shot-journals.jpg', label: 'Journals — public journeys to learn from' },
    ],
    highlights: [
      {
        title: 'Aurora AI',
        description:
          'A warm, reflective conversation partner by text or voice — it names feelings, asks open questions and can take your own context into account when you allow it.',
      },
      {
        title: 'A community that gets it',
        description:
          'A feed of posts and questions, themed groups to join and direct messages, so nobody has to work through it alone.',
      },
      {
        title: 'Journals and insights',
        description:
          'Write entries with mood and symptoms, browse journeys others have shared, and see patterns in your own over time.',
      },
      {
        title: 'Safety built in',
        description:
          'Aurora is support, not a diagnosis. Dedicated safety logic on the server watches for risk signals in what is shared.',
      },
    ],
    links: [
      { label: 'Download on the App Store', href: 'https://apps.apple.com/nl/app/aurora-ai-therapy-community/id6758727961', primary: true },
      { label: 'Visit the website', href: 'https://aurora-commune.com' },
    ],
    darkShots: true,
  },
]

const Apps = () => {
  usePageTitle('Apps — Fortunas')

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-32 px-6 lg:px-8 relative">
        <motion.div
          className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-fortunas-accent/10 to-fortunas-purple/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-balance">
              <span className="bg-gradient-to-r from-fortunas-dark via-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
                Apps we&apos;ve built
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-fortunas-gray text-balance">
              Products we design, build and ship ourselves — our own bets on what software should
              do, alongside the work we do for others.
            </p>
          </motion.div>
        </div>
      </section>

      {/* One card per app */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          {apps.map((app) => (
            <motion.div
              key={app.id}
              id={app.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 md:p-12 rounded-3xl glass-morphism border border-white/20 scroll-mt-28"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <div className="flex items-center gap-5 mb-8">
                    <img
                      src={app.icon}
                      alt={`${app.name} app icon`}
                      className="w-20 h-20 rounded-[22px] shadow-lg shadow-fortunas-accent/10"
                    />
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
                        {app.name}
                      </h2>
                      <p className="text-fortunas-gray mt-1">{app.tagline}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium glass-morphism border border-white/20 text-fortunas-gray"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {app.paragraphs.map((text, i) => (
                    <p
                      key={i}
                      className={`text-lg text-fortunas-gray leading-relaxed ${
                        i === app.paragraphs.length - 1 ? 'mb-10' : 'mb-6'
                      }`}
                    >
                      {text}
                    </p>
                  ))}

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                    {app.links.map((link) => {
                      const cls = link.primary
                        ? 'px-8 py-4 bg-gradient-to-r from-fortunas-accent to-fortunas-purple text-white rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-fortunas-accent/50 hover:scale-105 text-center'
                        : 'px-8 py-4 glass-morphism border border-white/20 text-fortunas-dark rounded-full text-sm font-medium hover:border-fortunas-accent/50 transition-all hover:shadow-lg hover:shadow-fortunas-accent/20 text-center'
                      if (link.to) {
                        return (
                          <Link key={link.label} to={link.to} className={cls}>
                            {link.label}
                          </Link>
                        )
                      }
                      const external = link.href?.startsWith('http')
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          className={cls}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          {link.label}
                        </a>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {app.screenshots.map((shot, index) => (
                    <motion.figure
                      key={shot.src}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="rounded-2xl overflow-hidden glass-morphism border border-white/20"
                    >
                      <div className={app.darkShots ? 'bg-black px-3 pt-3' : undefined}>
                        <img src={shot.src} alt={shot.label} loading="lazy" className="w-full block" />
                      </div>
                      <figcaption className="px-4 py-3 text-xs text-fortunas-gray">
                        {shot.label}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-white/20">
                {app.highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-8 rounded-2xl glass-morphism border border-white/10"
                  >
                    <div className="w-12 h-1 bg-gradient-to-r from-fortunas-accent to-fortunas-purple rounded-full mb-5" />
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-fortunas-gray leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* More to come */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-3xl glass-morphism border border-white/20 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">More on the way</h2>
            <p className="text-fortunas-gray max-w-2xl mx-auto mb-8">
              If you want to hear when the next one ships, or you have something you want built,
              get in touch.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-fortunas-accent to-fortunas-purple text-white rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-fortunas-accent/50 hover:scale-105"
            >
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Apps
