import { motion } from 'framer-motion'

const Contact = () => {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-balance">
              Let's build something exceptional
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-semibold mb-8">Get in touch</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide text-fortunas-gray">
                    Email
                  </h3>
                  <a
                    href="mailto:info@fortunas.nl"
                    className="text-xl text-fortunas-dark hover:opacity-70 transition-opacity"
                  >
                    info@fortunas.nl
                  </a>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide text-fortunas-gray">
                    Location
                  </h3>
                  <p className="text-xl text-fortunas-dark">
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
              className="bg-fortunas-light p-12 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold mb-6">What to expect</h2>
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
            className="bg-white border border-gray-100 p-12 rounded-2xl"
          >
            <h2 className="text-2xl font-semibold mb-6">Company information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-fortunas-gray mb-1">Legal name</p>
                <p className="font-medium">Fortunas</p>
              </div>
              <div>
                <p className="text-fortunas-gray mb-1">Legal form</p>
                <p className="font-medium">Proprietorship</p>
              </div>
              <div>
                <p className="text-fortunas-gray mb-1">D-U-N-S® Number</p>
                <p className="font-medium">473565283</p>
              </div>
              <div>
                <p className="text-fortunas-gray mb-1">Registered office</p>
                <p className="font-medium">Rotterdam, The Netherlands</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
