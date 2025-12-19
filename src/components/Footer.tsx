const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Fortunas</h3>
            <p className="text-fortunas-gray text-sm leading-relaxed max-w-md">
              Building modern applications, AI-driven products, and intelligent digital platforms.
            </p>
          </div>

          <div className="md:text-right">
            <h4 className="text-sm font-semibold mb-4">Legal Information</h4>
            <div className="space-y-2 text-sm text-fortunas-gray">
              <p>Legal name: Fortunas</p>
              <p>Legal form: Proprietorship</p>
              <p>D-U-N-S® Number: 473565283</p>
              <p>Registered office: Rotterdam</p>
              <p>Country: The Netherlands</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-center text-sm text-fortunas-gray">
            © {new Date().getFullYear()} Fortunas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
