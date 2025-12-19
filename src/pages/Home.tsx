import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 relative">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-fortunas-accent/20 to-fortunas-purple/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-fortunas-cyan/20 to-fortunas-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-4 py-2 rounded-full glass-morphism border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-medium bg-gradient-to-r from-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
                Next-Generation Technology & AI
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-balance">
              <span className="bg-gradient-to-r from-fortunas-dark via-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
                Intelligence meets innovation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-fortunas-gray mb-12 max-w-3xl mx-auto text-balance">
              We build AI-driven applications that transform how businesses operate in the digital age.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/what-we-do"
                className="px-8 py-4 bg-gradient-to-r from-fortunas-accent to-fortunas-purple text-white rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-fortunas-accent/50 hover:scale-105"
              >
                Explore our work
              </Link>
              <Link
                to="/contact"
                className="group px-8 py-4 glass-morphism border border-white/20 text-fortunas-dark rounded-full text-sm font-medium hover:border-fortunas-accent/50 transition-all hover:shadow-lg hover:shadow-fortunas-accent/20"
              >
                Get in touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Modern Architecture',
                description: 'Built on cutting-edge technology stacks designed for scale, performance, and reliability.',
                gradient: 'from-fortunas-accent to-fortunas-purple'
              },
              {
                title: 'AI-Powered',
                description: 'Intelligent systems that learn, adapt, and deliver measurable results for your business.',
                gradient: 'from-fortunas-purple to-fortunas-cyan'
              },
              {
                title: 'Future-Ready',
                description: 'Solutions engineered to evolve with your needs and the rapidly changing digital landscape.',
                gradient: 'from-fortunas-cyan to-fortunas-accent'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl glass-morphism border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-xl hover:shadow-fortunas-accent/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                <div className={`w-12 h-1 bg-gradient-to-r ${item.gradient} rounded-full mb-6`} />
                <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-fortunas-dark to-fortunas-accent bg-clip-text text-transparent">
                  {item.title}
                </h3>
                <p className="text-fortunas-gray leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-fortunas-accent/5 via-fortunas-purple/5 to-fortunas-cyan/5"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-3xl glass-morphism border border-white/20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              <span className="bg-gradient-to-r from-fortunas-dark via-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
                Ready to build the future?
              </span>
            </h2>
            <p className="text-xl text-fortunas-gray mb-10 text-balance">
              Let's discuss how we can transform your vision into reality.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-fortunas-accent to-fortunas-purple text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-fortunas-accent/50 transition-all"
            >
              Start a conversation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
