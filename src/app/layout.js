import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '../providers/Web3Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Multichain USDT Approval',
  description: 'Approve USDT tokens across multiple chains',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}