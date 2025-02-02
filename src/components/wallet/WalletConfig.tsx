import { defaultWagmiConfig } from '@web3modal/wagmi/react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi';
import { polygon } from 'wagmi/chains';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

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
  metadata
});

// Create modal with only Polygon chain
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent': '#FFD700',
  }
});

export const connectors = [
  new MetaMaskConnector({ chains }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId,
      metadata,
      showQrModal: true
    }
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: metadata.name,
    }
  }),
  new EIP6963Connector({ chains })
];
