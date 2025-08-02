'use client'

import { useAccount } from 'wagmi'
import Link from 'next/link'
import { ClientWrapper } from '../components/ClientWrapper'

export default function HomePage() {
  const { isConnected, address } = useAccount()

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Multichain USDT Approval
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Approve USDT tokens across BNB Chain, Base, and Arbitrum networks
            </p>

            {isConnected && (
              <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-600 mb-2">Connected Wallet:</p>
                <p className="font-mono text-sm text-blue-600 break-all">{address}</p>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Manual Chain Selection */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Manual Chain Selection
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose your preferred blockchain from BNB Chain, Base, or Arbitrum.
                  Full control over which network to approve USDT on.
                </p>
                <Link
                  href="/approve"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Start Manual Approval
                </Link>
              </div>
            </div>

            {/* Static Chain */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Auto Chain Switch
                </h3>
                <p className="text-gray-600 mb-6">
                  Automatically switch to Base network for USDT approval.
                  Streamlined experience with predefined blockchain selection.
                </p>
                <Link
                  href="/static-approve"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Start Auto Approval
                </Link>
              </div>
            </div>
          </div>

          {/* Supported Networks */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Supported Networks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold text-sm">BNB</span>
                </div>
                <h4 className="font-semibold text-gray-800">BNB Chain</h4>
                <p className="text-xs text-gray-500 mt-1">Fast & Low Cost</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-sm">BASE</span>
                </div>
                <h4 className="font-semibold text-gray-800">Base</h4>
                <p className="text-xs text-gray-500 mt-1">Coinbase L2</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-sm">ARB</span>
                </div>
                <h4 className="font-semibold text-gray-800">Arbitrum</h4>
                <p className="text-xs text-gray-500 mt-1">Ethereum L2</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500">
            <p className="text-sm">
              Built with Next.js, Wagmi, and Viem for seamless multichain interactions
            </p>
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}