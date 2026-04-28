import { Marcellus } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ThemePrompt from '@/components/ThemePrompt'

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
})

export const metadata = {
  title: 'CIC Submission Portal - University of Makati',
  description: 'Center for Integrated Communications - Submission Management System',
  icons: {
    icon: '/images/cic_logo_colored.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={marcellus.variable} suppressHydrationWarning>
      <body className="font-metropolis bg-gray-50 dark:bg-[#020727] transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ThemePrompt />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
