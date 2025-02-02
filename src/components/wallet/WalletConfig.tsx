import { defaultWagmiConfig } from '@web3modal/wagmi/react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { polygon } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = 'a9fd0615ede0b1e448b9c0084c138b83';
const chains = [polygon];

const metadata = {
  name: 'Recehan Gold',
  description: 'Connect to Recehan Gold',
  url: 'https://recehan.gold',
  icons: ['https://recehan.gold/logo.png']
};

export const initializeWalletKit = () => {
  // Initialize wallet kit or any other setup needed
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
  }
});

export const connectors = [
  injected(),
  walletConnect({ 
    projectId,
    metadata,
    showQrModal: true 
  })
];