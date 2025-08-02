'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { supportedChains } from '../../lib/wagmi'
import { useUSDT } from '../../hooks/useUSDT'
import { base, bsc } from 'wagmi/chains' // Using Base as the static chain
import { ClientWrapper } from '../../components/ClientWrapper'

const STATIC_CHAIN_ID = bsc.id // You can change this to any of the supported chains

export default function StaticApprovePage() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()
    const chainId = useChainId()
    const { switchChain, isPending: isSwitching } = useSwitchChain()
    const [isChainReady, setIsChainReady] = useState(false)

    const {
        approve,
        formattedAllowance,
        isApproving,
        approvalAmount,
        setApprovalAmount,
    } = useUSDT(STATIC_CHAIN_ID)

    // Auto-switch to static chain when connected
    useEffect(() => {
        const autoSwitchChain = async () => {
            if (isConnected && chainId !== STATIC_CHAIN_ID) {
                try {
                    await switchChain({ chainId: STATIC_CHAIN_ID })
                    setIsChainReady(true)
                } catch (error) {
                    console.error('Failed to auto-switch chain:', error)
                }
            } else if (isConnected && chainId === STATIC_CHAIN_ID) {
                setIsChainReady(true)
            }
        }

        autoSwitchChain()
    }, [isConnected, chainId, switchChain])

    const handleApprove = async () => {
        try {
            // Ensure we're on the correct chain before approving
            if (chainId !== STATIC_CHAIN_ID) {
                await switchChain({ chainId: STATIC_CHAIN_ID })
            }
            await approve(approvalAmount, STATIC_CHAIN_ID)
        } catch (error) {
            console.error('Approval failed:', error)
        }
    }

    const getChainName = (chainId) => {
        const chain = supportedChains.find(c => c.id === chainId)
        return chain?.name || 'Unknown'
    }

    const getStaticChainName = () => {
        return getChainName(STATIC_CHAIN_ID)
    }

    return (
        <ClientWrapper>
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
                        USDT Approval
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Static Chain: <span className="font-semibold text-blue-600">{getStaticChainName()}</span>
                    </p>

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

                    {/* Chain Status */}
                    {isConnected && (
                        <div className="mb-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">
                                    Chain Status
                                </h3>
                                <div className="space-y-1">
                                    <p className="text-xs text-blue-600">
                                        Current: {getChainName(chainId || 0)}
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Target: {getStaticChainName()}
                                    </p>
                                    {isSwitching && (
                                        <p className="text-xs text-orange-600 font-medium">
                                            Switching chains...
                                        </p>
                                    )}
                                    {isChainReady && chainId === STATIC_CHAIN_ID && (
                                        <p className="text-xs text-green-600 font-medium">
                                            ✓ Ready on {getStaticChainName()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Current Allowance */}
                    {isConnected && isChainReady && (
                        <div className="mb-6 bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Current Allowance on {getStaticChainName()}
                            </h3>
                            <p className="text-lg font-mono text-gray-900">
                                {formattedAllowance} USDT
                            </p>
                        </div>
                    )}

                    {/* Approve Button */}
                    <button
                        onClick={handleApprove}
                        disabled={!isConnected || isApproving || isSwitching || !isChainReady || !approvalAmount}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        {isSwitching ? 'Switching Chain...' :
                            isApproving ? 'Approving...' :
                                !isChainReady ? 'Preparing...' :
                                    `Approve ${approvalAmount} USDT`}
                    </button>

                    {/* Auto-switch notice */}
                    {isConnected && chainId !== STATIC_CHAIN_ID && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                This page automatically switches to {getStaticChainName()} for all transactions.
                            </p>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <a
                            href="/approve"
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                        >
                            ← Back to Manual Chain Selection
                        </a>
                    </div>
                </div>
            </div>
        </ClientWrapper>
    )
}