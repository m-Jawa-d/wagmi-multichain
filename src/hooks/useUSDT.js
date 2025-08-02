import { useAccount, useReadContract, useWriteContract, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { USDT_ADDRESSES, USDT_ABI } from '../lib/wagmi'
import { useState } from 'react'

export function useUSDT(chainId) {
    const { address } = useAccount()
    const { writeContract, isPending: isApproving, data: transactionHash } = useWriteContract()
    const { switchChain } = useSwitchChain()
    const [approvalAmount, setApprovalAmount] = useState('1000')

    // Wait for transaction confirmation
    const { isLoading: isWaitingForConfirmation, isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({
        hash: transactionHash,
        chainId,
    })

    // Get USDT contract address for the specified chain
    const usdtAddress = chainId ? USDT_ADDRESSES[chainId] : undefined

    // Read allowance
    const { data: allowance, refetch: refetchAllowance, error: allowanceError } = useReadContract({
        address: usdtAddress,
        abi: USDT_ABI,
        functionName: 'allowance',
        args: address && usdtAddress ? [address, address] : undefined, // Using same address as spender for demo
        chainId,
        query: {
            enabled: !!address && !!usdtAddress && !!chainId,
            retry: false,
            staleTime: 5000,
        },
    })

    // Read decimals
    const { data: decimals } = useReadContract({
        address: usdtAddress,
        abi: USDT_ABI,
        functionName: 'decimals',
        chainId,
        query: {
            enabled: !!usdtAddress && !!chainId,
            retry: false,
            staleTime: Infinity, // Decimals never change
        },
    })

    // Auto-refetch allowance when transaction is confirmed
    if (isTransactionConfirmed) {
        refetchAllowance()
    }

    // Approve function
    const approve = async (amount, targetChainId) => {
        if (!address || !usdtAddress) return

        const finalChainId = targetChainId || chainId
        const finalAmount = amount || approvalAmount

        try {
            // Switch chain if needed
            if (targetChainId) {
                await switchChain({ chainId: targetChainId })
            }

            // Parse amount with proper decimals
            const parsedAmount = parseUnits(finalAmount, decimals || 18)

            // Execute approval
            const result = await writeContract({
                address: usdtAddress,
                abi: USDT_ABI,
                functionName: 'approve',
                args: [address, parsedAmount], // Using same address as spender for demo
                chainId: finalChainId,
            })

            return result
        } catch (error) {
            console.error('Approval error:', error)
            throw error
        }
    }

    // Format allowance for display
    const formattedAllowance = allowance
        ? formatUnits(allowance, decimals || 18)
        : '0'

    // Combined loading state
    const isProcessing = isApproving || isWaitingForConfirmation

    return {
        approve,
        allowance,
        formattedAllowance,
        isApproving,
        isWaitingForConfirmation,
        isProcessing,
        isTransactionConfirmed,
        transactionHash,
        approvalAmount,
        setApprovalAmount,
        refetchAllowance,
        decimals,
        allowanceError,
    }
}