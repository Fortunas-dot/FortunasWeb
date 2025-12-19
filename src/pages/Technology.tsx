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
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden">
        <motion.div
          className="absolute top-10 left-1/2 w-96 h-96 bg-gradient-to-r from-fortunas-cyan/10 to-fortunas-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 10,
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
              <span className="bg-gradient-to-r from-fortunas-cyan via-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
                Technology & AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-fortunas-gray text-balance">
              Building intelligent systems that create competitive advantage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How We Use AI */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-10 rounded-3xl glass-morphism border border-white/20"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-fortunas-cyan to-fortunas-accent rounded-full mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-fortunas-cyan to-fortunas-accent bg-clip-text text-transparent">How we use AI</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-16 bg-gradient-to-r from-fortunas-dark to-fortunas-accent bg-clip-text text-transparent">Our principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {principles.map((principle, index) => {
                const gradients = [
                  'from-fortunas-accent to-fortunas-purple',
                  'from-fortunas-purple to-fortunas-cyan',
                  'from-fortunas-cyan to-fortunas-accent'
                ]
                return (
                  <motion.div
                    key={principle.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="p-8 rounded-2xl glass-morphism border border-white/20 hover:border-white/40 transition-all group"
                  >
                    <div className={`w-12 h-1 bg-gradient-to-r ${gradients[index]} rounded-full mb-6`} />
                    <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent`}>{principle.title}</h3>
                    <p className="text-fortunas-gray leading-relaxed">
                      {principle.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-16 bg-gradient-to-r from-fortunas-dark to-fortunas-purple bg-clip-text text-transparent">Technical capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {capabilities.map((capability, index) => {
                const gradients = [
                  'from-fortunas-accent to-fortunas-purple',
                  'from-fortunas-purple to-fortunas-cyan',
                  'from-fortunas-cyan to-fortunas-accent'
                ]
                return (
                  <motion.div
                    key={capability.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="p-8 rounded-2xl glass-morphism border border-white/20 hover:border-white/40 transition-all group"
                  >
                    <div className={`w-12 h-1 bg-gradient-to-r ${gradients[index]} rounded-full mb-6`} />
                    <h3 className={`text-xl font-bold mb-6 bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent`}>{capability.category}</h3>
                    <ul className="space-y-3">
                      {capability.items.map((item) => (
                        <li key={item} className="flex items-start text-sm">
                          <span className={`bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent mr-3 font-bold`}>→</span>
                          <span className="text-fortunas-gray">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Technology
