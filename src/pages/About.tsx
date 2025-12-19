import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-32 px-6 lg:px-8 relative">
        <motion.div
          className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-fortunas-accent/10 to-fortunas-purple/10 rounded-full blur-3xl"
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
              <span className="bg-gradient-to-r from-fortunas-dark via-fortunas-accent to-fortunas-purple bg-clip-text text-transparent">
                Building tomorrow's technology today
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-fortunas-gray text-balance">
              Fortunas is a technology company focused on creating intelligent, scalable digital solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-10 rounded-3xl glass-morphism border border-white/20"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-fortunas-accent to-fortunas-purple rounded-full mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-fortunas-dark to-fortunas-accent bg-clip-text text-transparent">Who we are</h2>
            <div className="space-y-6 text-lg text-fortunas-gray leading-relaxed">
              <p>
                Based in Rotterdam, we specialize in developing next-generation applications that leverage artificial intelligence to solve complex business challenges.
              </p>
              <p>
                Our approach combines technical precision with strategic thinking, delivering solutions that are both innovative and practical.
              </p>
              <p>
                We work with organizations that demand excellence and understand the value of well-engineered technology.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Build */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-10 rounded-3xl glass-morphism border border-white/20"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-fortunas-purple to-fortunas-cyan rounded-full mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-fortunas-dark to-fortunas-purple bg-clip-text text-transparent">What we build</h2>
            <div className="space-y-6 text-lg text-fortunas-gray leading-relaxed">
              <p>
                We create AI-powered applications, intelligent automation systems, and scalable digital platforms designed for modern business needs.
              </p>
              <p>
                Every solution we develop is built with performance, security, and long-term sustainability in mind.
              </p>
              <p>
                Our technology stack is carefully selected to ensure reliability, maintainability, and the ability to evolve with changing requirements.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Vision */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-fortunas-dark to-fortunas-cyan bg-clip-text text-transparent">Our vision</h2>
            <div className="space-y-6 text-lg text-fortunas-gray leading-relaxed">
              <p>
                We believe artificial intelligence will fundamentally reshape how organizations operate, and that this transformation requires thoughtful, strategic implementation.
              </p>
              <p>
                Our vision is to build technology that enhances human capability, drives efficiency, and creates genuine competitive advantage.
              </p>
              <p>
                We focus on delivering measurable outcomes, not just deploying technology for its own sake.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
