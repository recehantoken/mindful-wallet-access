import { defaultWagmiConfig } from '@web3modal/wagmi/react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { polygon } from 'wagmi/chains';
import { http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';

// Project ID from Reown (formerly WalletConnect)
const projectId = 'a9fd0615ede0b1e448b9c0084c138b83';
const chains = [polygon] as const;

// Update metadata with all required fields and proper URLs
const metadata = {
  name: 'Recehan Gold',
  description: 'Connect to Recehan Gold',
  url: window.location.origin,
  icons: [`${window.location.origin}/logo.png`],
  verifyUrl: window.location.origin,
  redirect: {
    native: 'YOUR-APP-SCHEME://',
    universal: window.location.origin
  }
};

export const wagmiConfig = defaultWagmiConfig({ 
  chains,
  projectId,
  metadata,
  transports: {
    [polygon.id]: http()
  }
});

// Create modal with only Polygon chain
createWeb3Modal({
  wagmiConfig,
  projectId,
  defaultChain: polygon,
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent': '#FFD700',
  },
  metadata
});

export const connectors = [
  injected(),
  walletConnect({ 
    projectId,
    metadata,
    showQrModal: true 
  })
];