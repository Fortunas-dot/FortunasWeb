import { motion } from 'framer-motion'

const WhatWeDo = () => {
  const services = [
    {
      title: 'Next-Generation Applications',
      description: 'We design and develop modern web and mobile applications built on cutting-edge frameworks and architectures. Each application is engineered for performance, scalability, and exceptional user experience.',
      features: [
        'Progressive web applications',
        'Native mobile development',
        'Real-time data systems',
        'Cloud-native architecture'
      ]
    },
    {
      title: 'AI-Powered Products',
      description: 'Our AI solutions transform raw data into actionable intelligence. We build machine learning models, natural language processing systems, and computer vision applications tailored to your specific needs.',
      features: [
        'Custom ML model development',
        'Natural language processing',
        'Predictive analytics',
        'Computer vision systems'
      ]
    },
    {
      title: 'Intelligent Automation',
      description: 'We implement automation systems that reduce manual effort, minimize errors, and accelerate workflows. Our solutions integrate seamlessly with existing infrastructure.',
      features: [
        'Process automation',
        'Workflow optimization',
        'Smart data processing',
        'API integrations'
      ]
    },
    {
      title: 'Scalable Digital Platforms',
      description: 'From concept to deployment, we build enterprise-grade platforms designed to handle growth. Our platforms are secure, maintainable, and built to evolve with your business.',
      features: [
        'Enterprise architecture',
        'Microservices design',
        'API-first development',
        'Infrastructure as code'
      ]
    }
  ]

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-32 px-6 lg:px-8 relative">
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-fortunas-purple/10 to-fortunas-cyan/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 7,
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
              <span className="bg-gradient-to-r from-fortunas-dark via-fortunas-purple to-fortunas-cyan bg-clip-text text-transparent">
                What we do
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-fortunas-gray text-balance">
              We build intelligent systems that drive real business value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-16">
            {services.map((service, index) => {
              const gradients = [
                'from-fortunas-accent to-fortunas-purple',
                'from-fortunas-purple to-fortunas-cyan',
                'from-fortunas-cyan to-fortunas-accent',
                'from-fortunas-accent to-fortunas-cyan'
              ]
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group relative p-10 rounded-3xl glass-morphism border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
                    <div>
                      <div className={`w-16 h-1 bg-gradient-to-r ${gradients[index]} rounded-full mb-6`} />
                      <h2 className={`text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent`}>
                        {service.title}
                      </h2>
                      <p className="text-lg text-fortunas-gray leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <div className="p-8 rounded-2xl glass-morphism border border-white/10">
                      <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-fortunas-dark">
                        Capabilities
                      </h3>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <span className={`bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent mr-3 font-bold`}>→</span>
                            <span className="text-fortunas-gray">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default WhatWeDo
