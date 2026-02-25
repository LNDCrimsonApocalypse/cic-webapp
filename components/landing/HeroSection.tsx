'use client'

import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 right-20 w-96 h-96 bg-umak-yellow opacity-10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-20 left-20 w-96 h-96 bg-umak-blue opacity-10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-6">
              <span className="text-xs font-metropolis font-bold text-umak-blue uppercase tracking-widest">
                University of Makati
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-marcellus text-umak-blue mb-8 leading-tight">
              Creative
              <br />
              Communication
              <br />
              Services
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-metropolis mb-10 leading-relaxed max-w-2xl">
              Professional design, video, event coverage, and digital communication services for the University of Makati (UMak) community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => {
                  const event = new CustomEvent('startRequest')
                  window.dispatchEvent(event)
                }}
                className="px-8 py-4 bg-umak-blue text-white rounded-lg hover:bg-blue-700 transition-all font-bold font-metropolis text-sm uppercase tracking-wider shadow-lg hover:shadow-xl"
              >
                Submit Request
              </button>
              <a
                href="#services"
                className="px-8 py-4 bg-white text-umak-blue border-2 border-umak-blue rounded-lg hover:bg-umak-blue hover:text-white transition-all font-bold font-metropolis text-sm uppercase tracking-wider"
              >
                View Services
              </a>
            </div>
          </div>

          {/* Decorative Content */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-umak-blue to-blue-600 rounded-2xl transform rotate-3 shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-umak-yellow to-yellow-500 rounded-2xl transform -rotate-3 shadow-2xl opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white z-10">
                  <div className="text-6xl font-marcellus mb-4">CIC</div>
                  <div className="text-sm font-metropolis uppercase tracking-widest">
                    Communication Center
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <div className="animate-bounce">
            <div className="w-12 h-12 border-2 border-umak-blue rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-umak-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
