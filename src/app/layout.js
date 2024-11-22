import { Inter } from 'next/font/google'
import Navbar from '@/components/Common/Navbar'
import Footer from '@/components/Common/Footer'
import { UserProvider } from '@/contexts/UserContext'
import { ReviewsProvider } from '@/contexts/ReviewsContext'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata = {
  title: 'cosine.ai - Smart Shopping Review Analysis',
  description: 'AI-powered shopping review aggregation and analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-[#111827]`}>
        <UserProvider>
          <ReviewsProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ReviewsProvider>
        </UserProvider>
      </body>
    </html>
  )
} 