import { motion } from 'framer-motion'

const Technology = () => {
  const principles = [
    {
      title: 'Intelligence',
      description: 'We build systems that learn from data, adapt to patterns, and make informed decisions. Our AI implementations are practical, measurable, and designed to deliver tangible results.'
    },
    {
      title: 'Efficiency',
      description: 'Every solution we create is optimized for performance and resource utilization. We focus on reducing complexity, eliminating waste, and accelerating processes.'
    },
    {
      title: 'Future-Proof',
      description: 'Technology evolves rapidly. We architect solutions with flexibility and scalability at their core, ensuring your investment remains valuable as requirements change.'
    }
  ]

  const capabilities = [
    {
      category: 'Machine Learning',
      items: [
        'Supervised and unsupervised learning models',
        'Deep learning architectures',
        'Model training and optimization',
        'Production deployment and monitoring'
      ]
    },
    {
      category: 'Data Engineering',
      items: [
        'Data pipeline architecture',
        'Real-time processing systems',
        'ETL and data transformation',
        'Data quality and governance'
      ]
    },
    {
      category: 'Infrastructure',
      items: [
        'Cloud-native deployment',
        'Container orchestration',
        'CI/CD automation',
        'Security and compliance'
      ]
    }
  ]

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
              Technology & AI
            </h1>
            <p className="text-xl md:text-2xl text-fortunas-gray text-balance">
              Building intelligent systems that create competitive advantage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How We Use AI */}
      <section className="py-24 px-6 lg:px-8 bg-fortunas-light">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-8">How we use AI</h2>
            <div className="space-y-6 text-lg text-fortunas-gray leading-relaxed">
              <p>
                Artificial intelligence is not a solution in itself—it's a tool that, when applied strategically, can transform operations and unlock new possibilities.
              </p>
              <p>
                We implement AI where it delivers measurable impact: automating complex decision-making, uncovering insights from large datasets, and creating adaptive systems that improve over time.
              </p>
              <p>
                Our approach is grounded in practical application, not speculation. We focus on building systems that solve real problems and deliver quantifiable results.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-16">Our principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-semibold mb-4">{principle.title}</h3>
                  <p className="text-fortunas-gray leading-relaxed">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="py-24 px-6 lg:px-8 bg-fortunas-light">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-16">Technical capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl"
                >
                  <h3 className="text-xl font-semibold mb-6">{capability.category}</h3>
                  <ul className="space-y-3">
                    {capability.items.map((item) => (
                      <li key={item} className="flex items-start text-sm">
                        <span className="text-fortunas-dark mr-3">→</span>
                        <span className="text-fortunas-gray">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Technology
