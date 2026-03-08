import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Server,
  Search,
  Map,
  Code,
  Rocket,
  ChevronRight,
  Menu,
  X,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Shield,
  DollarSign,
  Users,
  Gift,
  Star,
  Briefcase,
  Target
} from 'lucide-react'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const shapeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(shapeRef.current,
        { scale: 0, rotation: 180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' }
      )
        .fromTo(headlineRef.current?.querySelectorAll('.char') || [],
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.03 },
          '-=1'
        )
        .fromTo(subheadlineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(ctaRef.current,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          '-=0.5'
        )

      // Hero scroll effects
      gsap.to(shapeRef.current, {
        y: 200,
        rotation: 45,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      })

      gsap.to(headlineRef.current, {
        filter: 'blur(10px)',
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1,
        }
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Load HubSpot form script
  useEffect(() => {
    const loadHubSpotScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://js-na3.hsforms.net/forms/embed/developer/343022072.js"]')) {
        return
      }

      const script = document.createElement('script')
      script.src = 'https://js-na3.hsforms.net/forms/embed/developer/343022072.js'
      script.defer = true
      script.async = true
      document.body.appendChild(script)
    }

    // Load script when component mounts
    loadHubSpotScript()
  }, [])

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
        {char}
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-dark/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center gap-3">
              <img src="/logo.png" alt="Very Boring Technologies" className="w-10 h-10" />
              <span className="font-display text-2xl font-bold tracking-wider">Very Boring Technologies</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Services</a>
              <a href="#process" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Process</a>
              <a href="#launch-partner" className="text-sm font-medium text-amber-500 hover:text-amber-300 transition-colors">FREE OFFERING</a>
              <a href="#pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Testimonials</a>
              <a href="#contact" className="btn-primary text-sm">Get Started</a>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-dark/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-6 py-4 space-y-4">
              <a href="#services" className="block text-white/70 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#process" className="block text-white/70 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Process</a>
              <a href="#launch-partner" className="block text-white/70 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Launch Partner</a>
              <a href="#pricing" className="block text-white/70 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <a href="#testimonials" className="block text-white/70 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
              <a href="#contact" className="btn-primary text-sm inline-block" onClick={() => setIsMenuOpen(false)}>Get Started</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/30 to-dark" />
        </div>

        {/* Particle overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-accent rounded-full animate-pulse animation-delay-200" />
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-accent rounded-full animate-pulse animation-delay-400" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-green-accent rounded-full animate-pulse animation-delay-300" />
        </div>

        {/* 3D Shape */}
        <div
          ref={shapeRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] pointer-events-none"
        >
          <div className="relative w-full h-full animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple/30 to-blue-accent/30 blur-3xl" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-pink-accent/20 to-purple/20 blur-2xl" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-accent text-xl md:text-2xl text-purple mb-4">We make boring disappeared.</p>
          <h1
            ref={headlineRef}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none mb-6"
          >
            {splitText('BORING WORK')}
            <br />
            <span className="text-gradient">{splitText('BRILLIANTLY DONE')}</span>
          </h1>
          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
          >
            We automate the boring. You focus on the vision. Transform your business with security-first IT services and AI-assisted automation.
          </p>
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#launch-partner" className="btn-primary flex items-center gap-2 text-lg">
              Apply for Launch Partner
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#services" className="px-8 py-4 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
              Explore Services
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-accent text-purple text-xl mb-4">What We Do</p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">OUR SERVICES</h2>
            <p className="text-white/60 max-w-2xl mx-auto">From infrastructure to intelligence, we deliver end-to-end solutions that transform how you work.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Security-first IT Services Card */}
            <div className="group relative">
              <div className="card-glass overflow-hidden transition-all duration-500 hover:shadow-glow h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/service-it.jpg"
                    alt="Security-first IT Services"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-purple/20 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">Security-first IT Services</h3>
                  <p className="text-white/60 mb-4">The engine room of your business. Comprehensive IT infrastructure, support, and management solutions with security at the core.</p>
                  <ul className="space-y-2">
                    {['Cybersecurity', 'PC/Mac Management', 'Network Management', 'Backup & Recovery', 'System Administration','Loaner PC'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-green-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI & Automation Card */}
            <div className="group relative">
              <div className="card-glass overflow-hidden transition-all duration-500 hover:shadow-glow-pink h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/service-ai.jpg"
                    alt="AI & Automation"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-pink-accent/20 flex items-center justify-center mb-4">
                    <Cpu className="w-6 h-6 text-pink-accent" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">AI & Automation</h3>
                  <p className="text-white/60 mb-4">Intelligence that never sleeps. Transform repetitive tasks into automated workflows with AI.</p>
                  <ul className="space-y-2">
                    {['Report Automation', 'Browser Automation', 'Voice Agent', 'Chatbots', 'Natural Language Query based Dasshboard', 'Predictive Analytics', 'Custom Development'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-green-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple/5 via-transparent to-purple/5" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="font-accent text-purple text-xl mb-4">How We Work</p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">THE PROCESS</h2>
            <p className="text-white/60 max-w-2xl mx-auto">A proven methodology that delivers results. From discovery to deployment, we&apos;re with you every step.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                title: 'Discover',
                desc: 'Discover the boring and repetitive tasks in your business.',
                color: 'purple'
              },
              {
                icon: Map,
                title: 'Analyze',
                desc: 'Analyze and map the boring tasks&apos; workflows.',
                color: 'blue'
              },
              {
                icon: Code,
                title: 'Develop',
                desc: 'Develop AI assisted solutions to automate the workflows.',
                color: 'pink'
              },
              {
                icon: Rocket,
                title: 'Deploy',
                desc: 'Deploy the automation and fine-tune it to meet your business goals.',
                color: 'green'
              },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="card-glass p-8 h-full transition-all duration-500 hover:scale-105">
                  <div className={`w-16 h-16 rounded-2xl bg-${step.color}-accent/20 flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-500`}>
                    <step.icon className={`w-8 h-8 text-${step.color}-accent`} />
                  </div>
                  <div className="font-display text-6xl font-bold text-white/10 absolute top-4 right-4">0{i + 1}</div>
                  <h3 className="font-display text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/60">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Partner Program Section */}
      <section id="launch-partner" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-accent/5 via-transparent to-purple/5" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-green-accent/10 rounded-full blur-[150px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-accent/20 text-green-accent rounded-full text-sm font-medium mb-6">
              <Gift className="w-4 h-4" />
              Limited Time Opportunity
            </div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">LAUNCH PARTNER PROGRAM</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We&apos;ll build your automation solution for <span className="text-green-accent font-bold">FREE</span>.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - What You Get */}
            <div className="card-glass p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-accent/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-accent" />
                </div>
                <h3 className="font-display text-3xl font-bold">What You Get</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: CheckCircle2, text: 'Custom solution built tailored for your workflow' },
                  { icon: CheckCircle2, text: 'Full development costs covered by us' },
                  { icon: CheckCircle2, text: '3 months of free usage after deployment' },
                  { icon: CheckCircle2, text: 'Heavily discounted ongoing price' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-green-accent mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - What We Need */}
            <div className="card-glass p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple" />
                </div>
                <h3 className="font-display text-3xl font-bold">What We Need From You</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: Users, text: 'Point of contact from your team' },
                  { icon: Target, text: 'Active participation in testing and refining the solution' },
                  { icon: Rocket, text: 'Use the product in your everyday business operation' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-purple mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>



          {/* Qualifies */}
          <div className="mb-12">
            <h3 className="font-display text-2xl font-bold mb-6 text-center">What we are looking for</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                'Clear workflows that can be automated',
                'Team commitment to collaborate',
                'Use cases with broader market applicability',
              ].map((item, i) => (
                <div key={i} className="card-glass p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-5 h-5 text-purple" />
                  </div>
                  <p className="text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="font-display text-2xl mb-6">Ready to eliminate your boring work?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="btn-primary flex items-center gap-2 text-lg">
                <Gift className="w-5 h-5" />
                Apply for Launch Partner Program
              </a>
              <a href="#pricing" className="px-8 py-4 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
                Standard Consultation
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple/5 via-transparent to-purple/5" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="font-accent text-purple text-xl mb-4">Simple Pricing</p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">PRICING</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Transparent pricing with no hidden fees. Choose what works for your business.</p>
          </div>

          {/* Pricing Cards Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* IT Services Pricing */}
            <div className="card-glass p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-purple/20 flex items-center justify-center mb-6">
                  <Server className="w-7 h-7 text-purple" />
                </div>
                <h3 className="font-display text-3xl font-bold mb-2">Security-first IT Services</h3>
                <p className="text-white/60 mb-2">Per user or device pricing</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple" />
                      <span className="font-medium">Standard User/Device</span>
                    </div>
                    <span className="font-display text-2xl font-bold text-purple">$100<span className="text-base font-normal text-white/50">/mo</span></span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-accent" />
                      <span className="font-medium">Lite User</span>
                    </div>
                    <span className="font-display text-2xl font-bold text-blue-accent">$20<span className="text-base font-normal text-white/50">/mo</span></span>
                  </div>
                </div>
                <p className="mb-2 text-white/50 text-sm italic">24 months term pricing. 20% premium applies to 12 months pricing.</p>
                <ul className="space-y-3">
                  {['Zero-Trust principle', 'Least priviledge approach', 'Patching', 'Unlimited Remote support', 'Managed Detection & Response', 'Regular maintenance', 'Loaner PC'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-green-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

              </div>
            </div>

            {/* AI & Automation Pricing Table */}
            <div className="card-glass overflow-hidden">
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-pink-accent/20 flex items-center justify-center">
                    <Cpu className="w-7 h-7 text-pink-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-3xl font-bold">AI & Automation</h3>
                    <p className="text-white/60">Project-based pricing options</p>
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4 font-display text-lg">Feature</th>
                        <th className="text-center py-4 px-4 font-display text-lg text-green-accent">
                          <div className="flex items-center justify-center gap-2">
                            <Gift className="w-5 h-5" />
                            Launch Partner
                          </div>
                        </th>
                        <th className="text-center py-4 px-4 font-display text-lg text-pink-accent">
                          <div className="flex items-center justify-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Regular Rate
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-4 px-4 text-white/80">Project Development</td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-display text-2xl font-bold text-green-accent">FREE</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-display text-2xl font-bold text-pink-accent">$150<span className="text-base font-normal text-white/50">/hr</span></span>
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4 px-4 text-white/80">Free trial</td>
                        <td className="py-4 px-4 text-center text-green-accent">6 months</td>
                        <td className="py-4 px-4 text-center text-pink-accent">14 days</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4 px-4 text-white/80">Ongoing Rate</td>
                        <td className="py-4 px-4 text-center text-green-accent">Discounted</td>
                        <td className="py-4 px-4 text-center text-pink-accent">Regular</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4 px-4 text-white/80">Custom Solutions</td>
                        <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-accent mx-auto" /></td>
                        <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-accent mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4 px-4 text-white/80">AI Integration</td>
                        <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-accent mx-auto" /></td>
                        <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-accent mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4 px-4 text-white/80">Workflow Optimization</td>
                        <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-accent mx-auto" /></td>
                        <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-accent mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 text-white/80">Ongoing Support</td>
                        <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-accent mx-auto" /></td>
                        <td className="py-4 px-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-accent mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="font-display text-2xl mb-6">Ready to eliminate your boring work?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="btn-primary flex items-center gap-2 text-lg">
                <Gift className="w-5 h-5" />
                Apply for Launch Partner Program
              </a>
              <a href="#contact" className="px-8 py-4 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
                Standard Consultation
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 lg:py-32 bg-dark-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(127, 86, 217, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(127, 86, 217, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
            {[
              { value: '20+', label: 'Projects Delivered', suffix: '' },
              { value: '99.9', label: 'Uptime Guaranteed', suffix: '%' },
              { value: '24/7', label: 'Professional Support', suffix: '' },
            ].map((metric, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-gradient mb-2">
                  {metric.value}
                </div>
                <p className="text-white/60 text-lg">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-accent text-purple text-xl mb-4">What They Say</p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">TESTIMONIALS</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "Professional, knowledgeable and most importantly responsive.Understands our business and what is critical to keep things running smoothly. Always on the lookout to cut costs and improve efficiencies. Perfect supplement to any business that either lacks internal IT resources or has a small team",
                name: 'Jason S',
                title: 'Director of IT, Tap & Barrel Group'
              },
              {
                quote: "Hghly dependable, always solution based and a real pleasure to communicate with. Their support for our business has been extremely beneficial and we highly recommend him and his service",
                name: 'Zach B',
                title: 'Owner, Beach Ave Bar & Grill'
              },
            ].map((testimonial, i) => (
              <div key={i} className="card-glass p-8 lg:p-10 relative">
                <div className="absolute top-6 right-6 text-6xl text-purple/20 font-serif">&quot;</div>
                <p className="text-lg lg:text-xl text-white/80 mb-8 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple to-blue-accent flex items-center justify-center">
                    <span className="font-display text-xl font-bold">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-white/50">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple/20 via-dark to-blue-accent/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/20 rounded-full blur-[150px]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative text-center">
          <p className="font-accent text-purple text-xl mb-4">Ready to Transform?</p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            READY TO ELIMINATE<br />THE <span className="text-gradient">BORING?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Let&apos;s discuss how we can automate your workflows and free your team to focus on what matters most.
          </p>

          <a href="tel:+16048005781" className="btn-primary inline-flex items-center gap-2 text-lg mb-8">
            <Phone className="w-5 h-5" />
            +1-604-800-5781
          </a>

          {/* HubSpot Form */}
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl mb-12">
            <div id="hubspot-form-container" className="hs-form-html" data-region="na3" data-form-id="3e46d87b-17db-437c-bad7-6e46514b3493" data-portal-id="343022072"></div>
          </div>

          <div className="flex items-center justify-center gap-8 text-white/40">
            <Shield className="w-6 h-6" />
            <span className="text-sm">Enterprise-grade security</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span className="text-sm">Free consultation</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span className="text-sm">No commitment required</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <a href="#" className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Very Boring Technologies" className="w-10 h-10" />
                <span className="font-display text-xl font-bold tracking-wider">Very Boring</span>
              </a>
              <p className="text-white/60 max-w-sm mb-6">
                Boring work automated, brilliant results delivered.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://www.linkedin.com/company/satechnology" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-purple/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-3">
                <li><a href="#services" className="text-white/60 hover:text-white transition-colors">IT Services</a></li>
                <li><a href="#services" className="text-white/60 hover:text-white transition-colors">AI & Automation</a></li>
                <li><a href="#launch-partner" className="text-white/60 hover:text-white transition-colors">Launch Partner</a></li>
                <li><a href="#pricing" className="text-white/60 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="text-white/60 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/60">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>501 550 Broadway West<br />Vancouver, BC V5Z 1E9</span>
                </li>
                <li>
                  <a href="mailto:contact@southarm.ca" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    contact@southarm.ca
                  </a>
                </li>
                <li>
                  <a href="tel:+16048005781" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    Tel: 604-800-5781
                  </a>
                </li>
                <li className="flex items-center gap-2 text-white/60">
                  <Phone className="w-4 h-4 flex-shrink-0 opacity-50" />
                  Fax: 778-776-9400
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} South Arm Technology Services Ltd. (d.b.a Very Boring Technologies). All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Signal wave */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-purple/50 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
      </footer>
    </div>
  )
}

export default App
