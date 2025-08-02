import { http, createConfig } from 'wagmi'
import { bsc, base, arbitrum } from 'wagmi/chains'
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Chain configurations
export const supportedChains = [bsc, base, arbitrum]

// USDT contract addresses for each chain
export const USDT_ADDRESSES = {
    [bsc.id]: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
    [base.id]: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', // USDT on Base
    [arbitrum.id]: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT on Arbitrum
}

// USDT ABI (minimal - just approve and allowance functions)
export const USDT_ABI = [
    {
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function'
    }
]

// Wagmi configuration
export const config = createConfig({
    chains: supportedChains,
    connectors: [
        metaMask({
            dappMetadata: {
                name: 'Multichain USDT Approval',
                url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
            },
        }),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '2300a8c467a51f0c4c839bc52065ddf0',
            metadata: {
                name: 'Multichain USDT Approval',
                description: 'Approve USDT across multiple chains',
                url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
                icons: ['https://example.com/icon.png']
            },
            showQrModal: false,
        })
    ],
    transports: {
        [bsc.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
    },
    ssr: true,
})