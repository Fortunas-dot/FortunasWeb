import { motion } from 'framer-motion'

const Contact = () => {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-32 px-6 lg:px-8 relative">
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-fortunas-accent/10 to-fortunas-cyan/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-balance">
              <span className="bg-gradient-to-r from-fortunas-dark via-fortunas-accent to-fortunas-cyan bg-clip-text text-transparent">
                Let's build something exceptional
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-fortunas-gray text-balance">
              Reach out to discuss how we can help transform your vision into reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-10 rounded-3xl glass-morphism border border-white/20"
            >
              <div className="w-16 h-1 bg-gradient-to-r from-fortunas-accent to-fortunas-purple rounded-full mb-6" />
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">Get in touch</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide text-fortunas-gray">
                    Email
                  </h3>
                  <a
                    href="mailto:info@fortunas.nl"
                    className="text-xl bg-gradient-to-r from-fortunas-accent to-fortunas-purple bg-clip-text text-transparent hover:opacity-70 transition-opacity font-semibold"
                  >
                    info@fortunas.nl
                  </a>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide text-fortunas-gray">
                    Location
                  </h3>
                  <p className="text-xl text-fortunas-dark font-semibold">
                    Rotterdam, The Netherlands
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="p-10 rounded-3xl glass-morphism border border-white/20"
            >
              <div className="w-16 h-1 bg-gradient-to-r from-fortunas-purple to-fortunas-cyan rounded-full mb-6" />
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-fortunas-purple to-fortunas-cyan bg-clip-text text-transparent">What to expect</h2>
              <div className="space-y-6 text-fortunas-gray">
                <p>
                  We respond to all inquiries within 24 hours.
                </p>
                <p>
                  Initial conversations focus on understanding your needs, challenges, and objectives.
                </p>
                <p>
                  We'll discuss whether our capabilities align with your requirements and provide honest guidance on the best path forward.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-3xl glass-morphism border border-white/20"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-fortunas-cyan to-fortunas-accent rounded-full mb-6" />
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-fortunas-cyan to-fortunas-accent bg-clip-text text-transparent">Company information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-fortunas-gray mb-1">Legal name</p>
                <p className="font-semibold text-fortunas-dark">Fortunas</p>
              </div>
              <div>
                <p className="text-fortunas-gray mb-1">Legal form</p>
                <p className="font-semibold text-fortunas-dark">Proprietorship</p>
              </div>
              <div>
                <p className="text-fortunas-gray mb-1">D-U-N-S® Number</p>
                <p className="font-semibold text-fortunas-dark">473565283</p>
              </div>
              <div>
                <p className="text-fortunas-gray mb-1">Registered office</p>
                <p className="font-semibold text-fortunas-dark">Rotterdam, The Netherlands</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
