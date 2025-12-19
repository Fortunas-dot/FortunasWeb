import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-8 text-balance">
              Intelligence meets innovation
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
                className="px-8 py-4 bg-fortunas-dark text-white rounded-full text-sm font-medium hover:bg-fortunas-dark/90 transition-colors"
              >
                Explore our work
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border border-gray-200 text-fortunas-dark rounded-full text-sm font-medium hover:border-gray-300 transition-colors"
              >
                Get in touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 px-6 lg:px-8 bg-fortunas-light">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-4">Modern Architecture</h3>
              <p className="text-fortunas-gray leading-relaxed">
                Built on cutting-edge technology stacks designed for scale, performance, and reliability.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">AI-Powered</h3>
              <p className="text-fortunas-gray leading-relaxed">
                Intelligent systems that learn, adapt, and deliver measurable results for your business.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Future-Ready</h3>
              <p className="text-fortunas-gray leading-relaxed">
                Solutions engineered to evolve with your needs and the rapidly changing digital landscape.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-balance">
              Ready to build the future?
            </h2>
            <p className="text-xl text-fortunas-gray mb-10 text-balance">
              Let's discuss how we can transform your vision into reality.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-fortunas-dark text-white rounded-full text-sm font-medium hover:bg-fortunas-dark/90 transition-colors"
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
