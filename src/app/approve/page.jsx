'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { supportedChains } from '../../lib/wagmi'
import { useUSDT } from '../../hooks/useUSDT'
import { ClientWrapper } from '../../components/ClientWrapper'

export default function ApprovePage() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const [selectedChainId, setSelectedChainId] = useState(56) // Default to BSC

    const {
        approve,
        formattedAllowance,
        isApproving,
        isWaitingForConfirmation,
        isProcessing,
        isTransactionConfirmed,
        transactionHash,
        approvalAmount,
        setApprovalAmount,
    } = useUSDT(selectedChainId)

    const handleChainChange = async (newChainId) => {
        setSelectedChainId(newChainId)
        if (isConnected) {
            try {
                await switchChain({ chainId: newChainId })
            } catch (error) {
                console.error('Failed to switch chain:', error)
            }
        }
    }

    const handleApprove = async () => {
        try {
            await approve(approvalAmount, selectedChainId)
        } catch (error) {
            console.error('Approval failed:', error)
        }
    }

    const getChainName = (chainId) => {
        const chain = supportedChains.find(c => c.id === chainId)
        return chain?.name || 'Unknown'
    }

    const getButtonText = () => {
        if (isApproving) return 'Sending Transaction...'
        if (isWaitingForConfirmation) return 'Waiting for Confirmation...'
        return `Approve ${approvalAmount} USDT`
    }

    return (
        <ClientWrapper>
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
                        USDT Approval
                    </h1>

                    {/* Wallet Connection */}
                    <div className="mb-6">
                        {!isConnected ? (
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                                    Connect Your Wallet
                                </h2>
                                {connectors.map((connector) => (
                                    <button
                                        key={connector.uid}
                                        onClick={() => connect({ connector })}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        Connect {connector.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-800 mb-2">
                                    <span className="font-medium">Connected:</span>
                                </p>
                                <p className="text-xs text-green-600 font-mono break-all mb-3">
                                    {address}
                                </p>
                                <button
                                    onClick={() => disconnect()}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Disconnect
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Chain Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Chain
                        </label>
                        <select
                            value={selectedChainId}
                            onChange={(e) => handleChainChange(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {supportedChains.map((chain) => (
                                <option key={chain.id} value={chain.id}>
                                    {chain.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Current: {getChainName(chainId || 0)}
                        </p>
                    </div>

                    {/* Approval Amount */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Approval Amount (USDT)
                        </label>
                        <input
                            type="number"
                            value={approvalAmount}
                            onChange={(e) => setApprovalAmount(e.target.value)}
                            placeholder="Enter amount"
                            disabled={isProcessing}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Transaction Status */}
                    {isProcessing && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <div>
                                    <h3 className="text-sm font-medium text-blue-800">
                                        {isApproving ? 'Processing Transaction' : 'Waiting for Confirmation'}
                                    </h3>
                                    {transactionHash && (
                                        <p className="text-xs text-blue-600 font-mono mt-1">
                                            Tx: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {isTransactionConfirmed && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-green-800">
                                    Transaction Confirmed! Allowance updated.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Current Allowance */}
                    {isConnected && (
                        <div className="mb-6 bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Current Allowance on {getChainName(selectedChainId)}
                                </h3>
                                {(isProcessing) && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                )}
                            </div>
                            <p className="text-lg font-mono text-gray-900">
                                {formattedAllowance} USDT
                            </p>
                        </div>
                    )}

                    {/* Approve Button */}
                    <button
                        onClick={handleApprove}
                        disabled={!isConnected || isProcessing || !approvalAmount}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        {getButtonText()}
                    </button>

                    {/* Navigation */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <a
                            href="/static-approve"
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                        >
                            → Go to Static Chain Approval
                        </a>
                    </div>
                </div>
            </div>
        </ClientWrapper>
    )
}