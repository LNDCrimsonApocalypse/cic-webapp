'use client'

import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import SetupRequired from '@/components/SetupRequired'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn, signInWithGoogle, isConfigured } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)

  // Show setup required if Supabase is not configured
  if (!isConfigured) {
    return <SetupRequired />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Check if user is admin (will be checked in middleware too)
      // Redirect to dashboard - middleware will handle role-based access
      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-umak-blue hover:text-umak-blue-2 font-metropolis font-semibold flex items-center gap-2 text-sm transition-colors"
            >
              ← Back to Request Form
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-marcellus text-umak-blue mb-3">
              Admin Portal
            </h1>
            <p className="text-gray-600 text-sm sm:text-base font-metropolis">
              Sign in to access the request management system
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-metropolis">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-2 font-metropolis uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@umak.edu.ph"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-umak-blue focus:border-umak-blue transition-all font-metropolis text-base"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-2 font-metropolis uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-umak-blue focus:border-umak-blue transition-all font-metropolis text-base"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-umak-blue focus:ring-umak-blue" />
                <span className="text-gray-600 font-metropolis">Remember me</span>
              </label>
              <a href="#" className="text-umak-blue hover:text-umak-blue-2 font-semibold font-metropolis transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-umak-blue text-white py-4 rounded-md font-bold hover:bg-umak-blue-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-metropolis text-sm uppercase tracking-widest"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-gray-400 text-xs uppercase tracking-widest font-metropolis">
              or continue with
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={async () => {
              setGoogleLoading(true)
              setError('')
              try {
                const { error } = await signInWithGoogle()
                if (error) setError(error.message)
              } catch (err) {
                setError('An unexpected error occurred')
              } finally {
                setGoogleLoading(false)
              }
            }}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-all font-metropolis font-semibold text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Sign in with UMak Email
              </>
            )}
          </button>

          {/* Info Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 font-metropolis font-semibold uppercase tracking-wide">
              Admin Access Only
            </p>
            <div className="bg-blue-50 border-l-4 border-umak-blue p-4 rounded text-xs space-y-2 font-metropolis">
              <p className="text-gray-700">
                This portal is for CIC administrators only. Regular users should use the <Link href="/login" className="text-umak-blue font-semibold hover:underline">User Login</Link>.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs font-metropolis">
              Need help? Contact{' '}
              <a href="mailto:cic@umak.edu.ph" className="text-umak-blue font-semibold hover:underline">
                cic@umak.edu.ph
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-umak-blue via-umak-blue-100 to-umak-blue-2 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-umak-yellow rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-umak-yellow rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          {/* Logo */}
          <div className="mb-12">
            <div className="inline-block bg-umak-yellow p-8 rounded-3xl shadow-2xl mb-8">
              <div className="w-32 h-32 bg-umak-blue rounded-2xl flex items-center justify-center">
                <span className="text-7xl font-marcellus text-umak-yellow">CIC</span>
              </div>
            </div>
            <h2 className="text-4xl font-marcellus text-white mb-4">
              Center for Integrated Communications
            </h2>
            <p className="text-umak-yellow text-lg font-metropolis font-semibold tracking-widest">
              UNIVERSITY OF MAKATI
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-white font-metropolis font-bold text-lg mb-2">Request Management</h3>
              <p className="text-blue-100 font-metropolis text-sm">
                Track and manage all service requests in one centralized dashboard
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-white font-metropolis font-bold text-lg mb-2">Real-time Updates</h3>
              <p className="text-blue-100 font-metropolis text-sm">
                Monitor submission status and communicate with requestors instantly
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="text-white font-metropolis font-bold text-lg mb-2">Analytics Dashboard</h3>
              <p className="text-blue-100 font-metropolis text-sm">
                Gain insights with comprehensive reports and data visualization
              </p>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-blue-200 text-xs font-metropolis mt-12">
            © 2026 University of Makati. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
